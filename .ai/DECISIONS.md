# Durable Decisions

## 2026-03-05 - Persistent Agent Memory Structure

- Keep `AGENTS.md` in repo root for auto-discovery.
- Keep session-specific details in hidden `.ai/` files.
- Use:
  - `.ai/HANDOFF.md` for chronological operational context.
  - `.ai/DECISIONS.md` for durable, cross-session technical choices.

Rationale: root auto-load plus hidden detailed memory keeps instructions maintainable and avoids root clutter.

## 2026-03-05 - Slidev Click-Explanation Pattern

- Prefer standard highlighted code blocks plus `<template v-if="$clicks === ...">` text.
- For `v-switch`, ensure click-producing steps exist (`v-click` or stepped code highlights).
- Use `$clicks === 0` for initial state when progressive explanation should start immediately.

Rationale: this pattern was most reliable and render-safe across edited slides.

## 2026-03-05 - Slide Code Size Override Strategy

- Global code size remains defined in `slides/10-orm/styles/styles.css`.
- For one block only, wrap block in a container class (e.g., `<div class="code-xs">`) and target that wrapper.
- Avoid slide-wide size classes when only one block should be affected.

Rationale: prevents unintended sizing changes across all blocks on a slide.

## 2026-03-05 - Emphasis Styling in 10-orm Slides

- Custom `<emph>` uses simple text-only styling (no background pill).
- Current visual direction: green text, normal style, slight opacity.

Rationale: avoided line-wrap overlap and visual artifacts seen with boxed highlight styles.

