import { createPrismaClient } from './prismaClient.js'
import { ensureDatabase } from './setupDatabase.js'

async function run(): Promise<void> {
  const prisma = createPrismaClient()
  await ensureDatabase(prisma)
  console.log('Database schema is ready.')
  await prisma.$disconnect()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
