# HTMX Counter (Express + EJS + TypeScript)

A tiny demo showing the core HTMX idea: the server returns HTML, and HTMX swaps only the part of the page that changes.

This project uses:

- Express (server)
- EJS templates (full page + partial)
- HTMX (partial updates)
- TypeScript (compiled to CommonJS output, so no `import.meta.url`)

## Project Structure

```text
htmx-counter/
  src/
    server.ts
    views/
      index.ejs
      partials/
        counter.ejs
```

## Setup

```bash
npm install
```

## Run (dev)

Runs directly from TypeScript using [tsx](https://tsx.is/):

```bash
npm run dev
```

Then open:

- http://localhost:3000

## Build + Run (prod-style)

```bash
npm run build
npm start
```

## How It Works

- The page loads at GET / and renders views/index.ejs.
- The counter UI is a partial: views/partials/counter.ejs.
- Each button uses hx-post to hit a server endpoint:
- /counter/increment
- /counter/decrement
- /counter/reset
- Each endpoint returns the rendered partial HTML.
- HTMX swaps the returned HTML into #counter without a full page reload.

## Notes

This uses an in-memory counter (let count = 0). Restarting the server resets it.

## Verify HTMX is Only Fetching a Partial (Chrome DevTools)

This demo is designed so that clicking a button does **not** reload the whole page. Instead, HTMX makes a request to the server that returns only a small HTML fragment (the counter area), and then swaps that fragment into the page.

Follow these steps to prove it in Chrome.

### 1) Open the DevTools Network tab

1. Open the app in Chrome: http://localhost:3000
2. Open DevTools:
   - Right click anywhere on the page, then click **Inspect**, or
   - Use **View → Developer → Developer Tools**
3. Click the **Network** tab.
4. Optional but helpful:
   - Enable **Preserve log** (so requests do not disappear)
   - Enable **Disable cache** (only works while DevTools is open)

### 2) Click a counter button and inspect the request

1. Click **+1** (or **-1** / **reset**) on the page.
2. In the Network list, you should see a new request such as:
   - `counter/increment` (POST)
   - `counter/decrement` (POST)
   - `counter/reset` (POST)
3. Click that request in the Network list.

Now check two things:

#### A) Confirm it is an HTMX request

In the **Headers** panel, look for a request header:

- `HX-Request: true`

This header is how HTMX identifies its own requests.

#### B) Confirm the response is only a partial

Click the **Response** panel. You should see only a small HTML fragment, for example:

- `<div>Count</div>`
- `<div class="count">3</div>`

You should **not** see a full HTML document. In particular, there should be **no**:

- `<!doctype html>`
- `<html>`
- `<head>`
- `<body>`

### 3) Compare to the full page load

In the Network list, find the request for:

- `/` (GET)

Click it, then open its **Response** panel. This one _will_ contain a full HTML document, including:

- `<!doctype html>`
- `<html> ... </html>`

That contrast is the point:

- `GET /` returns the full page
- `POST /counter/...` returns only the counter fragment

### 4) (Optional) Filter the Network list

If your Network tab is busy, use the filter box at the top:

- Type: `counter`

This will show only the counter-related requests.
