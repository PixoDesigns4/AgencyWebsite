
// Simple auth storage (sessionStorage)
const Auth = {
  key: 'static-admin-auth',
  save(cfg){
    sessionStorage.setItem(this.key, JSON.stringify(cfg));
  },
  load(){
    const v = sessionStorage.getItem(this.key);
    return v ? JSON.parse(v) : null;
  },
  clear(){
    sessionStorage.removeItem(this.key);
  }
};
function requireAuth(){
  const cfg = Auth.load();
  if(!cfg){ window.location.href = 'login.html'; return null; }
  return cfg;
}
document.addEventListener('DOMContentLoaded', ()=>{
  const logoutBtn = document.getElementById('logout-btn');
  if(logoutBtn){
    logoutBtn.addEventListener('click', ()=>{ Auth.clear(); window.location.href = 'login.html'; });
  }
});
