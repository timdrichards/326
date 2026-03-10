import type { PrismaClient, User } from '@prisma/client'

export async function createUserAndListPosts(prisma: PrismaClient): Promise<{
  user: User
  posts: Array<{ id: number; title: string; body: string; authorId: number; createdAt: Date }>
}> {
  const user = await prisma.user.create({
    data: { email: `user-${Date.now()}@school.edu`, name: 'Avery' },
  })

  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return { user, posts }
}
