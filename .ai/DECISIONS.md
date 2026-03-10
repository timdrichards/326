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


## 2026-03-06 - HW2 Student Scaffold Should Mirror Journal-App Error/Result Architecture

- Homework 02 starter code should model the same explicit `Result` + typed error handling flow taught in the class journal-app across repository, service, and controller layers.
- Keep app/server boundaries explicit in starter code (`IApp`/`IServer` + server composition root) so students preserve architectural seams while implementing homework features.

Rationale: this aligns assessment with demonstrated class implementation patterns and reduces ambiguity in grading expectations.

## 2026-03-06 - HW2 Test Guidance Uses Jest + Supertest Scaffold

- Homework 02 student starter should use Jest for unit verification and Supertest for route/e2e verification.
- Assignment instructions should direct students to extend provided unit/e2e scaffold files rather than writing from a single placeholder test script.
- Tests remain student-owned verification practice and are not graded as a standalone scoring category.

Rationale: aligns assignment expectations with a standard Node testing workflow while preserving open-ended implementation freedom.

## 2026-03-06 - HW2 No Longer Uses Generated Evidence Report Submission

- Homework 02 submission no longer includes generated `.reports/hw2-evidence.md` artifacts.
- Required submission is now `hw2-code.zip` plus `hw2-writeup.pdf`.
- Remove evidence generation scripts/tools from assignment scaffold to avoid conflicting instructions.

Rationale: simplify student workflow and keep grading focused on code + writeup evidence.

## 2026-03-07 - Homework Code Archives are Generated from course/assignments/homework/*/student

- Canonical source for downloadable homework starter zips is `course/assignments/homework/<nn>/student`.
- Generated output path is `website/static/code/hw-<nn>.zip`.
- Archive generation excludes local/runtime artifacts: `node_modules`, `dist`, `build`, `prisma/migrations`, `.env`, and `*.db`.
- Zip generation is integrated into `website` scripts for `start`, `build`, and deploy/publish flows.

Rationale: keeps assignment source separate from the Docusaurus publish target while ensuring downloadable starter archives stay synchronized and free of local/runtime artifacts.

## 2026-03-10 - Published Slidev Decks Should Use Relative Asset Base

- Publish Slidev decks into `website/static/decks/<slug>/` using `slidev build --base ./`.
- Treat `./` as the default base for `scripts/publish-slidev-deck.sh`.
- Use an explicit `--site-base` override only when a deployment target truly requires absolute deck URLs.

Rationale: relative asset URLs keep deck HTML portable across both GitHub Pages subpath hosting and root-hosted deployments, preventing white-screen failures from broken `/assets/...` or hardcoded `/<repo>/...` paths.

## 2026-03-10 - Repository Uses Source-First Course Layout

- `course/` is the source of truth for authored course material.
- `course/lectures/` stores lecture slides, readings, and code.
- `course/assignments/` stores homework specs and starter/solution code.
- `course/weeks/` stores course-level week pages.
- `course/shared/` stores cross-cutting reading/reference material and templates.
- `website/` is the publish target, not the primary authoring home.
- Website build scripts must sync docs and static artifacts from those source directories before Docusaurus build/deploy.

Rationale: organizing by teaching unit and source ownership reduces cross-folder hunting and keeps generated website output separate from authored course content.
