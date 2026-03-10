#!/usr/bin/env node

import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

const WEBSITE_ROOT = process.cwd();
const REPO_ROOT = path.resolve(WEBSITE_ROOT, "..");
const LECTURES_ROOT = path.join(REPO_ROOT, "course", "lectures");
const OUTPUT_ROOT = path.join(WEBSITE_ROOT, "static", "code");

const EXCLUDED_DIRS = new Set(["node_modules", "dist", "build"]);
const EXCLUDED_PATH_SEGMENTS = [["prisma", "migrations"]];

function isExcludedFile(name) {
  if (name === ".env") return true;
  return name.endsWith(".db");
}

async function exists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

function hasExcludedPathPrefix(relativePath) {
  const segments = path.normalize(relativePath).split(path.sep).filter(Boolean);
  return EXCLUDED_PATH_SEGMENTS.some((excludedSegments) =>
    excludedSegments.every((segment, index) => segments[index] === segment),
  );
}

async function copyFiltered(rootDir, sourceDir, targetDir) {
  await fs.mkdir(targetDir, { recursive: true });
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      const relativeSourcePath = path.relative(rootDir, sourcePath);
      if (hasExcludedPathPrefix(relativeSourcePath)) continue;
      await copyFiltered(rootDir, sourcePath, targetPath);
      continue;
    }

    if (entry.isFile()) {
      if (isExcludedFile(entry.name)) continue;
      await fs.copyFile(sourcePath, targetPath);
    }
  }
}

function runZip(cwd, zipFileName, folderName) {
  return new Promise((resolve, reject) => {
    const child = spawn("zip", ["-rq", zipFileName, folderName], {
      cwd,
      stdio: "pipe",
    });

    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(stderr || `zip exited with code ${code}`));
    });
  });
}

async function zipLectureCode(lectureSlug) {
  const sourceDir = path.join(LECTURES_ROOT, lectureSlug, "code");
  if (!(await exists(sourceDir))) return false;

  await fs.mkdir(OUTPUT_ROOT, { recursive: true });

  const zipName = `${lectureSlug}.zip`;
  const outputZipPath = path.join(OUTPUT_ROOT, zipName);
  const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), `zip-${lectureSlug}-`));
  const stagingDir = path.join(tmpRoot, lectureSlug);

  try {
    await copyFiltered(sourceDir, sourceDir, stagingDir);
    await fs.rm(outputZipPath, { force: true });
    await runZip(tmpRoot, outputZipPath, lectureSlug);
    console.log(`[zip-lecture-code] built static/code/${zipName}`);
    return true;
  } finally {
    await fs.rm(tmpRoot, { recursive: true, force: true });
  }
}

const lectureDirs = (await fs.readdir(LECTURES_ROOT, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

let count = 0;
for (const lectureSlug of lectureDirs) {
  const zipped = await zipLectureCode(lectureSlug);
  if (zipped) count += 1;
}

console.log(`[zip-lecture-code] done (${count} lecture zip${count === 1 ? "" : "s"})`);
