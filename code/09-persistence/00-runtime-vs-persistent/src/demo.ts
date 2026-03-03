import { getCount, increment } from "./inMemoryCounter";
import { readJson, writeJsonAtomic } from "./fileStore";
import { promises as fs } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

type CounterSnapshot = {
  count: number;
  capturedAt: string;
};

async function main(): Promise<void> {
  console.log("In-memory counter demo");
  console.log("Initial count:", getCount());
  console.log("After increment #1:", increment());
  console.log("After increment #2:", increment());

  const filePath = fileURLToPath(new URL("../data/counter.json", import.meta.url));
  const snapshot: CounterSnapshot = {
    count: getCount(),
    capturedAt: new Date().toISOString(),
  };

  await fs.mkdir(dirname(filePath), { recursive: true });
  await writeJsonAtomic(filePath, snapshot);
  const loaded = await readJson<CounterSnapshot>(filePath);

  console.log("Persisted snapshot:", loaded);
}

void main();
