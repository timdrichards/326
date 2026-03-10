import { Err, Ok, Result } from "../lib/result.js";
import { EntryError, EntryNotFound, ValidationError } from "../lib/errors.js";
import { CreateEntryInput, Entry, IEntryRepository } from "./EntryRepository.js";

// In-memory repository used for fast local development and mode switching.
class InMemoryEntryRepository implements IEntryRepository {
  private entries: Entry[] = [];
  private nextId = 1;

  async add(input: CreateEntryInput): Promise<Result<Entry, EntryError>> {
    const title = String(input.title ?? "").trim();
    const body = String(input.body ?? "").trim();
    const tag = String(input.tag ?? "general").trim().toLowerCase();

    if (!title || !body) {
      // Repository guard in case service-level validation is bypassed.
      return Err(ValidationError("Repository received empty title or body."));
    }

    const now = new Date().toISOString();
    const entry: Entry = {
      id: this.nextId++,
      title,
      body,
      tag,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };

    this.entries.push(entry);
    return Ok(entry);
  }

  async getById(id: number): Promise<Result<Entry, EntryError>> {
    const found = this.entries.find(entry => entry.id === id);
    if (!found) {
      return Err(EntryNotFound(`Entry with id ${id} not found.`));
    }
    return Ok(found);
  }

  async getAll(): Promise<Result<Entry[], EntryError>> {
    return Ok([...this.entries].sort((a, b) => b.id - a.id));
  }

  async search(query: string): Promise<Result<Entry[], EntryError>> {
    const q = query.trim().toLowerCase();
    if (!q) {
      return this.getAll();
    }

    const filtered = this.entries
      .filter(entry => `${entry.title} ${entry.body} ${entry.tag}`.toLowerCase().includes(q))
      .sort((a, b) => b.id - a.id);

    return Ok(filtered);
  }

  async filterByStatus(status: "all" | "active" | "completed"): Promise<Result<Entry[], EntryError>> {
    if (status === "all") {
      return this.getAll();
    }

    const filtered = this.entries
      .filter(entry => entry.status === status)
      .sort((a, b) => b.id - a.id);

    return Ok(filtered);
  }

  async toggleById(id: number): Promise<Result<Entry, EntryError>> {
    const foundIndex = this.entries.findIndex(entry => entry.id === id);
    if (foundIndex < 0) {
      return Err(EntryNotFound(`Entry with id ${id} not found.`));
    }

    const current = this.entries[foundIndex];
    const updated: Entry = {
      ...current,
      status: current.status === "completed" ? "active" : "completed",
      updatedAt: new Date().toISOString(),
    };

    this.entries[foundIndex] = updated;
    return Ok(updated);
  }
}

export function CreateInMemoryEntryRepository(): IEntryRepository {
  return new InMemoryEntryRepository();
}
