# Appendix B Code Reference

This appendix provides short, beginner-friendly explanations of external calls and abstractions used in course readings.

## 6.9 Persistence

### JSON.stringify
- **Call/abstraction:** `JSON.stringify(value)`
- **What it means:** Converts a JavaScript value (object/array/etc.) into a text string in JSON format so you can store or send it.
- **Short example:** `const text = JSON.stringify({ count: 3 });`
- **Docs:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify

### JSON.parse
- **Call/abstraction:** `JSON.parse(text)`
- **What it means:** Converts JSON text back into a JavaScript value.
- **Short example:** `const data = JSON.parse('{"count":3}');`
- **Docs:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse

### fs.writeFile
- **Call/abstraction:** `fs.writeFile(path, data, encoding)`
- **What it means:** Writes data to a file. If the file already exists, this call replaces its contents.
- **Short example:** `await fs.writeFile("./data.json", "{}", "utf8");`
- **Docs:** https://nodejs.org/api/fs.html#fspromiseswritefilefile-data-options

### fs.readFile
- **Call/abstraction:** `fs.readFile(path, encoding)`
- **What it means:** Reads a file and returns its contents.
- **Short example:** `const raw = await fs.readFile("./data.json", "utf8");`
- **Docs:** https://nodejs.org/api/fs.html#fspromisesreadfilepath-options

### fs.rename
- **Call/abstraction:** `fs.rename(oldPath, newPath)`
- **What it means:** Renames or moves a file path. In this lecture, it is used to swap a completed temp file into place.
- **Short example:** `await fs.rename("./data.json.tmp", "./data.json");`
- **Docs:** https://nodejs.org/api/fs.html#fspromisesrenameoldpath-newpath

### randomUUID
- **Call/abstraction:** `randomUUID()`
- **What it means:** Generates a unique ID string. Useful for giving each stored record its own identifier.
- **Short example:** `const id = randomUUID();`
- **Docs:** https://nodejs.org/api/crypto.html#cryptorandomuuidoptions

### Promise
- **Call/abstraction:** `Promise<T>` (for example `Promise<void>`)
- **What it means:** A Promise represents work that finishes later. `T` is the type of value you eventually get when it succeeds.
- **Short example:** `async function save(): Promise<void> { /* side effects only */ }`
- **Docs:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

### Promise.all
- **Call/abstraction:** `Promise.all([...])`
- **What it means:** Starts multiple async operations and waits for all of them to finish.
- **Short example:** `await Promise.all([taskA(), taskB()]);`
- **Docs:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all

### setTimeout
- **Call/abstraction:** `setTimeout(callback, ms)`
- **What it means:** Runs a callback after a delay. Useful for simulating timing/interleaving in demos.
- **Short example:** `setTimeout(() => console.log("later"), 10);`
- **Docs:** https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout

### Map
- **Call/abstraction:** `new Map()`
- **What it means:** A key-value data structure for in-memory storage.
- **Short example:** `const entries = new Map<string, string>();`
- **Docs:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map

### express.Router
- **Call/abstraction:** `express.Router()`
- **What it means:** Creates a mini route container so related endpoints can be grouped together.
- **Short example:** `const router = express.Router();`
- **Docs:** https://expressjs.com/en/guide/routing.html

### res.render
- **Call/abstraction:** `res.render(view, data)`
- **What it means:** Renders a server template into HTML and sends it as the response.
- **Short example:** `res.render("entries/index", { entries });`
- **Docs:** https://expressjs.com/en/api.html#res.render

### tsx
- **Call/abstraction:** `npx tsx file.ts`
- **What it means:** Runs TypeScript files directly without manually compiling first.
- **Short example:** `npx tsx demo.ts`
- **Docs:** https://github.com/privatenumber/tsx
