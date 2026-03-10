# Excalidraw Sources

This directory stores the source files for reading diagrams in native `.excalidraw` format.

Recommended ways to open and edit them:

- VS Code with an Excalidraw extension
- Obsidian with the Excalidraw plugin
- <https://excalidraw.com/> by importing the `.excalidraw` file

Typical workflow:

1. Open the `.excalidraw` source file and make your edits.
2. Export the updated diagram as SVG.
3. Save the exported SVG into `../images/` using the matching filename convention already used by the reading.
4. Run `cd /Users/richards/Git/326/website && npm run build` to verify the site still builds.

Notes:

- The website publishes the SVG exports, not the `.excalidraw` source files.
- `website/docusaurus.config.js` excludes `.excalidraw` files from docs processing.
