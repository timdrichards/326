import { PrismaClient } from "@prisma/client";
import type { CreateEntryInput, Entry, EntryRepository } from "./EntryRepository.js";

function toEntry(model: {
  id: number;
  title: string;
  body: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}): Entry {
  return {
    id: model.id,
    title: model.title,
    body: model.body,
    isCompleted: model.isCompleted,
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export class PrismaEntryRepository implements EntryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: CreateEntryInput): Promise<Entry> {
    // TODO(HW2): Add input validation and map known Prisma errors if needed.
    const created = await this.prisma.entry.create({
      data: {
        title: input.title,
        body: input.body,
      },
    });

    return toEntry(created);
  }

  async list(): Promise<Entry[]> {
    const rows = await this.prisma.entry.findMany({
      orderBy: { id: "desc" },
    });
    return rows.map(toEntry);
  }

  async findById(id: number): Promise<Entry | null> {
    const row = await this.prisma.entry.findUnique({ where: { id } });
    return row ? toEntry(row) : null;
  }

  async toggleComplete(id: number): Promise<Entry | null> {
    const row = await this.prisma.entry.findUnique({ where: { id } });
    if (!row) return null;

    const updated = await this.prisma.entry.update({
      where: { id },
      data: { isCompleted: !row.isCompleted },
    });

    return toEntry(updated);
  }
}
