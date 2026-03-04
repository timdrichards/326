# 01 - Repository Boundary API

Express + Prisma example that keeps persistence logic behind a repository boundary.

## Commands

- `npm install`
- `npm run prisma:generate`
- `npm run db:setup`
- `npm run dev`
- `npm test`

## API

- `POST /users` -> create user
- `POST /authors/:authorId/posts` -> create post + audit log transaction
- `GET /authors/:authorId/posts` -> list posts in descending order
