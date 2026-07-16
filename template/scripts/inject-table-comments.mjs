#!/usr/bin/env node
// Post-processes the kysely-codegen output, injecting into each
// `export interface <Table>` JSDoc the schema comments kysely-codegen drops:
//   * the TABLE comment (Postgres `obj_description`)
//   * a list of commented INDEXES on that table
//   * a list of commented CONSTRAINTS on that table
//
// kysely-codegen emits COLUMN comments natively but models nothing else
// (kysely core #1368 / kysely-codegen #316, unmerged as of 0.20.0). Indexes and
// constraints have no symbol of their own in the generated types, so their
// comments are surfaced under the table interface they belong to. Runs as the
// second half of `yarn db:codegen`.
//
// Usage: node scripts/inject-table-comments.mjs <db-url> <db.d.ts path>
import { readFileSync, writeFileSync } from "node:fs";
import pg from "pg";

const url = process.env.NUXT_DATABASE_URL ?? process.argv[2];
const outFile = process.argv[3] ?? "server/db/db.d.ts";
if (!url) {
  console.error("inject-table-comments: no database URL (arg or NUXT_DATABASE_URL)");
  process.exit(1);
}

// snake_case table name -> kysely-codegen interface name (PascalCase, not singularized).
const toInterfaceName = (table) =>
  table
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

const client = new pg.Client({ connectionString: url });
await client.connect();

// Table comments (may be null; kept so a table with only index/constraint
// comments still gets a block).
const tables = (
  await client.query(`
    SELECT c.relname AS table_name, obj_description(c.oid) AS comment
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind IN ('r', 'p') AND n.nspname = 'public'
  `)
).rows;

// Commented indexes, grouped by their owning table. A unique CONSTRAINT's
// backing index is not commented here (the comment lives on the constraint),
// so it won't show up twice.
const indexes = (
  await client.query(`
    SELECT t.relname AS table_name, ic.relname AS name, obj_description(ic.oid) AS comment
    FROM pg_index i
    JOIN pg_class ic ON ic.oid = i.indexrelid
    JOIN pg_class t ON t.oid = i.indrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname = 'public' AND obj_description(ic.oid) IS NOT NULL
    ORDER BY ic.relname
  `)
).rows;

// Commented constraints, grouped by their owning table.
const constraints = (
  await client.query(`
    SELECT t.relname AS table_name, con.conname AS name,
           obj_description(con.oid, 'pg_constraint') AS comment
    FROM pg_constraint con
    JOIN pg_class t ON t.oid = con.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname = 'public' AND obj_description(con.oid, 'pg_constraint') IS NOT NULL
    ORDER BY con.conname
  `)
).rows;
await client.end();

const escape = (text) => text.replace(/\*\//g, "*\\/"); // never close the JSDoc early
const oneLine = (text) =>
  escape(text)
    .replace(/\s*\r?\n\s*/g, " ")
    .trim();

const byTable = (rows) => {
  const map = new Map();
  for (const { table_name, name, comment } of rows) {
    if (!map.has(table_name)) map.set(table_name, []);
    map.get(table_name).push(`- ${name} — ${oneLine(comment)}`);
  }
  return map;
};
const indexesByTable = byTable(indexes);
const constraintsByTable = byTable(constraints);

// interface name -> column-0 JSDoc block, matching kysely-codegen's own style.
const jsdocByInterface = new Map();
const allTableNames = new Set([
  ...tables.filter((t) => t.comment).map((t) => t.table_name),
  ...indexesByTable.keys(),
  ...constraintsByTable.keys(),
]);
const commentByTable = new Map(tables.map((t) => [t.table_name, t.comment]));

for (const table of allTableNames) {
  const sections = [];
  const tableComment = commentByTable.get(table);
  if (tableComment) sections.push(escape(tableComment));

  const idx = indexesByTable.get(table);
  if (idx) sections.push(["Indexes:", ...idx].join("\n"));

  const con = constraintsByTable.get(table);
  if (con) sections.push(["Constraints:", ...con].join("\n"));

  const body = sections
    .join("\n\n") // blank line between table comment / Indexes / Constraints
    .split("\n")
    .map((line) => ` * ${line}`.replace(/\s+$/, ""))
    .join("\n");
  jsdocByInterface.set(toInterfaceName(table), `/**\n${body}\n */`);
}

let injected = 0;
// Match each interface decl, optionally swallowing a column-0 JSDoc block that
// already abuts it (one WE injected on a prior run) so re-runs replace rather
// than stack. kysely-codegen only emits JSDoc on indented properties, so a
// column-0 `/** */` right before `export interface` is always ours. The `DB`
// root interface has no matching table and is left untouched.
const src = readFileSync(outFile, "utf8").replace(
  /(^|\n)(?:\/\*\*\n(?: \*.*\n)* \*\/\n)?(export interface (\w+) \{)/g,
  (whole, lead, decl, name) => {
    const doc = jsdocByInterface.get(name);
    if (!doc) return whole;
    injected++;
    return `${lead}${doc}\n${decl}`;
  },
);

writeFileSync(outFile, src);
console.log(`inject-table-comments: injected ${injected}/${allTableNames.size} table block(s)`);
