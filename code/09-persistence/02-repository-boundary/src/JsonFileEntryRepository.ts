import { promises as fs } from "node:fs";
import { randomUUID } from "node:crypto";
import { CreateEntryInput, Entry, EntryRepository } from "./EntryRepository";

export class JsonFileEntryRepository implements EntryRepository {
  constructor(private readonly filePath: string) {}

  async create(input: CreateEntryInput): Promise<Entry> {
    const entries = await this.readAll();
    const entry: Entry = {
      id: randomUUID(),
      title: input.title,
      body: input.body,
      createdAt: new Date().toISOString(),
    };
    entries.push(entry);
    await this.writeAll(entries);
    return entry;
  }

  async findById(id: string): Promise<Entry | null> {
    const entries = await this.readAll();
    return entries.find((entry) => entry.id === id) ?? null;
  }

  async list(): Promise<Entry[]> {
    return this.readAll();
  }

  private async readAll(): Promise<Entry[]> {
    try {
      const raw = await fs.readFile(this.filePath, "utf8");
      return JSON.parse(raw) as Entry[];
    } catch {
      return [];
    }
  }

  private async writeAll(entries: Entry[]): Promise<void> {
    const tempPath = `${this.filePath}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(entries, null, 2), "utf8");
    await fs.rename(tempPath, this.filePath);
  }
}
