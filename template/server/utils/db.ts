import type { DB } from "../db/db";
import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";

const config = useRuntimeConfig();

const isLocalhost =
  config.databaseUrl?.includes("localhost") || config.databaseUrl?.includes("127.0.0.1");

const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: isLocalhost ? undefined : { rejectUnauthorized: false },
});

const dialect = new PostgresDialect({ pool });

export const db = new Kysely<DB>({ dialect });

export function useDatabase() {
  return db;
}

export type Database = DB;
