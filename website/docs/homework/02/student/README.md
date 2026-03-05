# HW2 Starter Scaffold

## Quick Start

```bash
cd website/docs/homework/02/dist
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

This starter uses Prisma config in `prisma.config.ts` (Prisma 7 style).

Use `REPO_MODE=memory` (default) or `REPO_MODE=prisma`:

```bash
REPO_MODE=prisma npm run dev
```

## Required HW2 TODO markers

Search for:

```bash
rg "TODO\(HW2\)|HW2-TODO"
```

Complete all required TODOs before submission.

## Evidence Report

Generate with:

```bash
npm run hw2:evidence
```

Outputs:

- `.reports/hw2-evidence.md`
- `.reports/hw2-evidence.json`
