# Course

This directory is the source-of-truth home for authored course material.

Subdirectories:

- `lectures/`: lecture units with slides and code
- `assignments/`: homework and other assignment material
- `readings/`: the class book / reading chapters and reading assets
- `weeks/`: week overview pages that link lecture slides, readings, and code
- `shared/`: reusable templates and other shared assets

## Markdown linking

When authoring markdown here, assume the file will be published through Docusaurus.

- Prefer published docs links such as `/docs/readings/10-orm`.
- Use relative links only when they will still be correct after sync into `website/docs/`.
- Link to published assets with paths like `/decks/10-orm/` and `/code/hw-02.zip`.
- Do not link to local source paths under `course/`.
