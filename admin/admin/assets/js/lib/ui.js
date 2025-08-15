
function setRepoLabel(cfg){
  const el = document.getElementById('gh-repo-label');
  if(el && cfg){
    el.textContent = `${cfg.owner}/${cfg.repo}@${cfg.branch}`;
  }
}
function toast(msg){
  alert(msg); // simple
}
