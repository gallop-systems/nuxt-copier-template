#!/usr/bin/env node
/**
 * Guard against hand-authored Kysely migration filenames.
 *
 * Kysely orders migrations by filename and records executed ones in a ledger.
 * If a migration is added whose timestamp sorts BEFORE one that already ran,
 * `kysely migrate:latest` aborts with a corrupted-history error — and the fix
 * on a live database is manual ledger surgery.
 *
 * That happens when someone writes the file by hand and invents the timestamp
 * prefix (typically a round number, often dated slightly in the future) instead
 * of running `yarn db:migrate:make <name>`. A future-dated migration can run
 * *before* the moment its own name claims, opening a window in which a
 * correctly-generated migration sorts behind it.
 *
 * This script only inspects migrations that are NEW in the current change, so
 * existing history is grandfathered and adopting the guard never breaks a repo
 * retroactively.
 *
 * Usage:
 *   node scripts/check-migration-filenames.mjs [files...]   # explicit files (lefthook staged)
 *   node scripts/check-migration-filenames.mjs --base <ref> # files added vs a git ref (CI)
 */

import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import path from "node:path";

const MIGRATIONS_DIR = "server/db/migrations";
/** Kysely's `migrate:make` emits a 13-digit epoch-millisecond prefix. */
const FILENAME_RE = /^(\d{13})_[A-Za-z0-9][A-Za-z0-9._-]*\.ts$/;
/** A generated epoch-ms value is effectively never this round. */
const ROUND_TAIL_ZEROS = 5;

function git(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

function isMigration(file) {
  return file.replaceAll(path.sep, "/").includes(`${MIGRATIONS_DIR}/`) && file.endsWith(".ts");
}

/** Migrations added in this change; everything else is frozen history. */
function resolveCandidates(argv) {
  const baseIdx = argv.indexOf("--base");
  if (baseIdx !== -1) {
    const base = argv[baseIdx + 1] ?? "origin/main";
    const merge = git(["merge-base", base, "HEAD"]) || base;
    const out = git(["diff", "--name-only", "--diff-filter=A", merge, "HEAD", "--", MIGRATIONS_DIR]);
    return out ? out.split("\n").filter(isMigration) : [];
  }
  return argv.filter((a) => !a.startsWith("--")).filter(isMigration);
}

const candidates = resolveCandidates(process.argv.slice(2));
if (candidates.length === 0) process.exit(0);

let existing = [];
try {
  existing = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".ts"));
} catch {
  /* directory may not exist yet */
}

const candidateNames = new Set(candidates.map((f) => path.basename(f)));
const priorTimestamps = existing
  .filter((f) => !candidateNames.has(f))
  .map((f) => ({ file: f, ts: Number(f.match(FILENAME_RE)?.[1] ?? 0) }))
  .filter((e) => e.ts > 0);
const highestPrior = priorTimestamps.reduce(
  (max, e) => (e.ts > max.ts ? e : max),
  { file: null, ts: 0 },
);

const now = Date.now();
const errors = [];

for (const file of candidates) {
  const name = path.basename(file);
  const match = name.match(FILENAME_RE);

  if (!match) {
    errors.push(
      `${name}\n    Filename does not match <13-digit-epoch-ms>_<name>.ts.\n` +
        `    Create it with: yarn db:migrate:make <descriptive_name>`,
    );
    continue;
  }

  const ts = Number(match[1]);

  if (ts > now) {
    const aheadMin = Math.round((ts - now) / 60000);
    errors.push(
      `${name}\n    Timestamp is ${aheadMin} minute(s) in the FUTURE (${new Date(ts).toISOString()}).\n` +
        `    A future-dated migration can execute before the time its name claims, so a\n` +
        `    later, correctly-generated migration would sort behind it and corrupt history.`,
    );
  }

  if (new RegExp(`0{${ROUND_TAIL_ZEROS},}$`).test(match[1])) {
    errors.push(
      `${name}\n    Timestamp ends in ${ROUND_TAIL_ZEROS}+ zeros, so it was almost certainly hand-written.\n` +
        `    Use: yarn db:migrate:make <descriptive_name>`,
    );
  }

  if (highestPrior.file && ts <= highestPrior.ts) {
    errors.push(
      `${name}\n    Sorts at or before an existing migration (${highestPrior.file}).\n` +
        `    Kysely would refuse to migrate: a new migration must sort after every existing one.`,
    );
  }
}

const seen = new Map();
for (const file of candidates) {
  const ts = path.basename(file).match(FILENAME_RE)?.[1];
  if (!ts) continue;
  if (seen.has(ts)) errors.push(`${path.basename(file)}\n    Duplicate timestamp with ${seen.get(ts)}.`);
  else seen.set(ts, path.basename(file));
}

if (errors.length > 0) {
  console.error(`\n✗ Invalid migration filename(s):\n\n  ${errors.join("\n\n  ")}\n`);
  console.error("  Never hand-author the timestamp prefix — always scaffold with db:migrate:make.\n");
  process.exit(1);
}
