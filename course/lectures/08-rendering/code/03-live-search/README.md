# HTMX Live Search (Express + EJS + TypeScript)

A tiny demo showing live updates driven by input events with HTMX. Typing in the search box triggers requests, the server returns a partial, and HTMX swaps only the results area.

This project uses:

- Express (server)
- EJS templates (full page + partial)
- HTMX (triggered partial updates)
- TypeScript

## Project Structure

```text
03-live-search/
  src/
    server.ts
    views/
      index.ejs
      partials/
        results.ejs
```

## Setup

```bash
npm install
```

## Run (dev)

```bash
npm run dev
```

Then open http://localhost:3000

## What It Demonstrates

- Requests can be driven by input events (not just clicks)
- `hx-trigger="keyup changed delay:300ms"` for a debounced live search feel
- `hx-get="/search"` + `hx-target="#results"` for partial updates
- Same request/partial/swap model as the other examples

## Routes

- `GET /` renders the full page
- `GET /search?q=...` renders only the results partial
