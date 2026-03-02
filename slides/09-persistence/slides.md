---
theme: default
background: https://cover.sli.dev
class: text-center
transition: fade
backgroundTransition: fade
drawings:
  persist: false
mdc: true
duration: 75min
lineNumbers: true
highlighter: shiki
controls: true
progress: true
slideNumber: true
center: false
overview: true
hash: true
navigationMode: default
width: 1280
height: 720
margin: 0.08
timeForPresentation: "75"
title: "Persistence: Making State Survive Reality"
info: |
  # Persistence: Making State Survive Reality
  COMPSCI 326 Web Programming - Lecture 6.9
---

<style>
@import "./styles/main.css";
@import "./styles/styles.css";
</style>

# Persistence

<div class="text-2xl opacity-70 mt-6">
COMPSCI 326 Web Programming - Lecture 6.9
</div>

---
layout: two-cols-header
class: text-2xl community-agreement
---

# Community Agreement

::left::

- **Attend & Engage:** Show up every class and be fully present - learning improves when we participate together.
- **Stay Focused:** No devices in class (unless asked); laptops and phones pull attention away from you and others.
- **Use AI Responsibly:** AI tools are allowed when used transparently and to support, not replace, your own thinking.

::right::

- **Learn with a Growth Mindset:** Mistakes and questions are part of the process, ask early and often.
- **Respect & Include Everyone:** Value diverse experiences, assume positive intent, and maintain a safe space for questions.
- **Support Each Other:** Collaborate to help peers understand, not just finish work; listen generously.

---
class: text-2xl
---

# Schedule

- Mental model and key vocabulary
- Runtime vs persistent demos
- Failure + concurrency reasoning
- Repository boundary and testing
- In-class design exercise and debrief

**Target Outcome:** you should be able to explain not only _what_ to store, but _where_ the persistence boundary belongs and how to verify it.

---
class: text-2xl
---

# Reading (How to Use It)

- Primary reading: `6.9 Persistence`
- During class: use slides for pacing + demos
- After class: use reading sections for exam prep and reimplementation

Reading-first workflow:

1. Understand concept sections (1-5).
2. Re-run code examples (6-18).
3. Practice debugging/testing prompts (20-30).

---
class: text-2xl
---

# Lecture-Reading Map

<div class="h-4"></div>

- Concept model in lecture → sections 1-5
- Code demos in lecture → sections 6-18
- Debugging/testing in lecture → sections 20-25
- Exam prep in lecture → sections 29-30

---
class: text-2xl
---

# Why Persistence Exists


- Programs terminate.
- Process memory is volatile.
- Users still expect data tomorrow.

Persistence exists because user expectations span process lifetimes. 

If canonical state only lives in memory, your app resets truth every restart.

<p class="reading-connection">Reading connection: section 1.</p>

---
layout: two-cols-header
class: text-3xl community-agreement precise-definition
---

## A Precise Definition of Persistence


::left::

Persistence means state survives process restart and is retrievable later.

Durability is the stronger guarantee: once a write is treated as committed, it should remain after failure.

::right::

Vocabulary to use precisely:

- Volatile state
- Persistent state
- Durable write
- Invariant

<p class="reading-connection">Reading connection: section 3.</p>

---
class: text-2xl
---

## Core Persistence Vocabulary

- **Volatile state:** Data that exists only while the process is running (for example, in RAM).
- **Persistent state:** Data stored so it can be recovered after restart.
- **Durable write:** A write treated as committed and expected to survive failures.
- **Invariant:** A rule that must remain true across every valid system state.

---
class: text-2xl
---

## The Core Problem Statement

Persistence work **must solve all three**:

- Keep canonical state beyond runtime.
- Retrieve and update it reliably.
- Preserve correctness under failure and concurrency.

<div class="callout callout-danger callout-gap-top">
If any one is missing, the system can still lose or corrupt user truth.
</div>

<p class="reading-connection">Reading connection: sections 2 and 11-12.</p>

---
layout: two-cols-header
class: text-2xl body-sm body-tight
---

## Data Lifetime Categories

::left::

- **Request-lifetime:** exists only while one HTTP request is being handled.
- **Session-lifetime:** survives across multiple requests for one user session.
- **Application-lifetime:** stays in memory while the server process is running.

