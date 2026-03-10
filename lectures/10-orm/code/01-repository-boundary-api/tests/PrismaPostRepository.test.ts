import { PrismaClient } from '@prisma/client'
import { PrismaPostRepository } from '../src/PrismaPostRepository.js'
import { ensureDatabase } from '../src/setupDatabase.js'

describe('PrismaPostRepository', () => {
  const prisma = new PrismaClient()
  const repository = new PrismaPostRepository(prisma)

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

  test('lists posts in descending id order', async () => {
    const user = await prisma.user.create({
      data: { email: 'repo@school.edu', name: 'Repo User' },
    })

    const first = await repository.create('First', 'One', user.id)
    const second = await repository.create('Second', 'Two', user.id)

    const posts = await repository.listByAuthor(user.id)

    expect(posts.map((p) => p.id)).toEqual([second.id, first.id])
  })
})
