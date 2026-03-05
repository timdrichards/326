import path from "node:path";
import express from "express";
import type { EntryRepository } from "./repository/EntryRepository.js";

export function createApp(repo: EntryRepository) {
  const app = express();

  app.set("view engine", "ejs");
  app.set("views", path.join(process.cwd(), "src/views"));
  app.use(express.urlencoded({ extended: true }));

  app.get("/", async (_req, res) => {
    const entries = await repo.list();
    res.render("index", { entries });
  });

  app.post("/entries", async (req, res) => {
    // TODO(HW2): Strengthen validation + return consistent error fragment.
    const title = String(req.body.title ?? "").trim();
    const body = String(req.body.body ?? "").trim();

    if (!title || !body) {
      return res.status(400).render("partials/error", {
        message: "Title and body are required.",
      });
    }

    await repo.create({ title, body });
    const entries = await repo.list();
    return res.render("partials/entryList", { entries });
  });

  app.post("/entries/:id/toggle", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).render("partials/error", { message: "Invalid ID." });
    }

    await repo.toggleComplete(id);
    const entries = await repo.list();
    return res.render("partials/entryList", { entries });
  });

  app.get("/entries/search", async (req, res) => {
    // TODO(HW2): Replace this with repository-backed filtering if you add it.
    const q = String(req.query.q ?? "").trim().toLowerCase();
    const entries = await repo.list();
    const filtered = q
      ? entries.filter((e) =>
          `${e.title} ${e.body}`.toLowerCase().includes(q),
        )
      : entries;

    return res.render("partials/entryList", { entries: filtered });
  });

  return app;
}
