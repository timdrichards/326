# Persistence Lecture 6.9 Student Handout

This handout gives easy-to-read notes for each slide from the Persistence lecture.

Use it to review concepts, prepare for exams, and connect lecture ideas to code practice.

---

## 1. Persistence

**Teaching goal:**

Introduce the big idea for today: persistence is about keeping true data safe over time.


**Say this clearly:**

Memory is temporary. User trust is long-term. This lecture is about closing that gap.


**Student takeaway:**

By the end, you should explain what to persist, where the boundary belongs, and how to test it.

---

## 2. Community Agreement

**Teaching goal:**

Set expectations for how we will learn together today.


**Instructor cue:**

Read each point quickly, then pause on AI use and collaboration norms.


**Student takeaway:**

Participation, respect, and honest effort are part of technical quality.

---

## 3. Schedule

**Teaching goal:**

Align everyone on deadlines and course timing.


**Instructor cue:**

Call out dates out loud and point students to the syllabus for policy details.


**Student takeaway:**

Know what is due and plan your week now, not later.

---

## 4. Agenda

**Teaching goal:**

Give a roadmap so students can connect each section.


**Say this clearly:**

We move from concepts, to demos, to failure reasoning, to design practice.


**Student takeaway:**

Each section builds toward one outcome: defensible persistence design.

---

## 5. Reading (How to Use It)

**Teaching goal:**

Show students how to use the reading as a study workflow, not just a reference.


**Instructor cue:**

Emphasize sequence: concepts first, code second, practice prompts third.


**Student takeaway:**

Follow this order to prepare for both implementation and exam questions.

---

## 6. Lecture-Reading Map

**Teaching goal:**

Map lecture segments to exact reading sections.


**Instructor cue:**

Point out that debugging and testing sections are required, not optional.


**Student takeaway:**

If you miss class details, this map tells you where to recover them.

---

## 7. Why Persistence Exists

**Teaching goal:**

Anchor persistence in user expectations.


**Say this clearly:**

Apps restart. Users still expect their data to be there tomorrow.


**Student takeaway:**

Persistence is not a bonus feature. It is a baseline requirement.

---

## 8. A Precise Definition of Persistence

**Teaching goal:**

Separate everyday language from technical language.


**Instructor cue:**

Contrast persistence and durability in one sentence.


**Student takeaway:**

Use terms precisely: volatile state, persistent state, durable write, invariant.

---

## 9. Core Persistence Vocabulary

**Teaching goal:**

Build shared vocabulary before design discussions.


**Instructor cue:**

Ask for one real example of each term from a familiar app.


**Student takeaway:**

Clear words lead to clearer architecture decisions.

---

## 10. The Core Problem Statement

**Teaching goal:**

Show that persistence is a three-part correctness problem.


**Say this clearly:**

Storage alone is not enough. Retrieval and correctness under stress matter too.


**Student takeaway:**

If one of the three parts fails, users lose trust.

---

## 11. Data Lifetime Categories

**Teaching goal:**

Teach students to classify data before choosing storage.


**Instructor cue:**

Give one quick example for request, session, app, and long-lived data.


**Student takeaway:**

Do not persist temporary state, and do not leave canonical state in RAM.

---

## 12. Storage Hierarchy (Mental Model)

**Teaching goal:**

Connect storage choice to speed, durability, and sharing.


**Instructor cue:**

Call out tradeoffs, not just definitions.


**Student takeaway:**

Good systems place each kind of state in the right layer.

---

## 13. Volatile vs Persistent (Demo 00)

**Teaching goal:**

Make volatility concrete with a tiny example.


**Instructor cue:**

Ask: what happens to count after process restart?


**Student takeaway:**

Module memory feels convenient but disappears when the process ends.

---

## 14. Persistence Boundary in Web Apps

**Teaching goal:**

Separate browser state from server canonical state.


**Say this clearly:**

UI state can look correct while backend truth is still wrong.


**Student takeaway:**

The persistence boundary is a backend architecture decision.

---

## 15. Canonical State and Sources of Truth

**Teaching goal:**

Train students to identify what must never be lost.


**Instructor cue:**

Ask students to label one canonical and one derived field in a known app.


**Student takeaway:**

Persist authoritative truth; recompute derived views when possible.

---

## 16. Modeling Persistent State

**Teaching goal:**

Show how data modeling supports correctness.


**Instructor cue:**

Walk through id, attributes, constraints, and invariant as one package.


**Student takeaway:**

Persistence design starts with a clear model, not with random CRUD endpoints.

---

## 17. CRUD Is Necessary but Not Sufficient

**Teaching goal:**

Break the common misconception that CRUD equals correctness.


**Say this clearly:**

You can have full CRUD and still lose data under failure or concurrency.


**Student takeaway:**

Correctness requires invariants, failure handling, and safe updates.

---

## 18. Failure Modes You Must Design For

**Teaching goal:**

Normalize failure-aware thinking as a design habit.


**Instructor cue:**

Pick one failure mode and ask what the system should do.


**Student takeaway:**

If failure behavior is undefined, the design is incomplete.

---

## 19. Atomicity (Concept)

**Teaching goal:**

