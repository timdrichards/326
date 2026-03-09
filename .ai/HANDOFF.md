# Session Handoffs

## Session: 2026-03-09 - Identity Slide Deck Generation

### Summary
- Created `slides/11-identity/slides.md` as the new Slidev deck for Lecture 6.11: Identity, Credentials, and Session Establishment.
- Matched the deck structure and formatting conventions from the previous lecture deck in the same folder.
- Incorporated the revised outline, including:
  - connection to ORM/persistence boundary
  - stateless-vs-session flow explanation
  - explicit cookie/session-id/session-store scaffolding before Activity 1
  - Express session middleware + minimal route example
  - session store and security fundamentals
  - two single-slide paper-and-pencil in-class activities with shared prompts for the entire class
- Reused the existing ORM boundary image and Mermaid/text diagrams; no new Excalidraw or PNG assets were needed for this deck.

### Verification
- Ran `cd slides/11-identity && npm install` to restore local Slidev dependencies.
- Ran `cd slides/11-identity && npm run build -- slides.md` successfully.

## Session: 2026-03-09 - Identity Lecture Outline Activity Revision

### Summary
- Revised `slides/11-identity/lecture-outline.md` to replace the single coding exercise with two spaced paper-and-pencil in-class activities.
- Added Activity 1 early in the lecture as a continuity-channel puzzle where students complete and debug a browser/server request flow.
- Kept the existing discussion point and placed it after the first activity so students reason about the design before moving into session vocabulary and mechanics.
- Added Activity 2 later in the lecture as a session-failure detective exercise focused on restart behavior, multi-instance behavior, and unsafe session contents.
- Rebalanced the 75-minute timing notes to preserve the lecture -> activity -> lecture -> activity -> wrap-up structure.
- Refined both activities so they can run from a single slide each with one shared problem for the entire class and no handouts.
- Added explicit pre-activity scaffolding requirements so future slide generation includes the concrete facts students need on-screen to solve both activities.

### Verification
- Re-read the updated outline to confirm both activities are paper-and-pencil, appear in different parts of the class, and the discussion point remains included.

## Session: 2026-03-09 - HW2 Student Clean Script

### Summary
- Added `npm run clean` to `website/docs/homework/02/student/package.json`.
- Switched the script to `rimraf` so it is cross-platform, including Windows.
- The script removes local generated artifacts from the starter:
  - `node_modules`
  - `dist`
  - `build`
  - `.env`
  - `prisma/*.db`
  - `prisma/*.db-journal`
  - `prisma/migrations`
- Updated the student README to document the reset command.

### Verification
- Refreshed starter dependencies with `npm install` so local `rimraf` was available.
- Ran `npm run clean` in `website/docs/homework/02/student`.
- Confirmed `node_modules`, `.env`, `*.db`, and `prisma/migrations` were removed.

## Session: 2026-03-09 - HW2 Form Reset After Successful Create

### Summary
- Updated `website/docs/homework/02/student/src/views/entries/index.ejs` so the create-entry form resets Title, Body, and Tag after a successful HTMX POST to `/entries/new`.
- Used `hx-on::after-request` on the form so failed validation responses do not clear user input.

### Verification
- `cd website && npm run build` passed.

## Session: 2026-03-09 - Homework Zip Exclusion for Prisma Migrations

### Summary
- Updated `website/scripts/zip-homework.mjs` so generated homework starter archives now exclude any `prisma/migrations` directory under `docs/homework/<nn>/student`.
- Kept existing exclusions for `node_modules`, `dist`, `build`, `.env`, and `*.db`.
- Updated durable docs to reflect the new exclusion list.

### Verification
- `cd website && npm run zip:homework` passed.
- Confirmed `website/static/code/hw-02.zip` does not contain `prisma/migrations`, `node_modules`, `dist`, `build`, `.env`, or `*.db` entries.

## Session: 2026-03-09 - HW2 Student UI Glass Styling Pass

