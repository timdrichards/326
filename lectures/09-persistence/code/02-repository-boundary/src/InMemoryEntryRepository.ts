import { randomUUID } from "node:crypto";
import { CreateEntryInput, Entry, EntryRepository } from "./EntryRepository";

export class InMemoryEntryRepository implements EntryRepository {
  private readonly entries = new Map<string, Entry>();

  async create(input: CreateEntryInput): Promise<Entry> {
    const entry: Entry = {
      id: randomUUID(),
      title: input.title,
      body: input.body,
      createdAt: new Date().toISOString(),
    };
    this.entries.set(entry.id, entry);
    return entry;
  }

  async findById(id: string): Promise<Entry | null> {
    return this.entries.get(id) ?? null;
  }

  async list(): Promise<Entry[]> {
    return Array.from(this.entries.values());
  }
}
