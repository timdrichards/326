# Appendix B Code Reference

This appendix provides short, beginner-friendly explanations of external calls and abstractions used in course readings.

## 6.9 Persistence

### JSON.stringify
- **Call/abstraction:** `JSON.stringify(value)`
- **What it means:** Converts a JavaScript value (object/array/etc.) into a text string in JSON format so you can store or send it.
- **Short example:** `const text = JSON.stringify({ count: 3 });`
- **Docs:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify

### JSON.parse
- **Call/abstraction:** `JSON.parse(text)`
- **What it means:** Converts JSON text back into a JavaScript value.
- **Short example:** `const data = JSON.parse('{"count":3}');`
- **Docs:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse

### fs.writeFile
- **Call/abstraction:** `fs.writeFile(path, data, encoding)`
- **What it means:** Writes data to a file. If the file already exists, this call replaces its contents.
- **Short example:** `await fs.writeFile("./data.json", "{}", "utf8");`
- **Docs:** https://nodejs.org/api/fs.html#fspromiseswritefilefile-data-options

### fs.readFile
- **Call/abstraction:** `fs.readFile(path, encoding)`
- **What it means:** Reads a file and returns its contents.
- **Short example:** `const raw = await fs.readFile("./data.json", "utf8");`
- **Docs:** https://nodejs.org/api/fs.html#fspromisesreadfilepath-options

### fs.rename
- **Call/abstraction:** `fs.rename(oldPath, newPath)`
- **What it means:** Renames or moves a file path. In this lecture, it is used to swap a completed temp file into place.
- **Short example:** `await fs.rename("./data.json.tmp", "./data.json");`
- **Docs:** https://nodejs.org/api/fs.html#fspromisesrenameoldpath-newpath

### randomUUID
- **Call/abstraction:** `randomUUID()`
- **What it means:** Generates a unique ID string. Useful for giving each stored record its own identifier.
- **Short example:** `const id = randomUUID();`
- **Docs:** https://nodejs.org/api/crypto.html#cryptorandomuuidoptions

### Promise
- **Call/abstraction:** `Promise<T>` (for example `Promise<void>`)
- **What it means:** A Promise represents work that finishes later. `T` is the type of value you eventually get when it succeeds.
- **Short example:** `async function save(): Promise<void> { /* side effects only */ }`
- **Docs:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

### Promise.all
- **Call/abstraction:** `Promise.all([...])`
- **What it means:** Starts multiple async operations and waits for all of them to finish.
- **Short example:** `await Promise.all([taskA(), taskB()]);`
- **Docs:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all

### setTimeout
- **Call/abstraction:** `setTimeout(callback, ms)`
- **What it means:** Runs a callback after a delay. Useful for simulating timing/interleaving in demos.
- **Short example:** `setTimeout(() => console.log("later"), 10);`
- **Docs:** https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout

### Map
- **Call/abstraction:** `new Map()`
- **What it means:** A key-value data structure for in-memory storage.
- **Short example:** `const entries = new Map<string, string>();`
- **Docs:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map

### express.Router
- **Call/abstraction:** `express.Router()`
- **What it means:** Creates a mini route container so related endpoints can be grouped together.
- **Short example:** `const router = express.Router();`
- **Docs:** https://expressjs.com/en/guide/routing.html

### res.render
- **Call/abstraction:** `res.render(view, data)`
- **What it means:** Renders a server template into HTML and sends it as the response.
- **Short example:** `res.render("entries/index", { entries });`
- **Docs:** https://expressjs.com/en/api.html#res.render

### tsx
- **Call/abstraction:** `npx tsx file.ts`
- **What it means:** Runs TypeScript files directly without manually compiling first.
- **Short example:** `npx tsx demo.ts`
- **Docs:** https://github.com/privatenumber/tsx

## 6.10 ORM and Prisma

### SQL
- **Call/abstraction:** SQL (Structured Query Language)
- **What it means:** The standard language for reading and changing data in relational databases.
- **Short example:** `SELECT id, email FROM User;`
- **Docs:** https://www.w3schools.com/sql/

