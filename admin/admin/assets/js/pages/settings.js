
const cfg = requireAuth(); if(cfg){ setRepoLabel(cfg); }
let state = { json: {}, sha: null };
function fill(){
  document.getElementById('s-name').value = state.json.siteName||'';
  document.getElementById('s-logo').value = state.json.logo||'';
  document.getElementById('s-twitter').value = (state.json.social||{}).twitter||'';
  document.getElementById('s-linkedin').value = (state.json.social||{}).linkedin||'';
  document.getElementById('s-footer').value = state.json.footer||'';
}
async function load(){
  const res = await GitHub.ensureJson(cfg, `${cfg.dataPath}/settings.json`, { siteName:'Your Site', logo:'', social:{twitter:'',linkedin:''}, footer:'' });
  state.json = res.json; state.sha = res.sha; fill();
}
async function save(){
  const j = {
    siteName: document.getElementById('s-name').value.trim(),
    logo: document.getElementById('s-logo').value.trim(),
    social: { twitter: document.getElementById('s-twitter').value.trim(), linkedin: document.getElementById('s-linkedin').value.trim() },
    footer: document.getElementById('s-footer').value.trim()
  };
  const path = `${cfg.dataPath}/settings.json`;
  const content = btoa(JSON.stringify(j, null, 2));
  const r = await GitHub.putContent(cfg, path, content, 'content: update settings.json', state.sha);
  state.sha = r.content.sha; toast('Saved settings.');
}
document.getElementById('save').addEventListener('click', save);
load();