Define atomicity in practical, beginner-friendly terms.


**Instructor cue:**

Use the phrase: all-or-nothing change.


**Student takeaway:**

Half-written state creates hard-to-debug integrity problems.

---

## 20. Atomic File Write Pattern (Demo 00)

**Teaching goal:**

Explain why temp write plus rename is safer than direct overwrite.


**Instructor cue:**

Walk line by line: temp path, write temp, rename to final.


**Student takeaway:**

This pattern reduces partial-write risk in simple file-backed storage.

---

## 21. Atomic File Read Pattern (Demo 00)

**Teaching goal:**

Show the read boundary and explicit failure signaling.


**Instructor cue:**

Explain why this demo returns null on failure and why production code may validate more.


**Student takeaway:**

Reading persisted data always needs error handling and parsing logic.

---

## 22. Concurrency Hazards (Even on One Server)

**Teaching goal:**

Correct the myth that one server means no races.


**Say this clearly:**

Asynchronous requests interleave, so timing bugs can still happen.


**Student takeaway:**

Race conditions are about overlap, not server count.

---

## 23. Lost Update Example (Demo 01)

**Teaching goal:**

Reveal how a simple read-modify-write pattern can fail.


**Instructor cue:**

Pause at await and ask what other requests can do during that wait.


**Student takeaway:**

Two requests can read the same old value and overwrite each other.

---

## 24. Running Lost Update (Demo 01)

**Teaching goal:**

Use observed output to prove the bug is real.


**Instructor cue:**

Compare expected final value and actual final value out loud.


**Student takeaway:**

Correct-looking code can fail under concurrency tests.

---

## 25. Lost Update Timeline (Visual)

**Teaching goal:**

Visualize interleaving so timing becomes easy to reason about.


**Instructor cue:**

Trace request A and B in time order, not code order.


**Student takeaway:**

When reads happen before writes complete, lost updates are likely.

---

## 26. Lost Update Timeline (Visual)

**Teaching goal:**

Connect timeline behavior directly to specific lines of code.


**Instructor cue:**

Use clicks to explain where state is captured, paused, then overwritten.


**Student takeaway:**

The bug lives in the gap between read and write, especially around await.

---

## 27. Repository Boundary Pattern

**Teaching goal:**

Show why boundaries make persistence maintainable.


**Say this clearly:**

Business logic should depend on contracts, not filesystem or database APIs.


**Student takeaway:**

A clean boundary makes testing easier and implementation swaps safer.

---

## 28. Repository Interface Example (Demo 02)

**Teaching goal:**

Demonstrate a stable contract for persistence operations.


**Instructor cue:**

Point out that callers do not care how storage is implemented.


**Student takeaway:**

Interface-first design protects the rest of the app from storage changes.

---

## 29. In-Memory vs File-Backed Implementations

**Teaching goal:**

Compare same interface, different durability tradeoffs.


**Instructor cue:**

Ask: what changes for callers when implementation changes?


**Student takeaway:**

If the boundary is clean, callers stay the same while storage evolves.

---

## 30. In-Memory Implementation

**Teaching goal:**

Show a fast and simple implementation for development/testing.


**Instructor cue:**

Remind students this implementation is volatile by design.


**Student takeaway:**

In-memory repositories are useful, but not sufficient for durable user data.

---

## 31. JSON Persistent Implementation

**Teaching goal:**

Show a durable implementation behind the same repository contract.


**Instructor cue:**

Highlight readAll/writeAll and the temp-write-rename pattern.


**Student takeaway:**

Durability improves while the interface stays stable.

---

## 32. In-Class Activity

**Teaching goal:**

Practice persistence design using real scenarios.


**Instructor cue:**

Require all five outputs: canonical state, invariant, failure risk, boundary method, restart test.


**Student takeaway:**

A good design is one you can defend under restart, failure, and concurrency.

---

## 33. Practical Express/HTMX Integration

**Teaching goal:**

Connect persistence architecture to your course stack.


**Say this clearly:**

HTMX changes rendering style, not backend durability responsibility.


**Student takeaway:**

Route handlers orchestrate. Repositories persist canonical truth.

---

## 34. The Focus

**Teaching goal:**

Protect scope so students learn the right abstraction level first.


**Instructor cue:**

State explicitly what is out of scope and why.


**Student takeaway:**

Today is about boundaries and correctness, not advanced database tuning.

---

## 35. What to Internalize

**Teaching goal:**

Summarize the non-negotiable ideas from the lecture.


**Instructor cue:**

Read each bullet slowly and tie it back to one demo.


**Student takeaway:**

Persistence quality is measured by behavior over time, not by API usage.

---

## 36. How to Study This Lecture

**Teaching goal:**

Give a concrete study plan students can follow immediately.


**Instructor cue:**

Encourage active practice: rerun demos and answer prompts without notes.


**Student takeaway:**

Mastery comes from reimplementation and reasoning, not passive reading.

---

## 37. Where We Go Next (Prisma Lecture)

**Teaching goal:**

Bridge from current patterns to next lecture tooling.


**Say this clearly:**

We are swapping implementation, not abandoning the mental model.


**Student takeaway:**

Better tools should preserve good architecture, not replace it.

---

