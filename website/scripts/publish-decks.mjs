#!/usr/bin/env node

import { execFile as execFileCallback } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFile = promisify(execFileCallback);

const WEBSITE_ROOT = process.cwd();
const REPO_ROOT = path.resolve(WEBSITE_ROOT, "..");
const LECTURES_ROOT = path.join(REPO_ROOT, "lectures");
const PUBLISH_SCRIPT = path.join(REPO_ROOT, "scripts", "publish-slidev-deck.sh");

const lectureDirs = (await fs.readdir(LECTURES_ROOT, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

let count = 0;

for (const lectureSlug of lectureDirs) {
  const deckDir = path.join(LECTURES_ROOT, lectureSlug, "slides");
  try {
    await fs.access(path.join(deckDir, "slides.md"));
    await fs.access(path.join(deckDir, "package.json"));
  } catch {
    continue;
  }

  console.log(`[publish-decks] publishing ${lectureSlug}`);
  const { stdout, stderr } = await execFile(PUBLISH_SCRIPT, [deckDir, lectureSlug], {
    cwd: REPO_ROOT,
    maxBuffer: 1024 * 1024 * 50,
  });

  if (stdout.trim()) process.stdout.write(stdout);
  if (stderr.trim()) process.stderr.write(stderr);
  count += 1;
}

console.log(`[publish-decks] done (${count} deck${count === 1 ? "" : "s"})`);
