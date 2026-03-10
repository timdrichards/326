import type { PrismaClient } from '@prisma/client'

export async function ensureDatabase(prisma: PrismaClient): Promise<void> {
  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON;')

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "email" TEXT NOT NULL,
      "name" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `)

  await prisma.$executeRawUnsafe(
    'CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");',
  )

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Post" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "title" TEXT NOT NULL,
      "body" TEXT NOT NULL,
      "authorId" INTEGER NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
    );
  `)

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "AuditLog" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "action" TEXT NOT NULL,
      "entityId" INTEGER NOT NULL,
      "message" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `)
}
