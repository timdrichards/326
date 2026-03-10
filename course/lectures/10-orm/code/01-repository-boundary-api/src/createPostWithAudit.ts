import type { PrismaClient } from '@prisma/client'

export async function createPostWithAudit(
  prisma: PrismaClient,
  input: { title: string; body: string; authorId: number },
): Promise<{ postId: number }> {
  const post = await prisma.$transaction(async (tx) => {
    const createdPost = await tx.post.create({
      data: {
        title: input.title,
        body: input.body,
        authorId: input.authorId,
      },
    })

    await tx.auditLog.create({
      data: {
        action: 'POST_CREATED',
        entityId: createdPost.id,
        message: 'Post created and logged',
      },
    })

    return createdPost
  })

  return { postId: post.id }
}
