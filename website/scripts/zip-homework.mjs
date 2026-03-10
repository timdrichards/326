#!/usr/bin/env node

import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

const ROOT = process.cwd();
const REPO_ROOT = path.resolve(ROOT, "..");
const HOMEWORK_ROOT = path.join(REPO_ROOT, "course", "assignments", "homework");
const OUTPUT_ROOT = path.join(ROOT, "static", "code");

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
  return EXCLUDED_PATH_SEGMENTS.some(excludedSegments =>
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
    child.stderr.on("data", chunk => {
      stderr += String(chunk);
    });

    child.on("close", code => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(stderr || `zip exited with code ${code}`));
    });
  });
}

function formatHomeworkNumber(homeworkDirName) {
  const match = homeworkDirName.match(/^(\d{1,2})$/);
  if (!match) return null;
  return match[1].padStart(2, "0");
}

async function zipSingleHomework(homeworkDirName) {
  const hwNumber = formatHomeworkNumber(homeworkDirName);
  if (!hwNumber) return false;

  const studentDir = path.join(HOMEWORK_ROOT, homeworkDirName, "student");
  if (!(await exists(studentDir))) return false;

  await fs.mkdir(OUTPUT_ROOT, { recursive: true });

  const folderName = `hw-${hwNumber}`;
  const zipName = `${folderName}.zip`;
  const outputZipPath = path.join(OUTPUT_ROOT, zipName);

  const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), `zip-${folderName}-`));
  const stagingDir = path.join(tmpRoot, folderName);

  try {
    await copyFiltered(studentDir, studentDir, stagingDir);
    await fs.rm(outputZipPath, { force: true });
    await runZip(tmpRoot, outputZipPath, folderName);
    const relPath = path.relative(ROOT, outputZipPath);
    console.log(`[zip-homework] built ${relPath}`);
    return true;
  } finally {
    await fs.rm(tmpRoot, { recursive: true, force: true });
  }
}

async function zipAllHomework() {
  const entries = await fs.readdir(HOMEWORK_ROOT, { withFileTypes: true });
  let count = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const zipped = await zipSingleHomework(entry.name);
    if (zipped) count += 1;
  }

  console.log(`[zip-homework] done (${count} homework zip${count === 1 ? "" : "s"})`);
}

async function startWatchMode() {
  const chokidar = await import("chokidar");
  const pending = new Set();
  let timer = null;

  const scheduleFlush = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(async () => {
      const targets = [...pending];
      pending.clear();

      for (const hwDirName of targets) {
        try {
          const zipped = await zipSingleHomework(hwDirName);
          if (!zipped) {
            console.log(`[zip-homework] skipped ${hwDirName} (no student folder)`);
          }
        } catch (error) {
          console.error(`[zip-homework] failed for ${hwDirName}:`, error);
        }
      }
    }, 300);
  };

  const watcher = chokidar.watch(HOMEWORK_ROOT, {
    ignoreInitial: true,
    ignored: [
      /node_modules/,
      /[\\/]dist[\\/]/,
      /[\\/]build[\\/]/,
      /[\\/]prisma[\\/]migrations([\\/]|$)/,
      /\.db$/,
      /[\\/]\.env$/,
    ],
  });

  watcher.on("all", (_eventName, filePath) => {
    const relative = path.relative(HOMEWORK_ROOT, filePath);
    if (!relative || relative.startsWith("..")) return;
    const [hwDirName] = relative.split(path.sep);
    if (!hwDirName) return;
    console.log(`[zip-homework] detected change: ${_eventName} ${relative}`);
    pending.add(hwDirName);
    scheduleFlush();
  });

  await zipAllHomework();
  console.log("[zip-homework] watching course/assignments/homework for changes...");
}

const isWatchMode = process.argv.includes("--watch");

if (isWatchMode) {
  await startWatchMode();
} else {
  await zipAllHomework();
}
