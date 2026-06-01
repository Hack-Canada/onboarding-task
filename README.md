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

4. Open **http://localhost:4321** in your browser. You should see the home page.

## Step 1 — Create a branch with your name

Do not work directly on `main`. Make your own branch first.

Use your first name in lowercase. Use hyphens if you need spaces (for example `mary-jane`):

```bash
git checkout -b your-name
```

Example:

```bash
git checkout -b faiz
```

## Step 2 — Create a folder for your images

Put **all images you create** in a folder named after you:

**`frontend/public/assets/your-name/`**

Examples:

- `frontend/public/assets/faiz/headshot.jpg`
- `frontend/public/assets/faiz/banner.png`

Use them on your page like this (note the path starts with `/assets/`):

```html
<img src="/assets/your-name/headshot.jpg" alt="My photo" />
```

Do not mix your files into someone else’s folder. One folder per person.

See **`frontend/public/assets/example/`** for a sample folder and placeholder image.

## Step 3 — Create your page

1. Copy the example page file:

   - From: `frontend/src/pages/example.astro`
   - To: `frontend/src/pages/your-name.astro`  
     (use the same name as your branch, for example `faiz.astro`)

2. Edit your new file:

   - Change the title and text.
   - Point image paths to **`/assets/your-name/...`**
   - Keep the **link back to home** at the bottom:

   ```html
   <a href="/">← Back to home</a>
   ```

3. Your page will be at:

   **http://localhost:4321/your-name**

   (for example `http://localhost:4321/faiz`)

## Step 4 — Link your page and home together

The home page has **4 buttons**. When your page is ready, update one of them with your name.

**On the home page** (`frontend/src/components/Welcome.astro`):

- Find the `teamLinks` list at the top of the file.
- Change one entry to use **your name** and **your page path**:

```javascript
{ label: 'Faiz', href: '/faiz' },
```

**On your page** (`frontend/src/pages/your-name.astro`):

- Keep a link to home (`href="/"`). The example page already shows this.

## Step 5 — Test locally

```bash
cd frontend
npm run dev
```

Check:

- Home page loads.
- Your page loads at `/your-name`.
- Images show up from `/assets/your-name/`.
- Links between home and your page work both ways.

## Step 6 — Commit your work

```bash
git add .
git commit -m "Add my onboarding page and assets"
```

## Step 7 — Push and open a pull request

```bash
git push -u origin your-name
```

Then on GitHub:

1. Click **Compare & pull request** (or **New pull request**).
2. Base branch: **`main`**. Compare branch: **your branch**.
3. Describe what you added (page, images, links).
4. Click **Create pull request**.

Ask for a review when you are done. Do not merge your own PR unless someone tells you to.

## Quick checklist

- [ ] Branch created with your name
- [ ] Folder `frontend/public/assets/your-name/` with your images
- [ ] Page `frontend/src/pages/your-name.astro` created
- [ ] Home links to your page
- [ ] Your page links back to home
- [ ] Tested with `npm run dev`
- [ ] Pull request opened against `main`

## Need help?

- Dev server issues: run commands inside `frontend` and run `npm install` first.
- Image not showing: check the file is under `public/assets/your-name/` and the path in HTML is `/assets/your-name/filename`.
- Page not found: the file must be `src/pages/your-name.astro` (same spelling as the URL).
