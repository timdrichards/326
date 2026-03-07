#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "==> Running website publish pipeline"
echo "    (includes homework zip generation + docusaurus deploy)"
cd "${REPO_ROOT}/website"
npm run publish:site
