
const cfg = requireAuth(); if(cfg){ setRepoLabel(cfg); }
let state = { items: [], sha: null };

function openModal(editIdx=null){
  document.getElementById('post-modal').classList.remove('hidden');
  document.getElementById('modal-backdrop').classList.add('show');
  document.getElementById('modal-title').textContent = (editIdx==null)?'New post':'Edit post';
  const item = (editIdx==null)?{title:'',category:'',date:'',slug:'',cover:'',url:''}:state.items[editIdx];
  document.getElementById('b-title').value = item.title||'';
  document.getElementById('b-category').value = item.category||'';
  document.getElementById('b-date').value = item.date||'';
  document.getElementById('b-slug').value = item.slug||'';
  document.getElementById('b-cover').value = item.cover||'';
  document.getElementById('b-url').value = item.url||'';
  document.getElementById('save-post').onclick = ()=>saveItem(editIdx);
}
function closeModal(){
  document.getElementById('post-modal').classList.add('hidden');
  document.getElementById('modal-backdrop').classList.remove('show');
}
function render(){
  const tbody = document.querySelector('#blog-table tbody');
  tbody.innerHTML = '';
  state.items.forEach((it,idx)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${it.title}</td><td>${it.category||''}</td><td>${it.date||''}</td><td><span class="badge">${it.slug}</span></td><td>${it.cover?'<span class="badge">img</span>':''}</td><td>${it.url||''}</td><td><button class="btn" data-edit="${idx}">Edit</button> <button class="btn danger" data-del="${idx}">Delete</button></td>`;
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll('[data-edit]').forEach(b=>b.addEventListener('click', e=> openModal(parseInt(e.target.getAttribute('data-edit')))));
  tbody.querySelectorAll('[data-del]').forEach(b=>b.addEventListener('click', e=> delItem(parseInt(e.target.getAttribute('data-del')))));
}
async function load(){
  const res = await GitHub.ensureJson(cfg, `${cfg.dataPath}/blogs.json`, { items: [] });
  state.items = res.json.items||[];
  state.sha = res.sha;
  render();
}
async function save(){
  const path = `${cfg.dataPath}/blogs.json`;
  const content = btoa(JSON.stringify({items: state.items}, null, 2));
  const r = await GitHub.putContent(cfg, path, content, 'content: update blogs.json', state.sha);
  state.sha = r.content.sha;
  toast('Saved blog posts.');
}
function saveItem(idx){
  const it = {
    title: document.getElementById('b-title').value.trim(),
    category: document.getElementById('b-category').value.trim(),
    date: document.getElementById('b-date').value.trim(),
    slug: document.getElementById('b-slug').value.trim(),
    cover: document.getElementById('b-cover').value.trim(),
    url: document.getElementById('b-url').value.trim()
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
document.getElementById('add-post').addEventListener('click', ()=>openModal(null));
document.getElementById('close-modal').addEventListener('click', closeModal);
load();
