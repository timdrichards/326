# 01 Race Condition

This example demonstrates a race condition when multiple async operations mutate shared in-memory state (`cartService.ts`).

## Setup

```bash
npm install
```

## Scripts

- `npm run demo`: runs concurrent increments and prints the observed final quantity.
- `npm run build`: compiles TypeScript into `dist/`.
- `npm run typecheck`: validates TypeScript types without emitting files.
