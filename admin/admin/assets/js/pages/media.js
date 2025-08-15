
const cfg = requireAuth(); if(cfg){ setRepoLabel(cfg); }
document.getElementById('upload').addEventListener('click', async ()=>{
  const files = document.getElementById('files').files;
  if(!files.length){ toast('Choose files'); return; }
  const out = document.getElementById('result'); out.innerHTML='';
  for(const file of files){
    const b64 = await GitHub.toBase64FromFile(file);
    const path = `${cfg.dataPath}/media/${file.name}`;
    try{
      const r = await GitHub.putContent(cfg, path, b64, `media: add ${file.name}`);
      const p = document.createElement('p'); p.textContent = `Uploaded ${file.name}`; out.appendChild(p);
    }catch(e){
      const p = document.createElement('p'); p.textContent = `Failed ${file.name}: ${e.message}`; out.appendChild(p);
    }
  }
  toast('Upload complete');
});
