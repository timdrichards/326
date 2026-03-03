export type Entry = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

export type CreateEntryInput = {
  title: string;
  body: string;
};

export interface EntryRepository {
  create(input: CreateEntryInput): Promise<Entry>;
  findById(id: string): Promise<Entry | null>;
  list(): Promise<Entry[]>;
}
