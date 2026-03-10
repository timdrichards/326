import { PrismaClient } from '@prisma/client'
import { createUserSafely } from '../src/createUserSafely.js'
import { ensureDatabase } from '../src/setupDatabase.js'

describe('createUserSafely', () => {
  const prisma = new PrismaClient()

  beforeAll(async () => {
    await ensureDatabase(prisma)
    await prisma.$connect()
  })

  beforeEach(async () => {
    await prisma.auditLog.deleteMany()
    await prisma.post.deleteMany()
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  test('returns duplicate_email for existing email', async () => {
    await prisma.user.create({
      data: { email: 'test@school.edu', name: 'Test' },
    })

    const result = await createUserSafely(prisma, 'test@school.edu', 'Another')

    expect(result).toEqual({ ok: false, reason: 'duplicate_email' })
  })
})
