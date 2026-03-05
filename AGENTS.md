# Repository Agent Guide

This file is intentionally short. Keep detailed, evolving context in `.ai/`.

## Why This Is In Root

`AGENTS.md` in the repository root is the most reliable way to ensure future agent sessions auto-load these instructions.

## Startup Checklist (Every Session)

1. Read `.ai/HANDOFF.md` (most recent entries first).
2. Read `.ai/DECISIONS.md` (durable choices and constraints).
3. If needed, use `.ai/SESSION_TEMPLATE.md` for a new handoff entry.

## Update Rules (During/After Work)

1. Add a short entry to `.ai/HANDOFF.md` after meaningful changes.
2. Add or update `.ai/DECISIONS.md` when a durable technical choice is made.
3. Keep this root `AGENTS.md` stable; avoid putting session-specific details here.

## Quick Repo Commands

- Build a slide deck: `cd slides/<deck-name> && npm run build`
- Check git status: `git status --short --branch`
- Search quickly: `rg "<pattern>"`

## Scope Reminder

Use `.ai/` for persistent project memory. Treat it as the canonical context store between sessions.