::right::

- **Long-lived/persistent:** stored outside process memory so it survives restarts.

<div class="sticky-note">
This classification prevents <br><strong>two common mistakes</strong>:

- Persisting transient state unnecessarily
- Leaving critical canonical state in volatile memory
</div>

<p class="reading-connection">Reading connection: section 4.</p>

---
layout: two-cols-header
class: text-2xl body-sm
---

## Storage Hierarchy (Mental Model)

::left::

- **CPU/cache + RAM:** <br>fast, volatile
- **Disk/SSD:** <br>slower, persistent
- **Remote DB:** <br>shared + network latency

<div class="callout">
<strong>Design Implication</strong><br>Speed and durability trade off. Good architecture places each state type in the right layer.
</div>

<p class="reading-connection">Reading connection: section 5.</p>

::right::

<img src="./images/6.9-storage-hierarchy.svg" alt="Storage hierarchy" class="reading-image" />

---
class: text-2xl body-sm
---

## Volatile vs Persistent (Demo 00)

`examples/00-runtime-vs-persistent/src/inMemoryCounter.ts`

```ts {1|1-6|1,8-10}
let count = 0;

export function increment(): number {
  count += 1;
  return count;
}

export function getCount(): number {
  return count;
}
```

Module-level memory lasts only as long as one process.

<p class="reading-connection">Reading connection: sections 6-7.</p>

---
class: text-2xl
---

## Persistence Boundary in Web Apps

- Browser memory and server memory are separate runtimes.
- Server restarts wipe server in-memory state.
- Canonical shared truth must cross a persistence boundary.

Do not confuse **visible UI state** with persisted state. 

*This is a boundary distinction.*

<p class="reading-connection">Reading connection: section 9.</p>

---
class: text-2xl
---

## Canonical State and Sources of Truth

- Canonical values must be persisted.
- Derived values can be recomputed.
- Prefer one authoritative source of truth.

**Example:**

- Journal entry body is canonical.
- Sort order in a view is typically derived.

<p class="reading-connection">Reading connection: section 2.</p>

---
class: text-2xl  body-sm
---

## Modeling Persistent State

- Identity (`id`)
- Attributes (fields)
- Constraints (required, unique, valid)
- Invariants preserved after every write

**Example (`JournalEntry`):**

- Identity: `id`
- Attributes: `content`, `createdAt`, `updatedAt`
- Constraints: `content` must be non-empty
- Invariant: every persisted entry always has valid `content`

<p class="reading-connection">Reading connection: sections 10 and 15.</p>

---
class: text-2xl
---

## CRUD Is Necessary but Not Sufficient

CRUD gives operation surface area. <br>
**It does not guarantee correctness.**

<u>Correctness Over Time Requires</u>:

- Invariant enforcement
- Failure-aware write behavior
- Concurrency-safe updates

<p class="reading-connection">Reading connection: section 11.</p>

---
class: framed-lists-red text-2xl
---

## Failure Modes You Must Design For

- Crash between read and write
- Partial write output
- Concurrent overwrite (lost update)
- Corrupted stored data

**If design assumes perfect execution, it is fragile by default.**

<div class="callout callout-danger">
If you cannot describe failure behavior, you do not yet have a production-ready persistence design.
</div>

<p class="reading-connection">Reading connection: section 12.</p>

---
class: text-2xl
---

## Atomicity (Concept)

- Change should happen entirely or not at all.
- Half-applied state causes integrity bugs.
- **For this lecture:** model with temp-write + rename.

**Important nuance from reading:** <br> 
This is the right teaching pattern here, not a claim of full cross-filesystem guarantees.

<p class="reading-connection">Reading connection: section 8.</p>

---
class: text-2xl code-md
---

## Atomic File Write Pattern (Demo 00)

`examples/00-runtime-vs-persistent/src/fileStore.ts`

