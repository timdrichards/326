# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
npm install
```

## Local Development

```bash
npm start
```

This command starts a local development server. It also runs homework zip watch mode so changes in `docs/homework/*/student` regenerate matching files in `static/code/`.

## Build

```bash
npm run build
```

This command generates homework zips first, then builds static content into `build/`.

## Homework zip generation

Homework zip files are generated from `docs/homework/<nn>/student` to `static/code/hw-<nn>.zip`.

- Run once: `npm run zip:homework`
- Watch for changes: `npm run zip:homework:watch`

The zip process excludes: `node_modules`, `dist`, `build`, `.env`, and `*.db`.

## Deployment

Use:

```bash
npm run deploy
```

`deploy` also runs homework zip generation before publishing.
