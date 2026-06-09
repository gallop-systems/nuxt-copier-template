/**
 * Core seed — the minimum a preview/dev box needs to log in: the anchor login
 * user. As your schema grows, add separate "scene" seeds (one file per slice of
 * state) alongside this one; keep this file focused on the login anchor.
 *
 * Seeds are **order-independent and idempotent** by contract: `kysely-ctl` runs
 * every file in `readdir` order (it does NOT sort) on each `seed:run`, with no
 * migration-style ledger — so a seed must not depend on another having run, and
 * re-running must not throw or duplicate. The anchor user is addressed by a
 * deterministic natural key (`email`) and upserted. This is the carve-out from
 * the `nextSeq()` counter in factories.ts — a row that must be *stable and
 * addressable* upserts on a natural key instead of riding the counter.
 */

import type { DbLike } from "../factories";
import { PREVIEW_ANCHOR_USER as ANCHOR_USER } from "../../utils/preview";

// The known preview/dev login — single source of truth in server/utils/preview.ts
// (shared with the preview-login backdoor). It's a pure const module, so importing
// it here is safe in the bare `kysely seed:run` context. A preview box logs in
// *as* this user.

export async function seed(db: DbLike): Promise<void> {
  // The anchor user is a row the seed *exclusively owns* — safe to upsert-update
  // so its identity is always the known value.
  await db
    .insertInto("users")
    .values(ANCHOR_USER)
    .onConflict((oc) =>
      oc.column("email").doUpdateSet({
        first_name: ANCHOR_USER.first_name,
        last_name: ANCHOR_USER.last_name,
      }),
    )
    .execute();
}
