# 326 Repository

This repository contains course materials and a Docusaurus site used to publish course documentation to GitHub Pages.

## Repo layout

- `lectures/`: lecture content, demos, and related assets
- `website/`: Docusaurus site (docs, theme, config)
- `.github/workflows/`: automation, including GitHub Pages deployment

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

## Homework zip automation

The website now auto-generates downloadable homework starter archives from `website/docs/homework/<nn>/student` into `website/static/code/hw-<nn>.zip`.

- Manual run: `cd website && npm run zip:homework`
- Watch mode: `cd website && npm run zip:homework:watch`
- Integrated runs:
  - `npm start` runs zip watch alongside Docusaurus dev server.
  - `npm run build` runs zip generation before Docusaurus build.
  - `npm run deploy` and `npm run publish:site` run zip generation before deploy.

Archive generation excludes runtime/local artifacts: `node_modules`, `dist`, `build`, `.env`, and `*.db`.

## Deployment

This repo deploys the Docusaurus site to GitHub Pages via GitHub Actions.

- Workflow file: `.github/workflows/deploy-docusaurus.yml`
- Production URL: <https://timdrichards.github.io/326/>

Pushes to `main` trigger a deploy.

## Publish the website manually

From the repo root, run:

```bash
npm run publish:website
```

This forwards to the `website` publish pipeline, which generates homework zip files and runs Docusaurus deploy.