### SELECT
- **Call/abstraction:** `SELECT ... FROM ...`
- **What it means:** Reads data from one or more tables.
- **Short example:** `SELECT title FROM Post;`
- **Docs:** https://www.postgresql.org/docs/current/sql-select.html

### WHERE
- **Call/abstraction:** `WHERE condition`
- **What it means:** Filters rows to only those that match a condition.
- **Short example:** `SELECT * FROM Post WHERE authorId = 1;`
- **Docs:** https://www.w3schools.com/sql/sql_where.asp

### JOIN
- **Call/abstraction:** `JOIN` (for example `INNER JOIN`)
- **What it means:** Combines rows from related tables using matching key values.
- **Short example:** `SELECT p.title, u.email FROM Post p JOIN User u ON p.authorId = u.id;`
- **Docs:** https://www.w3schools.com/sql/sql_join.asp

### Prisma Client
- **Call/abstraction:** `new PrismaClient()`
- **What it means:** Creates a Prisma database client instance used for queries and mutations.
- **Short example:** `const prisma = new PrismaClient();`
- **Docs:** https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/introduction

### Prisma Create User
- **Call/abstraction:** `prisma.user.create({ data: ... })`
- **What it means:** Inserts one new `User` record using typed input data.
- **Short example:** `await prisma.user.create({ data: { email: "a@school.edu" } });`
- **Docs:** https://www.prisma.io/docs/orm/prisma-client/queries/crud#create-a-single-record

### Prisma Find Many Posts
- **Call/abstraction:** `prisma.post.findMany({ where, orderBy, ... })`
- **What it means:** Queries multiple `Post` records with optional filters, sorting, and limits.
- **Short example:** `await prisma.post.findMany({ where: { authorId: 1 } });`
- **Docs:** https://www.prisma.io/docs/orm/prisma-client/queries/crud#find-all-records

### Prisma Select
- **Call/abstraction:** `select: { ... }` in Prisma queries
- **What it means:** Chooses exactly which fields should be returned by a query.
- **Short example:** `select: { id: true, title: true }`
- **Docs:** https://www.prisma.io/docs/orm/prisma-client/queries/select-fields

### Prisma Order By
- **Call/abstraction:** `orderBy: { field: "asc" | "desc" }`
- **What it means:** Sorts query results by one or more fields.
- **Short example:** `orderBy: { createdAt: "desc" }`
- **Docs:** https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting#sorting

### Prisma Known Request Error
- **Call/abstraction:** `error instanceof Prisma.PrismaClientKnownRequestError`
- **What it means:** A known Prisma request error type (for example unique constraint violations).
- **Short example:** `if (error.code === "P2002") { ... }`
- **Docs:** https://www.prisma.io/docs/orm/reference/error-reference

### Prisma Transaction
- **Call/abstraction:** `prisma.$transaction(async (tx) => { ... })`
- **What it means:** Runs grouped database operations as a transaction (all succeed or all fail).
- **Short example:** `await prisma.$transaction(async (tx) => { await tx.post.create(...); });`
- **Docs:** https://www.prisma.io/docs/orm/prisma-client/queries/transactions

### Express JSON Middleware
- **Call/abstraction:** `app.use(express.json())`
- **What it means:** Express middleware that parses incoming JSON request bodies.
- **Short example:** `app.use(express.json())`
- **Docs:** https://expressjs.com/en/api.html#express.json

### Supertest Request
- **Call/abstraction:** `request(app).post(...).send(...)`
- **What it means:** Sends HTTP requests to an Express app during tests without a browser.
- **Short example:** `const res = await request(app).get("/health");`
- **Docs:** https://github.com/ladjs/supertest

### Jest Test Functions
- **Call/abstraction:** `describe`, `test`, `expect`
- **What it means:** Core Jest test structure for organizing and asserting behavior.
- **Short example:** `test("works", () => expect(1 + 1).toBe(2));`
- **Docs:** https://jestjs.io/docs/api
