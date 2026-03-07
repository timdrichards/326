import { PrismaClient } from "@prisma/client";
import { Err, Ok, Result } from "../lib/result.js";
import {
  EntryError,
  EntryNotFound,
  UnexpectedDependencyError,
  ValidationError,
} from "../lib/errors.js";
import { CreateEntryInput, Entry, IEntryRepository } from "./EntryRepository.js";

// Convert Prisma model values to the app-level Entry shape.
function toEntry(model: {
  id: number;
  title: string;
  body: string;
  tag: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}): Entry {
  return {
    id: model.id,
    title: model.title,
    body: model.body,
    tag: model.tag,
    status: model.status,
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

class PrismaEntryRepository implements IEntryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async add(input: CreateEntryInput): Promise<Result<Entry, EntryError>> {
    const title = String(input.title ?? "").trim();
    const body = String(input.body ?? "").trim();
    const tag = String(input.tag ?? "general").trim().toLowerCase();

    if (!title || !body) {
      return Err(ValidationError("Repository received empty title or body."));
    }

    try {
      const created = await this.prisma.entry.create({
        data: { title, body, tag },
      });
      return Ok(toEntry(created));
    } catch {
      // DB/driver failures are mapped to a typed dependency error.
      return Err(UnexpectedDependencyError("Database write failed while creating entry."));
    }
  }

  async getById(id: number): Promise<Result<Entry, EntryError>> {
    try {
      const row = await this.prisma.entry.findUnique({ where: { id } });
      if (!row) {
        return Err(EntryNotFound(`Entry with id ${id} not found.`));
      }
      return Ok(toEntry(row));
    } catch {
      return Err(UnexpectedDependencyError("Database read failed while loading entry."));
    }
  }

  async getAll(): Promise<Result<Entry[], EntryError>> {
    try {
      const rows = await this.prisma.entry.findMany({ orderBy: { id: "desc" } });
      return Ok(rows.map(toEntry));
    } catch {
      return Err(UnexpectedDependencyError("Database read failed while listing entries."));
    }
  }

  async search(query: string): Promise<Result<Entry[], EntryError>> {
    const q = query.trim();

    try {
      if (!q) {
        return this.getAll();
      }

      const rows = await this.prisma.entry.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { body: { contains: q } },
            { tag: { contains: q } },
          ],
        },
        orderBy: { id: "desc" },
      });

      return Ok(rows.map(toEntry));
    } catch {
      return Err(UnexpectedDependencyError("Database read failed while searching entries."));
    }
  }

  async filterByStatus(
    status: "all" | "active" | "completed",
  ): Promise<Result<Entry[], EntryError>> {
    try {
      if (status === "all") {
        return this.getAll();
      }

      const rows = await this.prisma.entry.findMany({
        where: { status },
        orderBy: { id: "desc" },
      });

      return Ok(rows.map(toEntry));
    } catch {
      return Err(UnexpectedDependencyError("Database read failed while filtering entries."));
    }
  }

  async toggleById(id: number): Promise<Result<Entry, EntryError>> {
    try {
      const found = await this.prisma.entry.findUnique({ where: { id } });
      if (!found) {
        return Err(EntryNotFound(`Entry with id ${id} not found.`));
      }

      const updated = await this.prisma.entry.update({
        where: { id },
        data: { status: found.status === "completed" ? "active" : "completed" },
      });

      return Ok(toEntry(updated));
    } catch {
      return Err(UnexpectedDependencyError("Database update failed while toggling entry."));
    }
  }
}

export function CreatePrismaEntryRepository(prisma: PrismaClient): IEntryRepository {
  return new PrismaEntryRepository(prisma);
}
