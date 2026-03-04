import { createApp } from './createApp.js'
import { createPrismaClient } from './prismaClient.js'
import { ensureDatabase } from './setupDatabase.js'

const PORT = 3000
const prisma = createPrismaClient()
const app = createApp(prisma)

ensureDatabase(prisma)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Repository boundary API running at http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
