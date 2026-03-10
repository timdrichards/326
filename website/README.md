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

This command prepares synced course content, then starts a local development server. It also runs homework zip watch mode so changes in `../course/assignments/homework/*/student` regenerate matching files in `static/code/`.

## Build

```bash
npm run build
```

This command syncs course content, regenerates zips/decks, and then builds static content into `build/`.

## Content preparation

Generated website content comes from source folders under `../course/`:

- class readings/book: `../course/readings/`
- lecture code: `../course/lectures/*/code/`
- lecture slides: `../course/lectures/*/slides/`
- assignments: `../course/assignments/homework/`
- weeks: `../course/weeks/`

Key commands:

- Run all content preparation: `npm run prepare:content`
- Sync docs only: `npm run sync:content`
- Zip lecture code: `npm run zip:lecture-code`
- Zip homework starters: `npm run zip:homework`
- Publish all decks: `npm run publish:decks`
- Watch for changes: `npm run zip:homework:watch`

The zip process excludes: `node_modules`, `dist`, `build`, `prisma/migrations`, `.env`, and `*.db`.

## Deployment

Use:

```bash
npm run deploy
```

`deploy` also runs the full content preparation pipeline before publishing.
