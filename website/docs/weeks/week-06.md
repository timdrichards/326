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

<!-- ## Agenda

### Class Meeting 1

- Warm-up / review: _TBD_
- Main topic(s): _TBD_
- Demo / worked example: _TBD_
- Wrap-up / check for understanding: _TBD_

### Class Meeting 2

- Review / questions: _TBD_
- Main topic(s): _TBD_
- Guided practice / lab time: _TBD_
- Preview of next week: _TBD_ -->

## Lecture Materials

- Slides: <a href="/326/decks/09-persistence/" target="_blank" rel="noopener noreferrer">09 Persistence</a>

<!-- - Notes: _Add link_
- Demo code (repo path): _Add link/path_
- Recording (if applicable): _Add link_ -->

<!-- ## In-Class Activities

- Activity 1: _TBD_
- Activity 2: _TBD_

## Assignments and Deadlines

- Homework released: _TBD_
- Homework due: _TBD_
- Reading / prep for next week: _TBD_

## Instructor Notes (Optional)

- What worked well: _TBD_
- What to adjust next time: _TBD_
- Common student misconceptions: _TBD_ -->
