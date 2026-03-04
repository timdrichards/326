1. Title
2. Community Agreement
3. Schedule
4. Reading (How To Use It)
	1. Primary reading: `Reading/6.9 Persistence.md`
	2. Today: lecture builds the mental model and demos
	3. After class: reading deepens details, examples, and exam prep
5. Lecture-Reading Map (show this early)
	1. Concept model in lecture -> sections 1-5 in reading
	2. Code demos in lecture -> sections 6-18 in reading
	3. Debugging/testing in lecture -> sections 20-25 in reading
	4. Exam prep in lecture -> sections 29-30 in reading
6. Why Persistence Exists
	1. Programs terminate
	2. Process memory is volatile
	3. Users expect data to still exist tomorrow
	4. Reading connection: section 1
7. A Precise Definition of Persistence
	1. Persistence means state survives process restart
	2. Usually also survives machine restart
	3. Durability is the property we seek
	4. Reading connection: section 3
8. The Core Problem Statement
	1. Keep state beyond runtime
	2. Retrieve and update reliably
	3. Preserve correctness under failure and concurrency
	4. Reading connection: sections 2 and 11-12
9. Data Lifetime Categories
	1. Request-lifetime
	2. Session-lifetime
	3. Application-lifetime
	4. Long-lived/persistent
	5. Reading connection: section 4
10. Storage Hierarchy (Mental Model)
	1. CPU/cache + RAM: fast, volatile
	2. Disk/SSD: persistent, slower
	3. Remote DB: shared, network latency
	4. Show storage hierarchy diagram used in reading
	5. Reading connection: section 5
11. Volatile vs Persistent (Node + TS demo)
	1. Show `examples/00-runtime-vs-persistent/src/inMemoryCounter.ts`
	2. In-memory state resets after restart
	3. File-backed value survives restart
	4. Reading connection: sections 6-7
12. Persistence Boundary in Web Apps
	1. Browser runtime != server runtime
	2. Server restart resets server memory
	3. Back-end persistence defines shared truth
	4. Reading connection: section 9
13. Canonical State and Sources of Truth
	1. Canonical values must be persisted
	2. Derived values can be recomputed
	3. Keep one authoritative source whenever possible
	4. Reading connection: section 2
14. Modeling Persistent State
	1. Identity (`id`)
	2. Attributes (fields)
	3. Constraints (required, unique, valid)
	4. Invariants must hold after every write
	5. Reading connection: sections 10 and 15
15. CRUD Is Necessary but Not Sufficient
	1. CRUD gives operations
	2. Correctness requires invariants + failure handling + concurrency safety
	3. Reading connection: section 11
16. Failure Modes You Must Design For
	1. Crash between read and write
	2. Partial write output
	3. Concurrent overwrite (lost update)
	4. Corrupted stored data
	5. Reading connection: section 12
17. Atomicity (Concept)
	1. Change should happen entirely or not at all
	2. Half-applied state causes bugs
	3. We model this with temp-write + rename pattern
	4. Reading connection: section 8
18. Atomic File Write Pattern (Node + TS demo)
	1. Show `examples/00-runtime-vs-persistent/src/fileStore.ts`
	2. Explain `fs.writeFile` to temp path then `fs.rename`
	3. Explain `Promise<void>` and `Promise<T | null>` quickly
	4. Reading connection: section 6 (plus Appendix B links)
19. Concurrency Hazards (Even on One Server)
	1. Requests interleave
	2. Read-modify-write can lose updates
	3. Timing can break correctness even if each request "looks right"
	4. Reading connection: section 13
20. Lost Update Example (Node + TS demo)
	1. Show `examples/01-race-condition/src/cartService.ts`
	2. Walk through race timeline visually
	3. Use race-condition diagram from reading
	4. Reading connection: sections 13-14
21. Repository Boundary Pattern
	1. Put persistence behind an interface
	2. Services call repository contracts, not storage APIs directly
	3. This is the main architecture decision of this lecture
	4. Reading connection: section 15
22. Repository Interface Example (Node + TS demo)
	1. Show `examples/02-repository-boundary/src/EntryRepository.ts`
	2. Explain `type` aliases and interface contract
	3. Keep method signatures stable
	4. Reading connection: section 15 + Appendix B
23. In-Memory vs File-Backed Implementations
	1. `InMemoryEntryRepository.ts`
	2. `JsonFileEntryRepository.ts`
	3. Same contract, different durability behavior
	4. Reading connection: sections 16-18
24. Serialization and Type Boundaries
	1. TypeScript types are compile-time only
	2. Stored bytes are runtime reality
	3. Validate at IO boundaries
	4. Reading connection: section 19
25. Observability + Debugging Flow
	1. Log operation + id + duration + outcome
	2. Verify stored bytes/rows after writes
	3. Restart and re-read to confirm durability
	4. Reading connection: sections 20 and 25
26. Testing Persistence Semantics
	1. Unit tests
	2. Integration tests with real medium
	3. Restart-style test (write -> stop -> start -> read -> assert)
	4. Reading connection: section 21
27. Practical Express/HTMX Integration
	1. Route handlers orchestrate HTTP + rendering
	2. Repository handles persistence IO
	3. Why this preserves boundaries in interactive apps
	4. Reading connection: sections 22-24
28. What We Are Not Doing Yet
	1. No ORM internals yet
	2. No SQL optimization yet
	3. No distributed transaction patterns yet
	4. Today is model + boundaries + failure awareness
29. What To Internalize
	1. Persistence is architecture, not just API calls
	2. Durable systems require boundary + invariants + tests
	3. Correctness must survive restart and concurrency
	4. Reading connection: sections 32-33
30. How To Study This Lecture
	1. Re-run all three demos from reading
	2. Use Appendix A for vocabulary (`process`)
	3. Use Appendix B for API references (`JSON.parse`, `fs.rename`, etc.)
	4. Complete practice prompts in section 30 of reading
31. Where We Go Next (Prisma Lecture)
	1. Swap implementation to Prisma
	2. Keep repository contract
	3. Keep mental model and test strategy
	4. Reading bridge: section 27

## In-Class Exercise (on one slide)

### Your task (pairs)

Pick **2 scenarios** and fill in the design blanks.

**Scenarios (choose 2):**
A) Save a journal entry draft
B) Increment cart item quantity
C) Mark a task complete
D) Rename a project

For each chosen scenario, write:
1. **Canonical state:** what must be persisted?
2. **Invariant:** what must always be true?
3. **Failure risk:** what could go wrong during write?
4. **Boundary:** which repository method should own persistence?
5. **Verification:** one restart-style test proving state survives a new process

### Debrief Connection to Reading

Map each answer to reading sections:
- Canonical state -> section 2
- Invariant -> section 10/15
- Failure risk -> section 12
- Boundary -> section 15/23
- Verification -> section 21
