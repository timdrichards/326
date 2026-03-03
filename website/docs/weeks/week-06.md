---
title: 'Week 06'
sidebar_position: 6
---

# Week 06 - Persistence

## Overview

This week is organized as a two-lecture sequence that moves from persistence fundamentals to practical database tooling.

In the first lecture, we focus on persistence as the boundary between in-memory runtime state and durable application state. We cover canonical sources of truth, common failure modes, race conditions such as lost updates, and why repository boundaries matter for correctness and testability.

In the second lecture, we shift from file-based persistence to relational databases and object-relational mapping. We introduce Prisma as the ORM layer, model data with schemas, apply migrations, and connect application code to database-backed repositories.

By the end of the week, students should understand not only why persistence matters, but also how to implement a maintainable path from conceptual data modeling to production-style database workflows.

## Learning Goals

By the end of this week, students should be able to:

- distinguish volatile runtime state from persistent canonical state, and explain where persistence boundaries belong in a web application
- identify failure and concurrency risks (for example, partial writes and lost updates) and describe patterns that preserve correctness over time
- model relational data for a course-sized app and map core entities, constraints, and relationships to a schema
- use Prisma to define a schema, run migrations, and perform basic CRUD operations through a repository-style backend interface
- evaluate tradeoffs between file-based persistence and database-backed persistence in terms of correctness, maintainability, and scalability

## Lecture 6.9: Persistence

In this lecture, we learn why persistence matters in real apps: memory is temporary, but user data must stay correct after restarts, errors, and overlapping requests. We focus on the core ideas from the slides and reading: the difference between volatile and persistent state, what counts as canonical data, and why a clear repository boundary helps keep code clean and testable. Through small TypeScript examples, we also look at common problems like partial writes and lost updates, then practice simple patterns that make data handling safer and easier to reason about.

- <a href="/326/decks/09-persistence/" target="_blank" rel="noopener noreferrer">Slides</a>
- [Reading](/readings/9-persistence.md)
- <a href="/326/code/09-persistence.zip" target="_blank" rel="noopener noreferrer">Code</a>

## Lecture 6.10: Repositories and ORMs

- Slides (not available yet)
- Code (not available yet)
