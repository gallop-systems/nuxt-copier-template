/**
 * Seed validity harness — the guarantee that seeders never fall out of date.
 *
 * `yarn db:codegen` + `yarn typecheck` already catch *shape* drift (a seed
 * referencing a renamed/dropped column). This harness catches what typecheck
 * can't see at runtime:
 *   1. **Constraint drift** — a migration adds a NOT NULL column with no
 *      default, a new CHECK, a new UNIQUE; every seed inserting that table now
 *      throws. Type-valid, runtime-broken.
 *   2. **Idempotency** — running the full seed set twice must not throw (no
 *      hardcoded unique value, every conflict handled). Previews/dev boxes
 *      re-seed, so this is the contract, not an optimization.
 *
 * It runs every seed in `server/db/seeds/` (auto-discovered — a newly-added
 * broken seed is caught for free) against the freshly-migrated test schema,
 * inside the per-test transaction (rolled back, so the shared test DB stays
 * clean). The test DB is migrated from scratch by global-setup, so "runs clean
 * here" == "runs clean against the latest migration".
 */

import { test, expect } from "~/server/test-utils";
import { PREVIEW_ANCHOR_USER } from "~/server/utils/preview";
import type { DbLike } from "./factories";

interface SeedModule {
  seed: (db: DbLike) => Promise<void>;
}

// Vite/Vitest discovers seed files at build time — no fs walking, and a new
// `server/db/seeds/*.ts` is picked up automatically.
const seedModules = import.meta.glob<SeedModule>("./seeds/*.ts");

// Sorted only for a deterministic test run — production order is NOT this:
// `kysely seed:run` runs files in `readdir` order with no sort, so seeds are
// written to be order-independent (see the contract in any seed's docstring).
const seedPaths = Object.keys(seedModules).sort();

test("every seed runs clean against the latest migration", async ({ db }) => {
  expect(seedPaths.length).toBeGreaterThan(0);

  for (const path of seedPaths) {
    const mod = await seedModules[path]();
    try {
      await mod.seed(db);
    } catch (err) {
      throw new Error(`seed ${path} failed against the current schema: ${String(err)}`);
    }
  }

  // Concrete success signal: the anchor login user the whole preview/dev story
  // depends on actually landed.
  const anchor = await db
    .selectFrom("users")
    .select("email")
    .where("email", "=", PREVIEW_ANCHOR_USER.email)
    .executeTakeFirst();
  expect(anchor?.email).toBe(PREVIEW_ANCHOR_USER.email);
});

test("the full seed set is idempotent (running twice does not throw)", async ({ db }) => {
  for (let pass = 1; pass <= 2; pass++) {
    for (const path of seedPaths) {
      const mod = await seedModules[path]();
      try {
        await mod.seed(db);
      } catch (err) {
        throw new Error(
          `seed ${path} is not idempotent — threw on pass ${pass}: ${String(err)}. ` +
            `A seed must handle re-runs (upsert on a natural key, or onConflict doNothing).`,
        );
      }
    }
  }

  // The anchor user is upserted, not duplicated, across re-runs.
  const anchors = await db
    .selectFrom("users")
    .select("email")
    .where("email", "=", PREVIEW_ANCHOR_USER.email)
    .execute();
  expect(anchors).toHaveLength(1);
});