````md magic-move
```ts
import { promises as fs } from "node:fs";

export async function writeJsonAtomic<T>() { }
```
```ts
import { promises as fs } from "node:fs";

export async function writeJsonAtomic<T>(
  filePath: string, 
  data: T): Promise<void> { }
```
```ts
import { promises as fs } from "node:fs";

export async function writeJsonAtomic<T>(
  filePath: string, 
  data: T): Promise<void> {
    // Create a temp file. Why?
    const tempPath = `${filePath}.tmp`;
}
```
```ts
import { promises as fs } from "node:fs";

export async function writeJsonAtomic<T>(
  filePath: string, 
  data: T): Promise<void> {
    const tempPath = `${filePath}.tmp`;
    // Write the JSON form of the data to the temp file.
    await fs.writeFile(tempPath, JSON.stringify(data), "utf8");
}
```
```ts
import { promises as fs } from "node:fs";

export async function writeJsonAtomic<T>(
  filePath: string, 
  data: T): Promise<void> {
    const tempPath = `${filePath}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(data), "utf8");
    // Rename the temp file → actual file
    // This is an ATOMIC operation!
    await fs.rename(tempPath, filePath);
}
```
```ts
import { promises as fs } from "node:fs";

export async function writeJsonAtomic<T>(
  filePath: string, 
  data: T): Promise<void> {
    const tempPath = `${filePath}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(data), "utf8");
    await fs.rename(tempPath, filePath);
}
```
````

<!--
We need to come back to this later as a great example of race condition.
This is why we use a database!
-->

---
class: text-2xl code-md
---

## Atomic File Read Pattern (Demo 00)

`examples/00-runtime-vs-persistent/src/fileStore.ts`

````md magic-move
```ts
export async function readJson<T>() { }
```
```ts
export async function readJson<T>(filePath: string): Promise<T | null> { }
// Returns a Promise<T | null>
// What does this mean?
```
```ts
export async function readJson<T>(filePath: string): Promise<T | null> {
    // Try to read the file.
    const raw = await fs.readFile(filePath, "utf8");
    // But, what if there is a failure?
}
```
```ts
export async function readJson<T>(filePath: string): Promise<T | null> {
  // Surround with a try/catch
  try {
    const raw = await fs.readFile(filePath, "utf8");    
  } catch {
    // What do we do here?
  }
}
```
```ts
export async function readJson<T>(filePath: string): Promise<T | null> {  
  try {
    const raw = await fs.readFile(filePath, "utf8");
    // Parse JSON text into a JS object of type T and return it
    return JSON.parse(raw) as T; 
  } catch {
    // What do we do here?
  }
}
```
```ts
export async function readJson<T>(filePath: string): Promise<T | null> {  
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T; 
  } catch {
    // Signals that there was a failure.
    // But, we no better... this is a small example.
    return null;
  }
}
```
````

Teaching points:

- Serialization/deserialization boundary
- `Promise<void>` vs `Promise<T | null>`

<!--
This is going to persist a JSON file to disk.
-->

---
class: text-2xl
---

### Concurrency Hazards (Even on One Server)

- Requests interleave.
- Read-modify-write can lose updates.
- Timing can break logic that looks correct in isolation.

This has a name: **race condition**

<p class="reading-connection">Reading connection: section 13.</p>

---


## Lost Update Example (Demo 01)

`examples/01-race-condition/src/cartService.ts`

````md magic-move
```ts
// Let us define a type
export type CartRecord = { quantity: number };
```
```ts {3-6}
export type CartRecord = { quantity: number };

// A simple CartService class with some private state
export class CartService {
  private state: CartRecord = { quantity: 0 };
}
```
```ts {6-9}
export type CartRecord = { quantity: number };

export class CartService {
  private state: CartRecord = { quantity: 0 };

  // A typical getter to get the quantity if updated
  getQuantity(): number {
    return this.state.quantity;
  }
}
```
```ts {6-9}
export type CartRecord = { quantity: number };

export class CartService {
  private state: CartRecord = { quantity: 0 };

  // Now we are going to demonstrate a race condition
  async incrementWithRace(): Promise<number> { 
    // ...
  }

  getQuantity(): number {
    return this.state.quantity;
  }
}
```
```ts {1-6}
  // Now we are going to demonstrate a race condition
  async incrementWithRace(): Promise<number> { 
    // 1. We get the current quantity
    // 2. Create a timer that resolves in 10 ms -> we wait for this
    // 3. After the timer goes off -> we increment the state and return
  }
```
```ts {3-4}
  // Now we are going to demonstrate a race condition
  async incrementWithRace(): Promise<number> { 
    // 1. We get the current quantity
    const current = this.state.quantity;
    // 2. Create a timer that resolves in 10 ms -> we wait for this
    // 3. After the timer goes off -> we increment the state and return
  }
```
```ts {3-7}
  // Now we are going to demonstrate a race condition
  async incrementWithRace(): Promise<number> { 
    // 1. We get the current quantity
    const current = this.state.quantity;

    // 2. Create a timer that resolves in 10 ms -> we wait for this
    await new Promise((resolve) => setTimeout(resolve, 10));

    // 3. After the timer goes off -> we increment the state and return
  }
```
```ts {3-11}
  // Now we are going to demonstrate a race condition
  async incrementWithRace(): Promise<number> { 
    // 1. We get the current quantity
    const current = this.state.quantity;

    // 2. Create a timer that resolves in 10 ms -> we wait for this
    await new Promise((resolve) => setTimeout(resolve, 10));
    
    // 3. After the timer goes off -> we increment the state and return
    this.state.quantity = current + 1;
    return this.state.quantity;    
  }
```
```ts
export type CartRecord = { quantity: number };

export class CartService {
  private state: CartRecord = { quantity: 0 };

  async incrementWithRace(): Promise<number> {
    const current = this.state.quantity;
    await new Promise((resolve) => setTimeout(resolve, 10));
    this.state.quantity = current + 1;
    return this.state.quantity;
  }
}
```
````

<v-switch>
  <template #0-1> <b>What</b> and <b>what</b> is the problem? </template>
  <template #1> What happens when we run this code? </template>  
</v-switch>

<p class="reading-connection">Reading connection: sections 13-14.</p>

---

## Running Lost Update (Demo 01)

```bash {*|6|6-7|8}
npm run demo

  - example-01-race-condition@1.0.0 demo
  - tsx src/demo.ts

Results of concurrent increments: [ 1, 1, 1, 1, 1 ]
Final quantity: 1
Expected quantity if no race existed: 5
```

<v-switch>
  <template #0-1> How could this happen? </template>  
</v-switch>

---
class: text-2xl cols-70-30
layout: two-cols-header
---

## Lost Update Timeline (Visual)

::left::

<img src="./images/6.9-race-condition.svg" alt="Race condition timeline" class="reading-image" />

::right::

Both requests can read the same old value before either write completes.

This is exactly the problem in the code example!

---
class: text-2xl
layout: two-cols-header
layoutClass: cols-30-70
---

## Lost Update Timeline (Visual)

::left::

```ts {*|7|8|8|8|7,9}
export type CartRecord = { quantity: number };

export class CartService {
  private state: CartRecord = { quantity: 0 };

  async incrementWithRace(): Promise<number> {
    const current = this.state.quantity;
    await new Promise((resolve) => setTimeout(resolve, 10));
    this.state.quantity = current + 1;
    return this.state.quantity;
  }
}
```

::right::

<template v-if="$clicks === 1">

  Each time we call `incrementWithRace()`, the current state is fetched.

  **`current` is the state.**

</template>
<template v-else-if="$clicks === 2">

  Then we start a 10 ms timer by creating a Promise and awaiting it.

  `await` pauses this function, but it does not pause the whole program.

</template>
<template v-else-if="$clicks === 3">
  
  While this function is waiting, other requests can run and read the same old  
  value.

</template>
<template v-else-if="$clicks === 4">

  This is an asynchronous operation.
  
  This allows other calls to `incrementWithRace` to occur.

</template>
<template v-else-if="$clicks === 5">

  All of those calls store the current state into `current`, so they will overwrite each other.

</template>

---
class: text-2xl
---

## Repository Boundary Pattern

- Put persistence behind an interface.
- Services depend on contracts, not storage APIs.
- This isolates IO details from domain behavior.

☑ The repository boundary is the key design decision.

<p class="reading-connection">Reading connection: section 15.</p>

---
class: text-2xl
---

## Repository Interface Example (Demo 02)

```ts [examples/02-repository-boundary/src/EntryRepository.ts]
export interface EntryRepository {
  create(input: CreateEntryInput): Promise<Entry>;
  findById(id: string): Promise<Entry | null>;
  list(): Promise<Entry[]>;
}
```

<div class="h-6"></div>

- Stable method signatures preserve calling code.
- Interface-first design enables storage swaps.

<p class="reading-connection">Reading connection: section 15 + Appendix B.</p>

---
class: text-2xl
---

### In-Memory vs File-Backed Implementations

- `InMemoryEntryRepository.ts`: fast, volatile
- `JsonFileEntryRepository.ts`: durable across restarts
- Same interface, different durability/performance tradeoffs

**This is the continuity bridge into Prisma later:**
- preserve boundary, swap implementation

<p class="reading-connection">Reading connection: sections 16-18.</p>

<!--
Show the code for InMemory and JsonFile...
-->

---
class: text-2xl
---

## Serialization and Type Boundaries

- TypeScript types are compile-time only.
- Stored bytes are runtime truth.
- Validate at IO boundaries.

**Type safety in source does not guarantee validity on disk.**

<p class="reading-connection">Reading connection: section 19.</p>

---
class: framed-lists-green text-2xl
---

## Observability + Debugging Flow

- Log operation + id + duration + outcome.
- Inspect stored bytes/rows immediately after write.
- Restart process and re-read state.

**Without observability... <br> persistence debugging becomes guesswork.**

<p class="reading-connection">Reading connection: sections 20 and 25.</p>

<!--
remove this one.
-->

---
class: framed-lists-green text-2xl
---

## Testing Persistence Semantics

Required test layers:

- Unit tests for repository behavior
- Integration tests against real storage medium
- Restart test proving survival across process boundary

Minimal restart test pattern:
- arrange → write → restart → assert.

<p class="reading-connection">Reading connection: section 21.</p>

<!--
remove this one.
-->

---
class: text-2xl framed-lists-green
layout: two-cols-header
layoutClass: cols-50-50 title-tight exercise-compact
---

::left::

### In-Class Exercise (Pairs)

Pick **2 scenarios** and fill in design blanks. Scenarios:

- A) Save a journal entry draft
- B) Increment cart item quantity
- C) Mark a task complete
- D) Rename a project

