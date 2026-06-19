#!/usr/bin/env bash
# Boot the built production server in the CURRENT directory and smoke-test it.
#
# Assumes `yarn build` already produced `.output/` here. typecheck and tests
# never exercise the real production server, so this catches failures that only
# surface there — a dep that resolves in dev but not under the built ESM loader,
# or a page that 500s on SSR. Shared by test.sh (local) and the meta-test CI.
#
# Exits non-zero on any failure; prints the server log for diagnosis.
set -euo pipefail

PORT="${PORT:-3000}"
SERVER_PID=""
trap '[ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null || true' EXIT

# `node .output` does not auto-load .env; export it if present. nuxt-auth-utils
# refuses a short session password and the scaffold leaves it blank, so inject a
# throwaway 32+ char one for the smoke.
set -a
# shellcheck disable=SC1091
[ -f .env ] && . ./.env
set +a
PW="${NUXT_SESSION_PASSWORD:-}"
if [ "${#PW}" -lt 32 ]; then
  export NUXT_SESSION_PASSWORD="template-meta-test-session-password-0123456789"
fi
export PORT NITRO_PORT="$PORT"

node .output/server/index.mjs > server.log 2>&1 &
SERVER_PID=$!

booted=false
for _ in $(seq 1 30); do
  if grep -q "Listening on" server.log; then booted=true; break; fi
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    echo "✗ production server crashed on boot:"; cat server.log; exit 1
  fi
  sleep 1
done
if [ "$booted" != true ]; then
  echo "✗ production server did not boot within 30s:"; cat server.log; exit 1
fi
echo "✓ production server booted"

# The public login page must SSR-render with its real content.
code=$(curl -sS -o /tmp/meta-login.html -w '%{http_code}' "http://localhost:$PORT/login" || true)
if [ "$code" != "200" ]; then
  echo "✗ GET /login returned $code"; cat server.log; exit 1
fi
if ! grep -q "Sign in to continue" /tmp/meta-login.html; then
  echo "✗ /login did not render expected content:"; head -c 2000 /tmp/meta-login.html; exit 1
fi
echo "✓ /login rendered (200, expected content)"

# The auth-gated root must SSR without a server error. Unauthenticated it
# redirects to /login, so any <500 status proves it served without crashing.
code=$(curl -sS -o /dev/null -w '%{http_code}' "http://localhost:$PORT/" || true)
if [ -z "$code" ] || [ "$code" -ge 500 ]; then
  echo "✗ GET / returned '$code' (server error)"; cat server.log; exit 1
fi
echo "✓ / served without error ($code)"

# Fail on server-side errors logged while serving the smoke requests.
if grep -iE '\[(nuxt|nitro)\] error|unhandledrejection|statuscode: 500|is not a function|cannot find (module|package)' server.log; then
  echo "✗ error-level output in the server log during the smoke"; exit 1
fi
echo "✓ no server errors during smoke"
