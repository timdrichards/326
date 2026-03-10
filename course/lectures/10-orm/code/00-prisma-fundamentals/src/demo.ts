import { createPostWithAudit } from './createPostWithAudit.js'
import { createPrismaClient } from './prismaClient.js'
import { createUserAndListPosts } from './prismaClientBasics.js'
import { createUserSafely } from './createUserSafely.js'
import { ensureDatabase } from './setupDatabase.js'
import { RAW_SQL_RECENT_POSTS, getRecentPostsWithAuthorEmail } from './sqlToPrisma.js'

async function run(): Promise<void> {
  const prisma = createPrismaClient()
  await ensureDatabase(prisma)

  const created = await createUserSafely(prisma, `demo-${Date.now()}@school.edu`, 'Demo User')
  if (!created.ok) {
    throw new Error('Unexpected duplicate email in demo')
  }

  await createPostWithAudit(prisma, {
    title: 'ORMs are cool',
    body: 'Mostly.',
    authorId: created.user.id,
  })

  await createPostWithAudit(prisma, {
    title: 'Prisma feels safer',
    body: 'Types and migrations help.',
    authorId: created.user.id,
  })

  const recent = await getRecentPostsWithAuthorEmail(prisma)
  const basics = await createUserAndListPosts(prisma)

  console.log(RAW_SQL_RECENT_POSTS)
  console.log('Recent posts with author email:', recent)
  console.log('Prisma client basics sample user:', basics.user.email)

  await prisma.$disconnect()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
