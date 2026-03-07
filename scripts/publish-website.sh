#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${REPO_ROOT}"

echo "==> Building website (includes homework zip generation)"
(
  cd "${REPO_ROOT}/website"
  npm run build
)

echo "==> Staging repository changes"
git add -A

if git diff --cached --quiet; then
  echo "No staged changes to commit."
else
  timestamp="$(date -u +"%Y-%m-%d %H:%M:%SZ")"
  commit_message="chore(publish): website refresh (${timestamp})"
  git commit -m "${commit_message}"
fi

echo "==> Pushing main to origin"
git push origin main

echo
read -r -p "Create and push a publish tag? [y/N]: " do_tag
if [[ ! "${do_tag}" =~ ^[Yy]$ ]]; then
  echo "Publish complete (no tag created)."
  exit 0
fi

default_tag="website-publish-$(date -u +%Y%m%d-%H%M%S)"
read -r -p "Tag name [${default_tag}]: " tag_name
tag_name="${tag_name:-${default_tag}}"

git tag "${tag_name}"
git push origin "${tag_name}"

echo "Publish complete with tag ${tag_name}."
