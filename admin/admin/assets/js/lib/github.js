
// Minimal GitHub REST API wrapper
const GitHub = (()=>{
  async function request(cfg, path, opts={}){
    const url = `https://api.github.com${path}`;
    const res = await fetch(url, {
      ...opts,
      headers: {
        'Accept':'application/vnd.github+json',
        'Authorization': `Bearer ${cfg.token}`,
        ...(opts.headers||{})
      }
    });
    if(!res.ok){
      const t = await res.text();
      throw new Error(`GitHub API ${res.status}: ${t}`);
    }
    return res.json();
  }
  async function getContent(cfg, filePath){
    const q = `/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(filePath)}?ref=${encodeURIComponent(cfg.branch)}`;
    return request(cfg, q);
  }
  async function putContent(cfg, filePath, contentBase64, message, sha=null){
    const q = `/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(filePath)}`;
    const body = { message, content: contentBase64, branch: cfg.branch };
    if(sha){ body.sha = sha; }
    return request(cfg, q, { method:'PUT', body: JSON.stringify(body) });
  }
  async function ensureJson(cfg, filePath, defaultObj){
    try{
      const j = await getContent(cfg, filePath);
      const raw = atob(j.content.replace(/\n/g,''));
      return { json: JSON.parse(raw), sha: j.sha };
    }catch(e){
      // create with default
      const contentBase64 = btoa(JSON.stringify(defaultObj, null, 2));
      const r = await putContent(cfg, filePath, contentBase64, `chore: initialize ${filePath}`);
      return { json: defaultObj, sha: r.content.sha };
    }
  }
  function toBase64FromFile(file){
    return new Promise((resolve,reject)=>{
      const reader = new FileReader();
      reader.onload = ()=>{
        const arr = new Uint8Array(reader.result);
        let binary = '';
        for(let i=0;i<arr.byteLength;i++){ binary += String.fromCharCode(arr[i]); }
        resolve(btoa(binary));
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }
  return { request, getContent, putContent, ensureJson, toBase64FromFile };
})();
