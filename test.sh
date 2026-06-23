#!/usr/bin/env bash
set -euo pipefail

# Local one-shot meta-test: scaffold a project from HEAD and prove it actually
# works — static checks, typecheck, the scaffolded test suites, AND a real
# production build that boots and serves pages (see bin/smoke.sh). CI runs the
# same checks fanned out in parallel (.github/workflows/meta-test.yml); this is
# the run-it-all-locally-with-one-command version.
#
# Postgres: locally this assumes a trust-auth server reachable as the current
# user (Homebrew default). In CI, PGHOST/PGUSER (+ a trust-auth service) make
# the bare `createdb` / `postgresql://localhost/...` connection string resolve.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
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
  --data auth_provider=microsoft \
  --data include_ci=false \
  --data include_git_hooks=false \
  . "$SCAFFOLD_DIR"

cd "$SCAFFOLD_DIR"
yarn install
yarn lint
yarn fmt:check
yarn typecheck
yarn test:run
yarn test:frontend:run

echo "Building the production bundle..."
yarn build

echo "Smoke-testing the production server..."
bash "$SCRIPT_DIR/bin/smoke.sh"

echo "All tests passed."
