import { defineConfig } from "kysely-ctl";
import { Pool } from "pg";
import { PostgresDialect } from "kysely";

export default defineConfig({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.NUXT_DATABASE_URL,
    }),
  }),
  migrations: {
    migrationFolder: "server/db/migrations",
  },
});
