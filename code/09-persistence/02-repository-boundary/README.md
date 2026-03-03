# 02 Repository Boundary

This example defines a repository interface and two implementations:

- `InMemoryEntryRepository`: in-process storage only.
- `JsonFileEntryRepository`: JSON file persistence with atomic writes.

## Setup

```bash
npm install
```

## Scripts

- `npm run demo`: creates sample entries using both repository implementations.
- `npm run build`: compiles TypeScript into `dist/`.
- `npm run typecheck`: validates TypeScript types without emitting files.
