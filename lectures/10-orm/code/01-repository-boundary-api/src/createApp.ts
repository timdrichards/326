import { Prisma } from '@prisma/client'
import type { PrismaClient } from '@prisma/client'
import express from 'express'
import { PrismaPostRepository } from './PrismaPostRepository.js'
import { createPostWithAudit } from './createPostWithAudit.js'

function toPositiveInt(value: string): number | null {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null
  }
  return parsed
}

export function createApp(prisma: PrismaClient) {
  const app = express()
  const repository = new PrismaPostRepository(prisma)

  app.use(express.json())

  app.post('/users', async (req, res) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : ''
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : undefined

    if (!email) {
      return res.status(400).json({ error: 'email is required' })
    }

    try {
      const user = await prisma.user.create({
        data: { email, name },
      })
      return res.status(201).json({ user })
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return res.status(409).json({ error: 'email already exists' })
      }

      throw error
    }
  })

  app.post('/authors/:authorId/posts', async (req, res) => {
    const authorId = toPositiveInt(req.params.authorId)
    const title = typeof req.body?.title === 'string' ? req.body.title.trim() : ''
    const body = typeof req.body?.body === 'string' ? req.body.body.trim() : ''

    if (!authorId || !title || !body) {
      return res.status(400).json({ error: 'authorId, title, and body are required' })
    }

    const result = await createPostWithAudit(prisma, { title, body, authorId })
    return res.status(201).json(result)
  })

  app.get('/authors/:authorId/posts', async (req, res) => {
    const authorId = toPositiveInt(req.params.authorId)

    if (!authorId) {
      return res.status(400).json({ error: 'invalid authorId' })
    }

    const posts = await repository.listByAuthor(authorId)
    return res.status(200).json({ posts })
  })

  return app
}