### Summary
- Reworked `website/docs/homework/02/student` starter UI from minimal default controls into a structured glass-style interface.
- Added layout/component hooks in EJS templates for:
  - hero/header panel
  - create-entry card
  - search/filter toolbar
  - card-style entry list
  - styled error panel
- Replaced `student/static/styles.css` with a cohesive visual system using soft gradients, frosted panels, rounded controls, segmented filters, and responsive behavior.

### Verification
- `cd website && npm run build` passed.
- `cd website/docs/homework/02/student && npm run typecheck` could not run in this environment because local `tsc` was not installed in that folder.

## Session: 2026-03-05 - ORM Lecture Buildout and Slidev Refinements

### Summary
- Created and refined lecture materials for ORM + Prisma across slides, code examples, and reading content.
- Added `code/10-orm` example projects with tests and Prisma workflows.
- Updated `slides/10-orm` extensively for pacing, progressive explanation, and beginner clarity.
- Added new reading chapter `website/docs/readings/10-orm.md` and glossary/code-reference updates.

### Important Slidev Notes
- For synchronized code + explanation text, use highlighted code steps with template switches on `$clicks`.
- `v-switch` works only when click steps exist on the slide.
- For `layout: two-cols`, some spacing adjustments may require targeting inner grid selectors.
- For one-block-only code sizing, wrap block (e.g., `<div class="code-xs">`) and style wrapper selectors.

### Notable 10-orm Styling Outcomes
- Custom `<emph>` style is text-only (no background), tuned for readability and no line overlap.
- Community Agreement slide restored with full detailed text.
- Added per-slide and per-block layout/code utilities in `slides/10-orm/styles/styles.css`.

### Recent Content Edits (Final Wave)
- Added click-aligned template explanation sequences for:
  - `## Prisma Client Basics`
  - `## Handling Common Errors`
  - `## Transactions (All-or-Nothing)`
  - `## Keep the Repository Boundary`
  - `## Starting a Project from Scratch`
  - `## Optional: Peek into SQLite Directly`
- Replaced the in-class activity with a compact entity/relationship modeling sprint.

### Commands Commonly Used/Verified
- `cd slides/10-orm && npm run build` (repeatedly verified successful)
- `rg -n "<pattern>" <paths>`
- `sed -n '<start>,<end>p' <file>`

### Latest Git State Snapshot
- Work was committed and pushed on `main`:
  - Commit: `3cec1df`
  - Message: `Add ORM lecture code, reading, and slide updates`

### Open Items / Watchouts
- If live preview appears unchanged after CSS edits, hard refresh browser (cache can mask updates).
- Slidev generated static deck assets can produce very large diffs; confirm these are expected before future commits.


## Session: 2026-03-05 - Homework 02 Assignment Authoring

### Summary
- Appended complete Homework 02 handout content to `website/docs/homework/02.md`.
- Assignment integrates lecture/readings scope: rendering (HTMX), persistence boundaries, and Prisma ORM.
- Added explicit deliverables, rubric (100 pts), submission checklist, and AI disclosure/prompt log requirements.

### Workload Calibration
- Used frontmatter dates in `02.md`:
  - Release: 2026-03-05
  - Due: 2026-03-24
- Accounted for stated 7-day spring break inside window.
- Effective working window estimated at ~12 days; assignment effort set to 10-12 hours.

### Revision Note: Homework 02 Submission Format Update
- Revised `website/docs/homework/02.md` deliverables to require exactly two Canvas uploads: `hw2-code.zip` and `hw2-writeup.pdf`.
- Added required PDF sections with explicit prompt questions and mandatory supporting evidence (diagram + labeled screenshots).
- Updated rubric language and submission checklist to align with PDF evidence requirements.

### Note Added: ORM Notes Prisma Studio
- Added `notes/10-orm-notes.md`.
- Documented Prisma Studio: definition, run command (`npx prisma studio`), and course-value rationale.

## Session: 2026-03-05 - HW2 Evidence Tool Scaffold + Assignment Revision

