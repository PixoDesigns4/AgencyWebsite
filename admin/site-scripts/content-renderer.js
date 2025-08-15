
/**
 * Drop-in content renderer for static HTML pages.
 * Usage: include this script on pages where you want dynamic content.
 * It expects containers with IDs: #projects-grid and/or #blog-grid.
 * It will fetch /data/*.json from the same repo/branch (same origin).
 */

(async function(){
  async function fetchJson(path){
    const res = await fetch(path, { cache: 'no-store' });
    if(!res.ok) return null;
    return res.json();
  }

  const projectsEl = document.getElementById('projects-grid');
  if(projectsEl){
    const pj = await fetchJson('/data/projects.json');
    if(pj && Array.isArray(pj.items)){
      projectsEl.innerHTML = pj.items.map(it=>{
        return `
          <article class="project-card">
            <a href="${it.url||'#'}">
              ${it.thumb?`<img src="${it.thumb}" alt="${it.title}">`:''}
              <div class="meta"><span class="cat">${it.category||''}</span><h3>${it.title||''}</h3></div>
            </a>
          </article>
        `;
      }).join('');
    }
  }

  const blogEl = document.getElementById('blog-grid');
  if(blogEl){
    const bj = await fetchJson('/data/blogs.json');
    if(bj && Array.isArray(bj.items)){
      blogEl.innerHTML = bj.items.map(it=>{
        const date = it.date? new Date(it.date).toLocaleDateString() : '';
        return `
          <article class="blog-card">
            <a href="${it.url||'#'}">
              ${it.cover?`<img src="${it.cover}" alt="${it.title}">`:''}
              <div class="meta">
                <div class="row"><span class="cat">${it.category||''}</span><span class="date">${date}</span></div>
                <h3>${it.title||''}</h3>
              </div>
            </a>
          </article>
        `;
      }).join('');
    }
  }
})();
