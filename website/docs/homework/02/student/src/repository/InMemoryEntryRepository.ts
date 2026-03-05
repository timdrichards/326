import type { CreateEntryInput, Entry, EntryRepository } from "./EntryRepository.js";

export class InMemoryEntryRepository implements EntryRepository {
  private readonly entries = new Map<number, Entry>();
  private nextId = 1;

  async create(input: CreateEntryInput): Promise<Entry> {
    // TODO(HW2): Enforce your invariants before persisting.
    const now = new Date().toISOString();
    const entry: Entry = {
      id: this.nextId++,
      title: input.title,
      body: input.body,
      isCompleted: false,
      createdAt: now,
      updatedAt: now,
    };

    this.entries.set(entry.id, entry);
    return entry;
  }

  async list(): Promise<Entry[]> {
    return Array.from(this.entries.values()).sort((a, b) => b.id - a.id);
  }

  async findById(id: number): Promise<Entry | null> {
    return this.entries.get(id) ?? null;
  }

  async toggleComplete(id: number): Promise<Entry | null> {
    const existing = this.entries.get(id);
    if (!existing) return null;

    const updated: Entry = {
      ...existing,
      isCompleted: !existing.isCompleted,
      updatedAt: new Date().toISOString(),
    };

    this.entries.set(id, updated);
    return updated;
  }
}