### Summary
- Added starter evidence generator script: `scripts/generate-hw2-evidence.mjs`.
- Added root npm command: `npm run hw2:evidence`.
- Tool now outputs:
  - `reports/hw2-evidence.md`
  - `reports/hw2-evidence.json`
- Checks currently include heuristic detection for HTMX usage, routes, repository boundary, Prisma schema/client usage, tests, restart evidence, and scaffold TODO markers.

### Homework Spec Revision
- Updated `website/docs/homework/02.md` to scaffold-first workflow.
- Changed Canvas deliverables from code zip to generated evidence report:
  - `hw2-evidence.md`
  - `hw2-writeup.pdf`
- Added explicit instruction to generate evidence via `npm run hw2:evidence`.

### Notes
- This is intentionally a starter version and should be tightened once final student starter template paths/TODO tags are fixed.

### Revision Note: HW2 Evidence Tool Location
- Moved HW2 evidence generator from `scripts/generate-hw2-evidence.mjs` to `.vscode/generate-hw2-evidence.mjs`.
- Updated npm script to keep invocation stable: `npm run hw2:evidence`.
- Updated homework doc path `website/docs/homework/02/02.md` to explicitly mention tool location.

### Revision Note: Assignment-Local HW2 Tool + Scaffold
- Moved canonical HW2 evidence tool location to assignment-local path:
  - `website/docs/homework/02/dist/.vscode/generate-hw2-evidence.mjs`
- Added assignment-local `package.json` in `website/docs/homework/02/dist` with script:
  - `npm run hw2:evidence`
- Scaffolded starter HW2 code in `website/docs/homework/02/dist` (Express + EJS + repository boundary + Prisma schema + starter tests + README).
- Updated homework instructions in `website/docs/homework/02/02.md` to run commands from assignment `dist` directory.

### Revision Note: Hidden Evidence Output Directory
- Updated HW2 assignment-local evidence tool to write outputs under `.reports/` instead of `reports/`.
- Updated related docs (`website/docs/homework/02/02.md`, `website/docs/homework/02/dist/README.md`) and assignment `.gitignore` accordingly.
- Confirmed `npm run hw2:evidence` now generates:
  - `.reports/hw2-evidence.md`
  - `.reports/hw2-evidence.json`

### Revision Note: HW2 Zip-Based Student Workflow
- Updated `website/docs/homework/02/02.md` to require students to download `hw-02.zip`, unzip to `hw-02/`, and run all commands from that folder.
- Replaced prior repository-relative path references with extracted-folder references (`hw-02/.vscode/evidence.mjs`, `.reports/hw2-evidence.md`).

### Revision Note: HW2 Handout Rewritten as Guided Tutorial
- Rewrote `website/docs/homework/02/02.md` into a tutorial-style assignment with plain-language paragraph instructions.
- Added explicit, file-by-file implementation guidance tied to scaffold files (`schema.prisma`, repositories, `app.ts`, `server.ts`, tests).
- Updated workflow around `hw-02.zip` -> `hw-02/` extraction and assignment-local evidence generation.

### Revision Note: HW2 Evidence Specificity + TA Rubric
- Updated `website/docs/homework/02/02.md` with a required evidence list for writeup (specific screenshots + diagrams).
- Added a pre-grading submission checklist section.
- Replaced grading summary with TA-friendly rubric using fixed score bands per category: 0/5/10/15/20 across 5 categories (max 100).

### Revision Note: Prisma 7 Config Migration in HW2 Scaffold
- Updated `website/docs/homework/02/dist/prisma/schema.prisma` to remove datasource `url` (Prisma 7-compatible).
- Added `website/docs/homework/02/dist/prisma.config.ts` with datasource URL via `env("DATABASE_URL")`.
- Updated `website/docs/homework/02/dist/src/server.ts` to construct PrismaClient with SQLite adapter (`@prisma/adapter-better-sqlite3`).
- Updated assignment scaffold dependencies in `website/docs/homework/02/dist/package.json` to Prisma 7 + adapter packages.
- Verified by running in assignment scaffold folder:
  - `npm install`
  - `npm run prisma:generate` (after `.env` present)
  - `npm run typecheck`

