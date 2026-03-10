# 326 Repository

This repository contains course source materials plus the Docusaurus site used to publish them to GitHub Pages.

## Repo layout

- `lectures/`: source-of-truth lecture units
- `assignments/`: source-of-truth homework materials
- `course/`: course-level authored docs such as week pages
- `shared/`: shared readings and templates
- `website/`: Docusaurus publish target
- `.github/workflows/`: automation, including GitHub Pages deployment

## Build flow

The website is now a generated destination rather than the main authoring home.
Before each site build, content is synced from the source directories above into `website/docs/` and `website/static/`.

`cd website && npm run prepare:content` performs the full preparation pass:

- sync week pages from `course/weeks/`
- sync lecture readings and shared references into `website/docs/readings/`
- sync homework specs into `website/docs/homework/`
- zip lecture code from `lectures/*/code`
- zip homework starters from `assignments/homework/*/student`
- build Slidev decks from `lectures/*/slides`

## Run the site locally

```bash
cd website
npm install
npm start
```

Docusaurus will print a local URL (typically `http://localhost:3000/326/` for this repo setup).

## Build the site locally

```bash
cd website
npm run build
```

## Content generation

The build pipeline generates published artifacts in `website/static/`:

- lecture code archives like `website/static/code/09-persistence.zip`
- homework starter archives like `website/static/code/hw-02.zip`
- published Slidev decks under `website/static/decks/`

Archive generation excludes runtime/local artifacts such as `node_modules`, `dist`, `build`, `.env`, `*.db`, and Prisma migrations.

## Deployment

This repo deploys the Docusaurus site to GitHub Pages via GitHub Actions.

- Workflow file: `.github/workflows/deploy-docusaurus.yml`
- Production URL: <https://timdrichards.github.io/326/>

Pushes to `main` trigger a deploy.

## Publish the website manually

From the repo root, run:

```bash
npm run publish
```

This command runs the full publish workflow: prepare website content, build the site, `git add`, commit, push to `main`, and optionally create a publish tag.
