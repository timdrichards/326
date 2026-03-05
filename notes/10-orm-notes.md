# 10 ORM Notes

## Prisma Studio

Prisma Studio is a browser-based GUI for inspecting and editing the data in your Prisma-connected database.

### What it is

- A local admin-style view over your Prisma models and rows.
- A way to verify persisted state without writing SQL for every check.
- Useful for debugging query behavior during development.

### How to run it

From a project that already has Prisma configured:

```bash
npx prisma studio
```

Then open the local URL printed in the terminal (typically `http://localhost:5555`).

### Why this is a great addition to the course

- It shortens the feedback loop for beginners by making DB state visible immediately.
- It reinforces the connection between Prisma schema models and actual stored rows.
- It supports debugging and test verification, especially after create/update/delete operations.
- It complements (not replaces) `sqlite3` and SQL practice by giving students an additional inspection tool.
