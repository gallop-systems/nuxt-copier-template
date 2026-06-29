import type { DB } from "../db/db";
import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";

const config = useRuntimeConfig();

// Decide SSL by the connection target, not the app environment: a local
// Postgres speaks no SSL, but a managed remote DB (e.g. DigitalOcean) requires
// it even from local dev. `sslmode=disable` in the URL is an explicit opt-out —
// e.g. a CI service container reachable only by hostname (not localhost) that
// speaks no SSL (see the test job in .github/workflows/ci.yml).
const databaseUrl = config.databaseUrl ?? "";
const sslDisabled =
  databaseUrl.includes("localhost") ||
  databaseUrl.includes("127.0.0.1") ||
  databaseUrl.includes("sslmode=disable");

const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: sslDisabled ? undefined : { rejectUnauthorized: false },
});

const dialect = new PostgresDialect({ pool });

export const db = new Kysely<DB>({ dialect });

export function useDatabase() {
  return db;
}

export type Database = DB;
