# HW2 Student Starter

## Quick Start

```bash
cd hw-02
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

This starter uses Prisma config in `prisma.config.ts` (Prisma 7 style).

Use `REPO_MODE=memory` (default) or `REPO_MODE=prisma` by editing `.env`:

```bash
# in .env
REPO_MODE=prisma
```

## Architecture Pattern (Matches class journal app)

This starter mirrors the class structure for result and error handling:

- `src/lib/result.ts` -> `Ok/Err/Result` types
- `src/lib/errors.ts` -> typed domain errors
- `src/service/EntryService.ts` -> validation and domain rules
- `src/controller/EntryController.ts` -> maps Result errors to HTTP behavior
- `src/repository/*` -> storage behind repository boundary

## Test Scaffolding

Starter test files are included and should be extended:

- `tests/unit/entry-service.unit.test.ts` (Jest unit tests)
- `tests/e2e/entries.e2e.test.ts` (Jest + Supertest route tests)

Run:

```bash
npm run test:unit
npm run test:e2e
```

## Reset Generated Files

To remove installed dependencies and local runtime artifacts created while working on the app, run:

```bash
npm run clean
```
