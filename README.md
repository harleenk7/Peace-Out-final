# Peace Out — Landing Page

Lightweight static landing site for Peace Out. I moved the main CSS and JS into `src/` for easier development:

- `src/styles.css` — main stylesheet (extracted from inline styles)
- `src/script.js` — site javascript (extracted from inline scripts)
- `index.html` — main HTML (links to `src/` files)
- `assets/` — images and static media used by the site

Quick start

1. Serve the project root (no build step required):

```bash
npm install
npm run dev
```

2. Open `http://localhost:3000` and hard-refresh if you previously loaded the page.

Notes

- If you plan to deploy, move `assets/` into your final build output or update paths accordingly.
- I kept binary assets in `assets/` (not copied into `src/`) to avoid duplicating large files.
- If you want, I can create a `build/` script to bundle and copy assets into a `dist/` folder for deployment.

Contact

Maintainers: Harleen Kaur & Drishti Malhotra

-- updated by developer tools
