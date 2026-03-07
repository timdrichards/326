import { Err, Result } from "../lib/result.js";
import { CreateEntryInput, Entry, IEntryRepository } from "../repository/EntryRepository.js";
import { EntryError, InvalidContent, ValidationError } from "../lib/errors.js";

// Service contract for domain rules and orchestration over repository calls.
export interface IEntryService {
  createEntry(input: CreateEntryInput): Promise<Result<Entry, EntryError>>;
  listEntries(): Promise<Result<Entry[], EntryError>>;
  toggleEntry(id: number): Promise<Result<Entry, EntryError>>;
  searchEntries(query: string): Promise<Result<Entry[], EntryError>>;
  filterEntriesByStatus(status: string): Promise<Result<Entry[], EntryError>>;
}

class EntryService implements IEntryService {
  constructor(private readonly repository: IEntryRepository) {}

  async createEntry(input: CreateEntryInput): Promise<Result<Entry, EntryError>> {
    // Normalize all user input once at the service boundary.
    const title = String(input.title ?? "").trim();
    const body = String(input.body ?? "").trim();
    const tag = String(input.tag ?? "general").trim().toLowerCase();

    if (!title || !body) {
      return Err(InvalidContent("Title and body are required."));
    }

    if (title.length < 3) {
      return Err(ValidationError("Title must be at least 3 characters."));
    }

    if (body.length < 8) {
      return Err(ValidationError("Body must be at least 8 characters."));
    }

    if (!/^[a-z0-9-]{2,20}$/.test(tag)) {
      return Err(
        ValidationError("Tag must be 2-20 chars (lowercase letters, numbers, hyphen)."),
      );
    }

    return this.repository.add({ title, body, tag });
  }

  async listEntries(): Promise<Result<Entry[], EntryError>> {
    return this.repository.getAll();
  }

  async toggleEntry(id: number): Promise<Result<Entry, EntryError>> {
    return this.repository.toggleById(id);
  }

  async searchEntries(query: string): Promise<Result<Entry[], EntryError>> {
    return this.repository.search(query);
  }

  async filterEntriesByStatus(status: string): Promise<Result<Entry[], EntryError>> {
    const normalized = status.trim().toLowerCase();
    if (!normalized) {
      return Err(ValidationError("Status filter is required."));
    }

    if (normalized !== "all" && normalized !== "active" && normalized !== "completed") {
      return Err(ValidationError("Status filter must be all, active, or completed."));
    }

    return this.repository.filterByStatus(normalized);
  }
}

export function CreateEntryService(repository: IEntryRepository): IEntryService {
  return new EntryService(repository);
}
