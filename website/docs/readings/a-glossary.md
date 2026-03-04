# Appendix A Glossary

## Process

A **process** is one running instance of a program.

Think of a program like a recipe card, and a process like actually cooking that recipe in a kitchen. The recipe card (program) is just instructions on its own. The cooking session (process) is those instructions being actively carried out, with real ingredients, tools, and timer state.

In computing terms, a process has:
- its own memory (the data it is using right now),
- its own execution state (what line of code it is on),
- and its own resources (like open files or network connections).

If the process stops, that live working state is gone unless it was saved somewhere persistent (like a file or database).

## Relational Database

A **relational database** stores data in structured tables and connects data through defined relationships.

It uses a schema to describe table structure and rules, and it is commonly queried using SQL.

Relational systems are popular because they make data rules explicit and enforceable.

## ORM

An **ORM** (Object-Relational Mapping) is a tool that helps your application code work with relational database data using object-like APIs.

Instead of writing SQL strings for every read/write operation yourself, you use ORM methods that map to SQL under the hood.

Important: an ORM does not remove SQL concepts. Tables, relations, constraints, and query performance still matter.

## Prisma

**Prisma** is a TypeScript-first ORM toolkit.

It includes:
- a schema language (`schema.prisma`),
- migration tooling,
- and a generated typed Prisma Client for querying your database.

In this course, Prisma is used as a persistence implementation inside a repository boundary.

## Prisma Client

**Prisma Client** is generated code that provides typed methods for database operations.

Examples include calls like `prisma.user.create(...)` and `prisma.post.findMany(...)`.

Because it is generated from your schema, TypeScript can catch many mistakes early while you code.

## Schema

A **schema** is the formal structure of your data model: entities, fields, data types, keys, and relationships.

In Prisma, schema is written in `schema.prisma`. It is the contract between your application and database structure.

## Table

A **table** is a named collection of records that share the same column structure.

You can think of a table as one entity set, such as users or posts.

## Column

A **column** is one field definition in a table, such as `email` or `createdAt`.

Columns define what kind of value is expected for that part of each row.

## Row

A **row** is one record instance in a table.

For example, one row in a `User` table represents one specific user account.

## Migration

A **migration** is a versioned change to your database schema.

Migrations help teams evolve schema safely over time and keep environments in sync.

Think of migration history as a changelog for your database structure.

## Relation

A **relation** describes how records in one table connect to records in another.

Example: one `User` can have many `Post` records (one-to-many).

Relations are usually represented with foreign keys in relational databases.

## Primary Key

A **primary key** is a column (or set of columns) that uniquely identifies each row in a table.

Primary keys are used for stable identity and reliable references.

## Foreign Key

A **foreign key** is a column that points to a primary key in another table.

Foreign keys express relationships and help prevent invalid cross-table references.

## Query

A **query** is a request to read or modify data in a database.

Queries can select rows, insert records, update values, or delete records.

## SQL

**SQL** (Structured Query Language) is the standard language used to query and manipulate relational databases.

ORM tools like Prisma usually generate SQL under the hood.

## Transaction

A **transaction** is a group of operations treated as one unit of work.

Either all operations commit, or none do.

Transactions are used to preserve consistency when multiple writes must succeed together.
