import { readdirSync, writeFileSync } from "fs";
import { join } from "path";

const migrationsDir = join(process.cwd(), "server/db/migrations");
const files = readdirSync(migrationsDir);
const migrationFile = files.find((f) => f.includes("create_users_table") && f.endsWith(".ts"));

if (!migrationFile) {
  console.error("Could not find create_users_table migration file");
  process.exit(1);
}

const content = `import type { Kysely } from "kysely";
import { sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("users")
    .addColumn("id", "bigint", (col) =>
      col.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn("email", "text", (col) => col.notNull().unique())
    .addColumn("first_name", "text", (col) => col.notNull())
    .addColumn("last_name", "text", (col) => col.notNull())
    .addColumn("deactivated_at", "timestamptz")
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql\`now()\`)
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql\`now()\`)
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("users").execute();
}
`;

writeFileSync(join(migrationsDir, migrationFile), content);
console.log(`Populated migration: ${migrationFile}`);
