import { PrismaClient } from '@prisma/client'
import { createPostWithAudit } from '../src/createPostWithAudit.js'
import { ensureDatabase } from '../src/setupDatabase.js'

describe('createPostWithAudit', () => {
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

  test('creates both post and audit log in one transaction', async () => {
    const user = await prisma.user.create({
      data: { email: 'writer@school.edu', name: 'Writer' },
    })

    const result = await createPostWithAudit(prisma, {
      title: 'Hello ORM',
      body: 'Body',
      authorId: user.id,
    })

    const post = await prisma.post.findUnique({ where: { id: result.postId } })
    const auditLogs = await prisma.auditLog.findMany({ where: { entityId: result.postId } })

    expect(post).not.toBeNull()
    expect(auditLogs).toHaveLength(1)
    expect(auditLogs[0]?.action).toBe('POST_CREATED')
  })
})
