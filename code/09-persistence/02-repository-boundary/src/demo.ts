import { promises as fs } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { InMemoryEntryRepository } from "./InMemoryEntryRepository";
import { JsonFileEntryRepository } from "./JsonFileEntryRepository";

async function main(): Promise<void> {
  const inMemoryRepo = new InMemoryEntryRepository();
  const inMemoryEntry = await inMemoryRepo.create({
    title: "In-memory note",
    body: "This exists only for this process.",
  });

  const filePath = fileURLToPath(new URL("../data/entries.json", import.meta.url));
  await fs.mkdir(dirname(filePath), { recursive: true });

  const fileRepo = new JsonFileEntryRepository(filePath);
  const fileEntry = await fileRepo.create({
    title: "Persistent note",
    body: "This should remain in JSON after the process exits.",
  });

  console.log("Created in-memory entry:", inMemoryEntry);
  console.log("Created JSON-backed entry:", fileEntry);
  console.log("JSON-backed entries:", await fileRepo.list());
}

void main();
