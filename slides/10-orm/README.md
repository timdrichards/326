# Slidev Kit

Shared Slidev assets for course decks.

## What this kit provides

- Reusable Vue components in `components/` (auto-imported by Slidev).
- Reusable CSS in `styles/`.
- Reusable static assets in `public/`.
- Empty extension folders for future custom work: `layouts/`, `setup/`.
- A copy-ready template folder: `slides/`.

## Uniform folder convention

Each lecture should keep Slidev content inside a `slides/` folder:

- `slides/slides.md`
- `slides/components` (symlink)
- `slides/styles` (symlink)
- `slides/layouts` (symlink)
- `slides/public` (symlink)
- `slides/setup` (symlink)
- `slides/node_modules` (symlink to shared runtime deps)

This keeps every lecture deck consistent.

## Quick start (recommended)

Copy the kit template folder into a lecture:

```bash
cp -R '/Users/richards/Git/thoughts/thoughts/90-System/Slidev-Kit/slides' '/path/to/Lecture X.Y - Topic/'
```

Then edit:

- `slides/slides.md`

Run Slidev against that file.

## Shared runtime and themes

This folder is now the shared Slidev runtime for the vault.

Installed here (not per-lecture):

- `@slidev/cli`
- `@slidev/theme-default`
- `@slidev/theme-seriph`

Run any lecture deck from this folder:

```bash
cd '/Users/richards/Git/thoughts/thoughts/90-System/Slidev-Kit'
npm run run:deck -- '/absolute/path/to/Lecture X.Y - Topic/slides/slides.md'
```

If Slidev ever prompts to install a theme inside a lecture folder, answer `no`.
The lecture `slides/` folder should use the shared `node_modules` symlink instead.

Useful commands in this folder:

- `npm run dev -- slides/slides.md`
- `npm run dev:open -- slides/slides.md`
- `npm run build -- /absolute/path/to/slides.md`
- `npm run export -- /absolute/path/to/slides.md`

## Current assets

- `components/CourseCallout.vue`
- `components/Asciinema.vue`
- `components/Counter.vue`
- `styles/main.css`
- `styles/styles.css`
- `public/asciinema-player.css`
- `public/asciinema-player.min.js`
- `slides/slides.md` (template deck)

## Template defaults (`slides/slides.md`)

The template includes these defaults so new decks are immediately presentation-ready:

- `class: text-2xl` for globally larger slide text.
- 75-minute pacing metadata (`duration`, `timeForPresentation`).
- Shiki line-numbered code blocks (`highlighter: shiki`, `lineNumbers: true`).
- `mdc: true` for richer markdown syntax.
- Standard 16:9 layout and navigation controls.
- Shared styles loaded globally:
  - `./styles/main.css`
  - `./styles/styles.css`

## CSS usage reference

### 1) Callout blocks

```md
<div class="callout">
Core idea in a blue callout.
</div>

<div class="callout callout-warn">
Caution or tradeoff.
</div>

<div class="callout callout-danger">
Failure mode or anti-pattern.
</div>
```

### 2) Framed list block (single list)

```md
<ul class="ul-frame">
  <li>Key point one</li>
  <li>Key point two</li>
</ul>
```

### 3) Framed lists across a whole slide

Use a slide class so every `ul` on that slide gets framed.

```md
---
class: framed-lists-green

## Design Checklist

- Boundary
- Invariant
- Failure mode
```

Available slide classes:

- `framed-lists`
- `framed-lists-blue`
- `framed-lists-green`
- `framed-lists-red`
- `framed-lists-gray`
- `framed-lists-amber`
- `framed-lists-purple`

### 4) Sentence emphasis chip

```md
<span class="sentence-emphasis">Persistence is a boundary problem.</span>
```

### 5) Two-column width ratios

Use with `layout: two-cols`.

```md
---
layout: two-cols
class: cols-67-33

## Left heavy slide

Left content

::right::

Right content
```

Available ratio classes:

- `cols-60-40`
- `cols-67-33`
- `cols-70-30`
- `cols-75-25`
- `cols-40-60`
- `cols-33-67`

## Vue component usage reference

### `CourseCallout`

```md
<CourseCallout title="Key Idea">
Persistence should sit behind repository interfaces.
</CourseCallout>
```

### `Counter`

```md
<Counter :count="2" />
```

### `Asciinema`

Requires player files in `public/` (already included):

```md
<Asciinema src="/casts/demo.cast" :rows="20" />
```

If you use this component, add your cast file at `slides/public/casts/demo.cast` in that lecture.

## AI generation guidance

When generating slides for this course, prefer these defaults:

1. Start from `90-System/Slidev-Kit/slides/slides.md`.
2. Keep `class: text-2xl` unless a slide is code-dense.
3. Use `callout` blocks for key definitions and warnings.
4. Use `framed-lists-*` classes on concept checklist slides.
5. Use `cols-*` classes for intentional two-column balance.
6. Use `CourseCallout` for high-signal takeaways.
