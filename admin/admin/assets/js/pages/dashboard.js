
const cfg = requireAuth();
if(cfg){ setRepoLabel(cfg); }
(async ()=>{
  try{
    const pj = await GitHub.ensureJson(cfg, `${cfg.dataPath}/projects.json`, { items: [] });
    const bj = await GitHub.ensureJson(cfg, `${cfg.dataPath}/blogs.json`, { items: [] });
    document.getElementById('projects-count').textContent = pj.json.items.length;
    document.getElementById('blogs-count').textContent = bj.json.items.length;
    document.getElementById('last-commit').textContent = new Date().toLocaleString();
  }catch(e){
    toast(e.message);
  }
})();