For each scenario, produce:

1. Canonical state
2. Invariant
3. Failure risk
4. Repository boundary method
5. One restart-style verification test

::right::

<div class="callout">
Goal: make your design defensible under restart, failure, and concurrency.
</div>

<div class="sticky-note text-base">

<strong>Example (A: Save a journal draft)</strong>
1. Canonical state: draft id + draft content
2. Invariant: draft content is non-empty
3. Failure risk: crash after user clicks save, before write completes
4. Repository boundary: <code>saveDraft(id, content)</code>
5. Verification test: write draft → restart server → draft still loads

</div>


---
class: text-2xl
---

## Practical Express/HTMX Integration

- Route handlers orchestrate HTTP + rendering.
- Repository handles persistence IO.
- This keeps transport concerns separate from durability concerns.

**Key Reminder:** frontend interaction style does not remove backend persistence responsibility.

<p class="reading-connection">Reading connection: sections 22-24.</p>

---
class: text-2xl
---

## The Focus

We **are not** doing this:
- SQL optimization
- Distributed transaction patterns

We **are** doing this:
- ORM internals (Object-Relational Mapping)

**Scope Discipline Matters:** 
- This lecture builds *boundary* + *correctness* model first.

---
class: text-2xl
---

## What to Internalize

- Persistence is architecture, not just API calls.
- Durable systems require boundaries, <br> invariants, and tests.
- Correctness must survive restart and concurrency.

<p class="reading-connection">Reading connection: sections 32-33.</p>

---
class: text-2xl
---

## How to Study This Lecture

- Re-run all three demos from the reading.
- Use Appendix A to tighten vocabulary (`process`, `durability`, `invariant`).
- Use Appendix B for API references.
- Complete section 30 practice prompts.

If you can answer the practice prompts without notes, you are ready for implementation and exam reasoning.

---
class: text-2xl
---

## Where We Go Next (Prisma Lecture)

- Swap repository implementation to Prisma.
- Preserve repository contract.
- Preserve mental model and test strategy.

Better tooling **should not require** rethinking 
<br> core architecture.

<p class="reading-connection">Reading connection: section 27.</p>
