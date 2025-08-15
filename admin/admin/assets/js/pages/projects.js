
const cfg = requireAuth(); if(cfg){ setRepoLabel(cfg); }
let state = { items: [], sha: null };

function openModal(editIdx=null){
  document.getElementById('project-modal').classList.remove('hidden');
  document.getElementById('modal-backdrop').classList.add('show');
  document.getElementById('modal-title').textContent = (editIdx==null)?'New project':'Edit project';
  const item = (editIdx==null)?{title:'',category:'',slug:'',thumb:'',url:''}:state.items[editIdx];
  document.getElementById('p-title').value = item.title||'';
  document.getElementById('p-category').value = item.category||'';
  document.getElementById('p-slug').value = item.slug||'';
  document.getElementById('p-thumb').value = item.thumb||'';
  document.getElementById('p-url').value = item.url||'';
  document.getElementById('save-project').onclick = ()=>saveItem(editIdx);
}
function closeModal(){
  document.getElementById('project-modal').classList.add('hidden');
  document.getElementById('modal-backdrop').classList.remove('show');
}
function render(){
  const tbody = document.querySelector('#projects-table tbody');
  tbody.innerHTML = '';
  state.items.forEach((it,idx)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${it.title}</td><td>${it.category||''}</td><td><span class="badge">${it.slug}</span></td><td>${it.thumb?'<span class="badge">img</span>':''}</td><td>${it.url||''}</td><td><button class="btn" data-edit="${idx}">Edit</button> <button class="btn danger" data-del="${idx}">Delete</button></td>`;
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll('[data-edit]').forEach(b=>b.addEventListener('click', e=> openModal(parseInt(e.target.getAttribute('data-edit')))));
  tbody.querySelectorAll('[data-del]').forEach(b=>b.addEventListener('click', e=> delItem(parseInt(e.target.getAttribute('data-del')))));
}
async function load(){
  const res = await GitHub.ensureJson(cfg, `${cfg.dataPath}/projects.json`, { items: [] });
  state.items = res.json.items||[];
  state.sha = res.sha;
  render();
}
async function save(){
  const path = `${cfg.dataPath}/projects.json`;
  const content = btoa(JSON.stringify({items: state.items}, null, 2));
  const r = await GitHub.putContent(cfg, path, content, 'content: update projects.json', state.sha);
  state.sha = r.content.sha;
  toast('Saved projects.');
}
function saveItem(idx){
  const it = {
    title: document.getElementById('p-title').value.trim(),
    category: document.getElementById('p-category').value.trim(),
    slug: document.getElementById('p-slug').value.trim(),
    thumb: document.getElementById('p-thumb').value.trim(),
    url: document.getElementById('p-url').value.trim()
  };
  if(idx==null){ state.items.push(it); } else { state.items[idx] = it; }
  save(); closeModal(); render();
}
function delItem(idx){
  if(confirm('Delete this item?')){
    state.items.splice(idx,1);
    save(); render();
  }
}
async function scanExisting(){
  alert('Tip: Open a project listing page in another tab, copy titles/links and paste here for now. (HTML parsing from local files is restricted in browsers).');
}
document.getElementById('add-project').addEventListener('click', ()=>openModal(null));
document.getElementById('close-modal').addEventListener('click', closeModal);
document.getElementById('sync-from-site').addEventListener('click', scanExisting);
load();