## Session: 2026-03-06 - HW2 Student Scaffold Journal-App Parity Pass

### Summary
- Aligned `website/docs/homework/02/student` more closely with the class `journal-app` architecture emphasis around explicit `Result`/typed error flow.
- Updated student scaffold runtime boundary to mirror class pattern:
  - added `IServer` in `src/contracts.ts`
  - introduced `HttpServer` in `src/server.ts` and kept composition root explicit.
- Updated student logging service behavior to match class implementation style:
  - ISO timestamp + level format
  - singleton `CreateLoggingService()` factory.
- Updated assignment docs wording in `website/docs/homework/02/02.md` to explicitly require journal-app-style result/error mapping at the controller boundary.
- Updated TA guide (`website/docs/homework/02/solution/hw2-ta-guide.md`) to call out composition-boundary parity checks in grading.

### Verification
- `cd website/docs/homework/02/student && npm run typecheck` passed.
- `cd website && npm run build` passed.

## Session: 2026-03-06 - HW2 Testing Stack Migration to Jest + Supertest

### Summary
- Revised `website/docs/homework/02/02.md` testing guidance to use Jest for unit testing and Supertest for route/e2e testing.
- Added per-step verification guidance that references `npm run test:unit` in early validation and `npm run test:e2e` after route work.
- Updated Step 8 to require extending scaffolded Jest/Supertest tests instead of a single placeholder test file.

### Scaffold Changes (student starter)
- Replaced one-off placeholder test with scaffolded test structure:
  - `tests/unit/entry-service.unit.test.ts`
  - `tests/e2e/entries.e2e.test.ts`
- Added Jest config:
  - `jest.config.cjs`
- Updated `package.json` scripts:
  - `test`, `test:unit`, `test:e2e`
- Added test dependencies:
  - `jest`, `ts-jest`, `supertest`, `@types/jest`, `@types/supertest`
- Updated `tsconfig.json` for Jest typing + isolated modules.
- Updated `student/README.md` to document new test scaffolding and commands.

### Verification
- `cd website/docs/homework/02/student && npm run typecheck` passed.
- `cd website/docs/homework/02/student && npm run test` passed.
- `cd website && npm run build` passed.

## Session: 2026-03-06 - HW2 errors.ts Relocated to src/lib

### Summary
- Moved HW2 student starter error definitions from `src/service/errors.ts` to `src/lib/errors.ts`.
- Updated all student starter imports to new path.
- Updated assignment and TA docs that referenced the old path.

### Verification
- `cd website/docs/homework/02/student && npm run typecheck` passed.
- `cd website/docs/homework/02/student && npm run test` passed.

## Session: 2026-03-06 - HW2 Evidence Tool Removal + Submission Format Revert

### Summary
- Removed HW2 generated evidence-report workflow from assignment docs and scaffold.
- Updated `website/docs/homework/02/02.md` to remove Step 9 evidence generation and renumber PDF step.
- Changed Canvas submission requirements back to two files:
  - `hw2-code.zip`
  - `hw2-writeup.pdf`
- Removed all references to `.reports/hw2-evidence.md` and `npm run hw2:evidence`.

### Repository Cleanup
- Removed evidence scripts from:
  - `website/docs/homework/02/student/package.json`
  - `website/docs/homework/02/solution/package.json`
- Deleted evidence tool files:
  - `website/docs/homework/02/student/.vscode/evidence.mjs`
  - `website/docs/homework/02/solution/.vscode/evidence.mjs`
- Deleted generated student report artifacts:
  - `website/docs/homework/02/student/.reports/hw2-evidence.md`
  - `website/docs/homework/02/student/.reports/hw2-evidence.json`
- Updated related docs:
  - `website/docs/homework/02/student/README.md`
  - `website/docs/homework/02/solution/README.md`
  - `website/docs/homework/02/solution/hw2-ta-guide.md`

### Verification
- `cd website && npm run build` passed.

## Session: 2026-03-07 - HW2 Release Readiness Review

