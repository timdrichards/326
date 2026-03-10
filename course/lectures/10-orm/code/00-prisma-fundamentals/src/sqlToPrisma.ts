import type { PrismaClient } from '@prisma/client'

export const RAW_SQL_RECENT_POSTS = `-- "Get recent posts with author email"
SELECT p.id, p.title, u.email
FROM Post p
JOIN User u ON p.authorId = u.id
ORDER BY p.id DESC
LIMIT 5;`

export async function getRecentPostsWithAuthorEmail(prisma: PrismaClient): Promise<
  Array<{ id: number; title: string; author: { email: string } }>
> {
  return prisma.post.findMany({
    orderBy: { id: 'desc' },
    take: 5,
    select: {
      id: true,
      title: true,
      author: { select: { email: true } },
    },
  })
}
