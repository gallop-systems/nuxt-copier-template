/**
 * Row-level data builders shared by tests AND database seeds.
 *
 * Each builder inserts a single row with sensible defaults and the FK ids the
 * caller threads in — the row-level primitive that higher layers compose:
 *   - tests call it with the per-test `Transaction<DB>` (rolled back after);
 *   - `server/db/seeds/*` call it with the live `Kysely<DB>` (committed).
 *
 * Keep this module vitest-free: seeds import it at runtime via `yarn db:seed`,
 * so it must never pull in test-only deps. (test-utils re-exports it.)
 *
 * Uniqueness rides a process-global monotonic counter (`nextSeq`), not random
 * suffixes — a counter never birthday-collides. Seeds that need a *stable,
 * addressable* row (the anchor login user) must instead upsert on a natural key
 * (see `server/db/seeds/*_core.ts`); the counter is for everything else.
 */

import type { Kysely, Transaction } from "kysely";
import type { DB } from "./db";

/** Either a live connection (seeds) or a test transaction (tests). */
export type DbLike = Kysely<DB> | Transaction<DB>;

let factorySeq = 0;
const nextSeq = (): number => ++factorySeq;

export function createFactories(trx: DbLike) {
  return {
    async user(
      data: Partial<{
        email: string;
        first_name: string;
        last_name: string;
      }> = {},
    ) {
      const num = nextSeq();
      return trx
        .insertInto("users")
        .values({
          email: data.email ?? `test${num}@example.com`,
          first_name: data.first_name ?? "Test",
          last_name: data.last_name ?? "User",
        })
        .returningAll()
        .executeTakeFirstOrThrow();
    },
  };
}

export type Factories = ReturnType<typeof createFactories>;
