import type { Response } from "express";
import { IEntryService } from "../service/EntryService.js";
import { ILoggingService } from "../service/LoggingService.js";
import { EntryError } from "../lib/errors.js";

// Controller methods map service Results to HTTP status + rendered output.
export interface IEntryController {
  showEntries(res: Response): Promise<void>;
  createFromForm(res: Response, title: string, body: string, tag: string): Promise<void>;
  toggleFromForm(res: Response, id: number): Promise<void>;
  searchFromHtmx(res: Response, query: string): Promise<void>;
  filterFromHtmx(res: Response, status: string): Promise<void>;
}

class EntryController implements IEntryController {
  constructor(
    private readonly service: IEntryService,
    private readonly logger: ILoggingService,
  ) {}

  private isEntryError(value: unknown): value is EntryError {
    return (
      typeof value === "object" &&
      value !== null &&
      "name" in value &&
      "message" in value
    );
  }

  private mapErrorStatus(error: EntryError): number {
    if (error.name === "EntryNotFound") return 404;
    if (error.name === "InvalidContent" || error.name === "ValidationError") return 400;
    return 500;
  }

  // Shared helper for HTMX responses that only need the list fragment.
  private async renderEntryList(res: Response): Promise<void> {
    const entriesResult = await this.service.listEntries();
    if (!entriesResult.ok) {
      res.status(500).render("entries/partials/error", { message: "Unable to load entries." });
      return;
    }

    res.render("entries/partials/entryList", { entries: entriesResult.value });
  }

  async showEntries(res: Response): Promise<void> {
    this.logger.info("Rendering entries page");
    const entriesResult = await this.service.listEntries();
    if (!entriesResult.ok) {
      const message = this.isEntryError(entriesResult.value)
        ? entriesResult.value.message
        : "Unable to load entries.";
      res.status(500).render("entries/index", { entries: [], pageError: message });
      return;
    }

    res.render("entries/index", { entries: entriesResult.value, pageError: null });
  }

  async createFromForm(res: Response, title: string, body: string, tag: string): Promise<void> {
    this.logger.info("Creating entry from form");
    const result = await this.service.createEntry({ title, body, tag });

    if (!result.ok && this.isEntryError(result.value)) {
      const error = result.value;
      const status = this.mapErrorStatus(error);
      if (status === 400) {
        this.logger.warn(`Create entry rejected: ${error.message}`);
      } else {
        this.logger.error(`Create entry failed: ${error.message}`);
      }
      res.status(status).render("entries/partials/error", { message: error.message });
      return;
    }

    if (!result.ok) {
      res.status(500).render("entries/partials/error", { message: "Unable to create entry." });
      return;
    }

    await this.renderEntryList(res);
  }

  async toggleFromForm(res: Response, id: number): Promise<void> {
    this.logger.info(`Toggling entry ${id}`);
    const result = await this.service.toggleEntry(id);

    if (!result.ok && this.isEntryError(result.value)) {
      res
        .status(this.mapErrorStatus(result.value))
        .render("entries/partials/error", { message: result.value.message });
      return;
    }

    if (!result.ok) {
      res.status(500).render("entries/partials/error", { message: "Unable to toggle entry." });
      return;
    }

    await this.renderEntryList(res);
  }

  async searchFromHtmx(res: Response, query: string): Promise<void> {
    const result = await this.service.searchEntries(query);
    if (!result.ok && this.isEntryError(result.value)) {
      res.status(this.mapErrorStatus(result.value)).render("entries/partials/error", {
        message: result.value.message,
      });
      return;
    }

    if (!result.ok) {
      res.status(500).render("entries/partials/error", { message: "Unable to search entries." });
      return;
    }

    res.render("entries/partials/entryList", { entries: result.value });
  }

  async filterFromHtmx(res: Response, status: string): Promise<void> {
    const result = await this.service.filterEntriesByStatus(status);
    if (!result.ok && this.isEntryError(result.value)) {
      res.status(this.mapErrorStatus(result.value)).render("entries/partials/error", {
        message: result.value.message,
      });
      return;
    }

    if (!result.ok) {
      res.status(500).render("entries/partials/error", { message: "Unable to filter entries." });
      return;
    }

    res.render("entries/partials/entryList", { entries: result.value });
  }
}

export function CreateEntryController(
  service: IEntryService,
  logger: ILoggingService,
): IEntryController {
  return new EntryController(service, logger);
}
