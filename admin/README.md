
# Static Admin for GitHub Pages (Serverless)

This folder contains:
- `/admin/` — the admin UI (pure HTML/CSS/JS) that commits JSON files directly to your GitHub repo via the GitHub REST API.
- `/data/` — initial JSON data files.
- `/site-scripts/content-renderer.js` — a drop-in script for your existing site to render Projects & Blog from JSON without restructuring your HTML.

## One-time Setup

1) **Copy folders into your repo**  
Copy `/admin`, `/data`, and `/site-scripts` into the root of the GitHub Pages repository that hosts your current site.  
> This does **not** change your existing files; it's additive.

2) **(Optional) Hide admin**  
Do not link `/admin` publicly. Keep it for your own use.

3) **Add a script tag on pages where you want dynamic content**  
For example, on your `blog.html` and any portfolio listing page, add before `</body>`:

```html
<script src="/site-scripts/content-renderer.js"></script>
```

Then add an empty container where you want items to appear:

```html
<div id="blog-grid"></div>
<!-- or -->
<div id="projects-grid"></div>
```

The renderer will fill these with cards from `/data/blogs.json` and `/data/projects.json` respectively.

## Using the Admin (no server required)

- Open `/admin/login.html` **locally** (double-click or serve via `python -m http.server 5500`).
- Enter: Owner, Repo, Branch (`main`), Data Path (`data`) and a **GitHub Personal Access Token** (classic) with `public_repo` scope (or `repo` if private).
- After connecting, use tabs to edit Projects, Blog, Settings.
- File uploads go to `/data/media/` in your repo.

Every save commits directly to your repository → GitHub Pages redeploys automatically.

## Security Notes
- The token is stored only in `sessionStorage` and used from your browser to call GitHub API.
- Prefer a short-lived token. Never share the admin publicly.
- You can delete the token after use (logout button) or revoke it in GitHub.

## Mapping to Pixie CMS Features
- **Projects**: Create/Edit/Delete items with title/category/slug/thumbnail/URL (link to existing HTML case-study pages).
- **Blog**: Manage posts list with title/category/date/cover/URL (link to existing blog pages).
- **Media**: Upload images into repo for use in cover/thumb fields.
- **Settings**: Site-level strings (name/logo/social/footer).
- **Auth**: Lightweight (client-only) using a GitHub token.
