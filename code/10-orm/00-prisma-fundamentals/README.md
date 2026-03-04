# 00 - Prisma Fundamentals

This example supports the ORM + Prisma lecture code snippets.

## Commands

- `npm install`
- `npm run prisma:generate`
- `npm run db:setup`
- `npm run demo`
- `npm test`

## What it demonstrates

- `prisma/schema.prisma`: Prisma data model and relations
- `src/sqlToPrisma.ts`: SQL intent translated to Prisma client query
- `src/prismaClientBasics.ts`: create and findMany basics
- `src/createUserSafely.ts`: handling unique constraint (`P2002`)
- `src/createPostWithAudit.ts`: transaction pattern
