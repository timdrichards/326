#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const WEBSITE_ROOT = process.cwd();
const REPO_ROOT = path.resolve(WEBSITE_ROOT, "..");

const SOURCE_ROOTS = {
  lectures: path.join(REPO_ROOT, "lectures"),
  assignments: path.join(REPO_ROOT, "assignments", "homework"),
  weeks: path.join(REPO_ROOT, "course", "weeks"),
  sharedReadings: path.join(REPO_ROOT, "shared", "readings"),
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

function readingDocNameFromLectureSlug(slug) {
  return slug.replace(/^0(\d-)/, "$1");
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
  await ensureDir(path.join(TARGET_ROOTS.readings, "images"));
  await ensureDir(path.join(TARGET_ROOTS.readings, "excalidraw"));

  const sharedFiles = (await fs.readdir(SOURCE_ROOTS.sharedReadings))
    .filter((name) => name.endsWith(".md"))
    .sort();

  for (const file of sharedFiles) {
    await copyFile(path.join(SOURCE_ROOTS.sharedReadings, file), path.join(TARGET_ROOTS.readings, file));
  }

  const lectureDirs = (await fs.readdir(SOURCE_ROOTS.lectures, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const lectureSlug of lectureDirs) {
    const readingRoot = path.join(SOURCE_ROOTS.lectures, lectureSlug, "reading");
    const readingSource = path.join(readingRoot, "index.md");

    try {
      await fs.access(readingSource);
    } catch {
      continue;
    }

    const readingTargetName = `${readingDocNameFromLectureSlug(lectureSlug)}.md`;
    await copyFile(readingSource, path.join(TARGET_ROOTS.readings, readingTargetName));

    const imageSource = path.join(readingRoot, "images");
    const excalidrawSource = path.join(readingRoot, "excalidraw");

    try {
      await fs.access(imageSource);
      await copyDirContents(imageSource, path.join(TARGET_ROOTS.readings, "images"));
    } catch {}

    try {
      await fs.access(excalidrawSource);
      await copyDirContents(excalidrawSource, path.join(TARGET_ROOTS.readings, "excalidraw"));
    } catch {}
  }
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
