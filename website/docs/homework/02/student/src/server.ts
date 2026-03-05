import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import { createApp } from "./app.js";
import { InMemoryEntryRepository } from "./repository/InMemoryEntryRepository.js";
import { PrismaEntryRepository } from "./repository/PrismaEntryRepository.js";

async function main() {
  const mode = process.env.REPO_MODE ?? "memory";
  const port = Number(process.env.PORT ?? 3000);

  const repo = (() => {
    if (mode !== "prisma") return new InMemoryEntryRepository();

    const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
    const adapter = new PrismaBetterSqlite3({ url });
    return new PrismaEntryRepository(new PrismaClient({ adapter }));
  })();

  const app = createApp(repo);
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`HW2 starter running on http://localhost:${port} (repo=${mode})`);
  });
}

void main();
