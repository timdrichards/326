# HTMX Validation (Express + EJS + TypeScript)

A tiny demo showing server-side validation with HTMX: the server returns either an error version of the form or a success fragment, and HTMX swaps it in place.

This project uses:

- Express (server)
- EJS templates (full page + partials)
- HTMX (partial updates)
- TypeScript

## Project Structure

```text
02-validation/
  src/
    server.ts
    views/
      index.ejs
      partials/
        form.ejs
        success.ejs
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

- `hx-post` submits a normal form without full-page reload
- `hx-target` swaps only the form/result panel
- Server-side validation decides what HTML to return
- Invalid input returns the form partial with an inline error
- Valid input returns a success fragment

## Routes

- `GET /` renders the full page
- `POST /validate`:
  - returns `partials/form` with an error for invalid input
  - returns `partials/success` for valid input
