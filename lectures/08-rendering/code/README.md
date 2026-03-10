# HTMX Examples (Rendering as a Representation Boundary)

This folder contains small Express + EJS + TypeScript examples that demonstrate HTMX patterns using server-rendered HTML partials.

## Examples

- `00-counter`: Button-driven partial updates (`hx-post`, `hx-target`) using a simple in-memory counter.
- `01-name-badge`: Form submit without full page reload (`hx-post`, `hx-target`) that renders a name badge into a result area.
- `02-validation`: Server-side validation that returns either an error version of the form or a success fragment, swapped in place.
- `03-live-search`: Input-driven live updates with `hx-trigger="keyup changed delay:300ms"` and server-rendered search results.

## How To Run Any Example

1. Open a terminal in this `examples` folder.
2. Change into the example directory, for example:

```bash
cd 00-counter
```

3. Install dependencies:

```bash
npm install
```

4. Start the dev server:

```bash
npm run dev
```

5. Open http://localhost:3000

## Notes

- Each example is self-contained and uses the same basic project structure.
- Each example also includes its own `README.md` with additional details about what it demonstrates and how it works.
