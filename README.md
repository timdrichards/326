# 326 Repository

This repository contains course source materials plus the Docusaurus site used to publish them to GitHub Pages.

## Repo layout

- `course/`: source-of-truth authored course material
  - `course/lectures/`: lecture units with slides and code
  - `course/assignments/`: homework specs and starter/solution code
  - `course/readings/`: the class book / reading chapters and reading assets
  - `course/weeks/`: week overview pages
  - `course/shared/`: reusable templates and other shared assets
- `website/`: Docusaurus publish target
- `.github/workflows/`: automation, including GitHub Pages deployment

## Build flow

The website is now a generated destination rather than the main authoring home.
Before each site build, content is synced from `course/` into `website/docs/` and `website/static/`.

`cd website && npm run prepare:content` performs the full preparation pass:

- sync week pages from `course/weeks/`
- sync the class book from `course/readings/` into `website/docs/readings/`
- sync homework specs into `website/docs/homework/`
- zip lecture code from `course/lectures/*/code`
- zip homework starters from `course/assignments/homework/*/student`
- build Slidev decks from `course/lectures/*/slides`

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

## Markdown linking

When writing markdown in `course/`, write links against the published website structure, not the raw `course/` filesystem.

- Use relative links only when the relative relationship will stay the same after sync into `website/docs/`.
- Use published docs paths such as `/docs/readings/10-orm` or `/docs/homework/02/02`.
- Use published static paths such as `/decks/10-orm/` or `/code/hw-02.zip`.
- Do not link to `course/...` paths from markdown meant for the website.

Examples:

- good: `/docs/readings/10-orm`
- good: `./11-identity.md`
- good: `/decks/11-identity/`
- bad: `../../course/readings/10-orm.md`

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
