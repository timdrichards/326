# HTMX Name Badge (Express + EJS + TypeScript)

A tiny demo of the practical HTMX form pattern: submit a normal HTML form and update only a result area with server-rendered HTML.

This project uses:

- Express (server)
- EJS templates (full page + partial)
- HTMX (partial updates)
- TypeScript

## Project Structure

```text
01-name-badge/
  src/
    server.ts
    views/
      index.ejs
      partials/
        badge-result.ejs
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

- A normal `<form>` with `action` + `method`
- HTMX `hx-post="/badge"` to submit without a full page reload
- HTMX `hx-target="#result"` to replace only the result area
- Server-rendered HTML partial returned from the POST route

## Routes

- `GET /` renders the full page
- `POST /badge` renders:
  - `partials/badge-result` for HTMX requests (`HX-Request: true`)
  - the full page as a fallback for non-HTMX form submission
