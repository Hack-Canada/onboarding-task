# Onboarding task

Welcome! This guide walks you through the task in plain language: branch, assets, your own page, link to home, then open a pull request.

## What you are working on

The site lives in the **`frontend`** folder. It is an [Astro](https://astro.build) project.

## Before you start

1. Clone this repo to your computer.
2. Open a terminal and go into the project folder.
3. Install and run the site:

```bash
cd frontend
npm install
npm run dev
```

4. Open **http://localhost:4321** in your browser. You should see the home page (do you like it haha)

## Step 1 — Create a branch with your name

Do not work directly on `main`. Make your own branch first.

Use your first name in lowercase. Use hyphens if you need spaces (for example `linus-gao`):

```bash
git checkout -b your-name
```

Example:

```bash
git checkout -b faiz-m
```

## Step 2 — Create a folder for your images

Put **all images you create** in a folder named after you:

**`frontend/public/assets/your-name/`**

Examples:

- `frontend/public/assets/faiz/headshot.jpg`
- `frontend/public/assets/faiz/banner.png`

Use them on your page like this (note the path starts with `/assets/`):

```html
<img src="/assets/your-name/headshot.jpg" alt="headshot" />
```

Do not mix your files into someone else’s folder. One folder per person.

See **`frontend/public/assets/example/`** for a sample folder and placeholder image.

## Step 3 — Create your page and link it from home

You are building a **brand-new page** that is separate from the home screen. Name it after yourself, wire it up on the home page, then implement everything on that page.

1. **Create your page file** — copy the starter:

   - From: `frontend/src/pages/example.astro`
   - To: `frontend/src/pages/your-name.astro`  
     (use your name, same as your branch — for example `faiz.astro`)

2. **Link it from the home page** — in `frontend/src/components/Welcome.astro`, find the `teamLinks` list and replace one placeholder with your name and path:

   ```javascript
   { label: 'Faiz', href: '/faiz' },
   ```

   Save both files. On the home page, click your button — it should open **your** page at a new URL (for example `http://localhost:4321/faiz`). That is the page you will implement.

3. **Build out your page** — edit `your-name.astro`:
   - Ensure I am able to click your name on home screen and it gets redirected to your super cool site!
   - Change the title, layout, and content (this is your page to design).
   - Point image paths to **`/assets/your-name/...`**


## Step 4 — Test locally

```bash
cd frontend
npm run dev
```

Check:

- Home page loads.
- Your page loads at `/your-name`.
- Images show up from `/assets/your-name/`.
- Links between home and your page work both ways.

## Step 6 — Commit, push, and open a pull request

Commit a little as you go — a small commit each day is better than one big dump at the end. That way your progress is saved on GitHub and we can check in on your work as you build.

When you have something worth saving locally:

```bash
git add .
git commit -m "Add my onboarding page and assets"
```

Push your branch so it shows up on GitHub (do this regularly, not only at the deadline):

```bash
git push -u origin your-name
```

When you are ready for review, open a pull request:

1. Click **Compare & pull request** (or **New pull request**).
2. Base branch: **`main`**. Compare branch: **your branch**.
3. Describe what you added (page, images, links).
4. Click **Create pull request**.
5. Ping Faiz on Discord and make sure to update your task on Notion!

Ask for a review when you are done. Do not merge your own PR......... if you do................... big oh no.......

## Quick checklist

- [ ] Branch created with your name
- [ ] Folder `frontend/public/assets/your-name/` with your images
- [ ] Page `frontend/src/pages/your-name.astro` created
- [ ] Home links to your page
- [ ] Tested with `npm run dev`
- [ ] Pull request opened against `main`

## Need help?

- Dev server issues: run commands inside `frontend` and run `npm install` first.
- Image not showing: check the file is under `public/assets/your-name/` and the path in HTML is `/assets/your-name/filename`.
- Page not found: the file must be `src/pages/your-name.astro` (same spelling as the URL).
