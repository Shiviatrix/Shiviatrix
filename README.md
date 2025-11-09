# AkshitOS — Interactive Research Terminal

Dark, physics-flavored portfolio console for **Akshit Sivaraman** implemented entirely with vanilla HTML, CSS, and JavaScript. No build tooling or npm steps are required—open `index.html` and the experience just works.

## Features

- Animated boot log with flickering block cursor + command prompt
- Command routing (`1 / about`, `2 / projects`, `3 / research`, `4 / contact`, plus `help` + `clear`)
- Bits.dev-inspired terminal chrome, neon cyan/lime glow, particle/grid/scanline FX
- Physicsy extras: drifting nodes, matte-black noise texture, ASCII section framing
- Always-on prompt with history recall via arrow keys

## Project Structure

```
/
 ├── index.html       # Main markup + terminal layout
 ├── styles.css       # JetBrains/IBM Plex theme, neon FX, terminal skin
 ├── main.js          # Typing animation, command parser, section renderer
 └── public/
      ├── pfp.jpg     # Avatar shown in terminal header
      └── favicon.ico # Terminal icon
```

## Running Locally

Simply double-click `index.html` or serve the folder with any static server:

```bash
# Python example
python3 -m http.server
# Visit http://localhost:8000
```

## Deploying to GitHub Pages

Because the repo already contains the compiled static files, GitHub Pages can serve them directly:

1. Commit and push the entire folder (including `index.html`, `styles.css`, `main.js`, and `public/`).
2. In the repository, go to **Settings → Pages**.
3. Select **Deploy from branch**, choose `main`, and set the folder to `/ (root)`.
4. Save—Pages will publish the site at `https://<username>.github.io/Shiviatrix/`.

Whenever you make changes, commit/push `main` again and Pages will redeploy automatically.

## Command Reference

| Command        | Description        |
| -------------- | ------------------ |
| `1` / `about`  | About panel        |
| `2` / `projects` | Projects showcase |
| `3` / `research` | Research logs     |
| `4` / `contact`  | Contact links     |
| `help`         | List commands      |
| `clear`        | Clear terminal log |
