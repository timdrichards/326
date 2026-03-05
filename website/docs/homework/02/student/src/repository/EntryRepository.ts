export type Entry = {
  id: number;
  title: string;
  body: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateEntryInput = {
  title: string;
  body: string;
};

export interface EntryRepository {
  create(input: CreateEntryInput): Promise<Entry>;
  list(): Promise<Entry[]>;
  findById(id: number): Promise<Entry | null>;
  toggleComplete(id: number): Promise<Entry | null>;
}