### Summary
- Reviewed `website/docs/homework/02/02.md` and student starter for release-readiness.
- Fixed broken download link in `02.md` from `/hw-02.zip` to `/code/hw-02.zip`.
- Re-ran site build and confirmed Docusaurus build now succeeds.

### Validation Run
- `cd website && npm run build` passed after link fix.
- `website/docs/homework/02/student` requires setup sequence (`npm install`, copy `.env`, `npm run prisma:generate`) before tests/typecheck can run.
- After setup, `npm run typecheck`, `npm run test:unit`, `npm run test:e2e`, and `npm run test` passed in starter.

### Release Risks Found
- `website/docs/homework/02/solution` directory is currently absent in this branch snapshot.
- `02.md` still includes one suggested feature (status filter) that already exists in starter, which can confuse students relative to “pick a feature that does not already exist.”
- Starter code still includes HW TODO comments in service/schema files that may conflict with prior “no TODO references” direction.

### Notes
- Current static zip path is `website/static/code/hw-02.zip`, and the homework doc now points there correctly.

## Session: 2026-03-07 - Generated HW2 Solution + TA Guide

### Summary
- Created `website/docs/homework/02/solution` as a full walkthrough-feature solution package based on the current HW2 architecture.
- Added `website/docs/homework/02/solution/hw-02-ta-guide.md` with:
  - requirement-to-code walkthrough,
  - why the implementation satisfies HW requirements,
  - common student questions with scripted answers.
- Updated solution README wording to describe solution usage (instead of student starter wording).

### Validation
From `website/docs/homework/02/solution`:
- `npm run prisma:generate` passed.
- `npm run typecheck` passed.
- `npm run test:unit` passed.
- `npm run test:e2e` passed (memory + prisma suites).

## Session: 2026-03-07 - Added Automatic Homework Zip Pipeline

### Summary
- Added `website/scripts/zip-homework.mjs` to package each `docs/homework/<nn>/student` folder into `static/code/hw-<nn>.zip`.
- Zipping stages each homework in a temporary `hw-<nn>` folder before archive creation.
- Exclusion rules implemented: `node_modules`, `dist`, `build`, `.env`, and `*.db`.

### Script Wiring
Updated `website/package.json`:
- `zip:homework`: one-shot zip generation.
- `zip:homework:watch`: watch mode for homework changes.
- `start`: runs zipper watch in parallel with `docusaurus start`.
- `build`: runs zipper before Docusaurus build.
- `deploy` and `publish:site`: run zipper before deploy.

### Validation
- `cd website && npm run zip:homework` passed and produced `website/static/code/hw-02.zip`.
- Verified zip content excludes `.env`, `.db`, `node_modules`, `dist`, and `build`.
- `cd website && npm run build` passed with pre-zip step.

## Session: 2026-03-07 - Drafted Lecture 11 Identity Outline

### Summary
- Added `slides/11-identity/lecture-outline.md` using `design-template.md` numbering style.
- Kept items 1-3 (Title, Community Agreement, Schedule) as requested.
- Dropped template items 4-5.
- Produced a 20-slide max outline focused on sessions:
  - why sessions exist,
  - what HTTP does not provide,
  - how sessions work in Express.
- Placed a 5-minute discussion slide near the end and a longer in-class activity before wrap-up/conclusion.
- Included timing notes targeting a 75-minute class with buffer.

## Session: 2026-03-07 - Polished Reading 11 + Moved Appendices to Shared Files

### Summary
- Performed second-pass style revision on `website/docs/readings/11-identity.md` to better match `10-orm.md` narrative style.
- Added concrete mini-scenarios and expanded code walkthrough commentary in key implementation sections.
- Removed embedded appendix sections from chapter body.
- Added shared appendix pointers in chapter:
  - `./a-glossary.md`
  - `./b-code-reference.md`
- Added 6.11 session terms to shared glossary and code reference:
  - `website/docs/readings/a-glossary.md`
  - `website/docs/readings/b-code-reference.md`

### Validation
- `cd website && npm run build` passed after updates.
