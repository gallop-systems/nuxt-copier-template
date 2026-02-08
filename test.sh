#!/usr/bin/env bash
set -euo pipefail

DB_NAME="gallop_tpl_test"
SCAFFOLD_DIR=$(mktemp -d)

cleanup() {
  dropdb --if-exists "$DB_NAME"
  dropdb --if-exists "${DB_NAME}-test"
  rm -rf "$SCAFFOLD_DIR"
}
trap cleanup EXIT

uvx copier copy --trust --defaults --vcs-ref HEAD \
  --data project_name="gallop-tpl-test" \
  --data project_description="Template test scaffold" \
  --data database_name="$DB_NAME" \
  --data include_google_oauth=false \
  --data include_ci=false \
  --data include_git_hooks=false \
  --data include_template_update_checker=false \
  . "$SCAFFOLD_DIR"

cd "$SCAFFOLD_DIR"
yarn install
yarn lint
yarn fmt:check
yarn test:run
yarn test:frontend:run

echo "All tests passed."
