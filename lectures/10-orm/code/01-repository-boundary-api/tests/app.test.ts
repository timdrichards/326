import { PrismaClient } from '@prisma/client'
import request from 'supertest'
import { createApp } from '../src/createApp.js'
import { ensureDatabase } from '../src/setupDatabase.js'

describe('Repository boundary API', () => {
  const prisma = new PrismaClient()
  const app = createApp(prisma)

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

  test('creates and lists posts for an author', async () => {
    const createUserResponse = await request(app).post('/users').send({
      email: 'api@school.edu',
      name: 'API User',
    })

    expect(createUserResponse.status).toBe(201)
    const authorId = createUserResponse.body.user.id as number

    const createPostResponse = await request(app)
      .post(`/authors/${authorId}/posts`)
      .send({ title: 'Hello', body: 'Prisma post body' })

    expect(createPostResponse.status).toBe(201)

    const listResponse = await request(app).get(`/authors/${authorId}/posts`)

    expect(listResponse.status).toBe(200)
    expect(listResponse.body.posts).toHaveLength(1)
    expect(listResponse.body.posts[0].title).toBe('Hello')

    const auditLogs = await prisma.auditLog.findMany()
    expect(auditLogs).toHaveLength(1)
  })

  test('returns 409 for duplicate email', async () => {
    await request(app).post('/users').send({ email: 'dup@school.edu', name: 'One' })

    const duplicate = await request(app)
      .post('/users')
      .send({ email: 'dup@school.edu', name: 'Two' })

    expect(duplicate.status).toBe(409)
    expect(duplicate.body.error).toBe('email already exists')
  })
})
