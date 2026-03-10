import { promises as fs } from "node:fs";

export async function writeJsonAtomic<T>(filePath: string, data: T): Promise<void> {
  const tempPath = `${filePath}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(data), "utf8");
  await fs.rename(tempPath, filePath);
}

export async function readJson<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
