# 00 Runtime vs Persistent State

This example contrasts process-memory state (`inMemoryCounter.ts`) with persisted JSON state (`fileStore.ts`).

## Setup

```bash
npm install
```

## Scripts

- `npm run demo`: runs a small demo that increments in memory and writes/reads a JSON snapshot.
- `npm run build`: compiles TypeScript into `dist/`.
- `npm run typecheck`: validates TypeScript types without emitting files.
