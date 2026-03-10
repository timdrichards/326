#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const WEBSITE_ROOT = process.cwd();
const REPO_ROOT = path.resolve(WEBSITE_ROOT, "..");

const SOURCE_ROOTS = {
  lectures: path.join(REPO_ROOT, "course", "lectures"),
  assignments: path.join(REPO_ROOT, "course", "assignments", "homework"),
  weeks: path.join(REPO_ROOT, "course", "weeks"),
  readings: path.join(REPO_ROOT, "course", "readings"),
};

const TARGET_ROOTS = {
  docs: path.join(WEBSITE_ROOT, "docs"),
  readings: path.join(WEBSITE_ROOT, "docs", "readings"),
  weeks: path.join(WEBSITE_ROOT, "docs", "weeks"),
  homework: path.join(WEBSITE_ROOT, "docs", "homework"),
};

async function ensureDir(target) {
  await fs.mkdir(target, { recursive: true });
}

async function resetDir(target) {
  await fs.rm(target, { recursive: true, force: true });
  await ensureDir(target);
}

async function copyFile(source, target) {
  await ensureDir(path.dirname(target));
  await fs.copyFile(source, target);
}

async function copyDirContents(source, target) {
  await ensureDir(target);
  const entries = await fs.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      await copyDirContents(sourcePath, targetPath);
      continue;
    }

    if (entry.isFile()) {
      await copyFile(sourcePath, targetPath);
    }
  }
}

async function syncWeeks() {
  await resetDir(TARGET_ROOTS.weeks);
  const files = (await fs.readdir(SOURCE_ROOTS.weeks))
    .filter((name) => name.endsWith(".md"))
    .sort();

  for (const file of files) {
    await copyFile(path.join(SOURCE_ROOTS.weeks, file), path.join(TARGET_ROOTS.weeks, file));
  }
}

async function syncReadings() {
  await resetDir(TARGET_ROOTS.readings);
  await copyDirContents(SOURCE_ROOTS.readings, TARGET_ROOTS.readings);
}

async function syncHomework() {
  await resetDir(TARGET_ROOTS.homework);
  const assignmentDirs = await fs.readdir(SOURCE_ROOTS.assignments, { withFileTypes: true });

  for (const entry of assignmentDirs) {
    if (!entry.isDirectory()) continue;

    const assignmentSlug = entry.name;
    const sourceDir = path.join(SOURCE_ROOTS.assignments, assignmentSlug);
    const targetDir = path.join(TARGET_ROOTS.homework, assignmentSlug);
    await ensureDir(targetDir);

    const docSource = path.join(sourceDir, `${assignmentSlug}.md`);
    try {
      await fs.access(docSource);
      await copyFile(docSource, path.join(targetDir, `${assignmentSlug}.md`));
    } catch {}

    const gitkeepSource = path.join(sourceDir, ".gitkeep");
    try {
      await fs.access(gitkeepSource);
      await copyFile(gitkeepSource, path.join(targetDir, ".gitkeep"));
    } catch {}
  }
}

await syncWeeks();
await syncReadings();
await syncHomework();

console.log("[sync-course-content] synced weeks, readings, and homework docs into website/docs");
