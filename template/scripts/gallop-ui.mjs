#!/usr/bin/env node
// gallop-ui, the shared UI layer, lives at layers/gallop-ui as a git subtree of
// github.com/gallop-systems/gallop-ui. This script is the one place that knows
// the prefix and the remote. Run it through the package.json scripts:
//
//   yarn ui:add [vX.Y.Z]      add the layer (default: the latest release)
//   yarn ui:pull [vX.Y.Z]     take a newer release (default: the latest)
//   yarn ui:push <branch>     send commits made to layers/gallop-ui back, as a
//                             branch of gallop-ui to open a PR from
//   yarn ui:impact [options]  before ui:push: what an edit to layers/gallop-ui does to
//                             every app on this machine (call sites, types,
//                             before/after screenshots); the layer's docs/playground.md
//   yarn ui:version           the version this app has
//   yarn ui:test              run the layer's own tests
//   yarn ui:check [--staged]  the guards lefthook runs: no app component named
//                             like a layer component; with --staged, no commit
//                             mixing layer and app files
//
// GALLOP_UI_REMOTE overrides the remote (e.g. an https URL with a token in CI).
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const PREFIX = "layers/gallop-ui";
const REMOTE = process.env.GALLOP_UI_REMOTE ?? "git@github.com:gallop-systems/gallop-ui.git";
const root = process.cwd();
const layer = join(root, PREFIX);

const [command, ...args] = process.argv.slice(2);

function git(...a) {
  return execFileSync("git", a, { encoding: "utf8" }).trim();
}
function run(cmd, a) {
  const r = spawnSync(cmd, a, { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
function fail(message) {
  console.error(message);
  process.exit(1);
}

/** The highest vX.Y.Z tag on the remote. */
function latest() {
  const tags = git("ls-remote", "--tags", "--refs", REMOTE)
    .split("\n")
    .map((l) => l.split("refs/tags/")[1])
    .filter((t) => /^v\d+\.\d+\.\d+$/.test(t ?? ""));
  const key = (t) => t.slice(1).split(".").map(Number);
  tags.sort((a, b) => {
    const [x, y] = [key(a), key(b)];
    return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
  });
  if (!tags.length) fail(`No vX.Y.Z tags on ${REMOTE}.`);
  return tags.at(-1);
}

function version() {
  if (!existsSync(layer)) return null;
  // v0.1.0 predates the version field.
  return JSON.parse(readFileSync(join(layer, "package.json"), "utf8")).version ?? "0.1.0";
}

function requireClean() {
  if (git("status", "--porcelain"))
    fail("Commit or stash your changes first: git subtree needs a clean tree.");
}

/** Nuxt's component name for a file under a components dir (pathPrefix on). */
function nuxtName(path) {
  const pascal = (s) =>
    s
      .split(/[-_.]/)
      .filter(Boolean)
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join("");
  const parts = path
    .replace(/\.vue$/, "")
    .split("/")
    .map(pascal);
  const file = parts.pop();
  const prefix = parts.join("");
  return file.startsWith(prefix) ? file : prefix + file;
}

function vueFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith(".vue"))
    .map((e) => relative(dir, join(e.parentPath, e.name)));
}

function check(staged) {
  const problems = [];

  if (staged) {
    const files = git("diff", "--cached", "--name-only").split("\n").filter(Boolean);
    const inLayer = files.filter((f) => f.startsWith(`${PREFIX}/`));
    if (inLayer.length && inLayer.length !== files.length) {
      problems.push(
        `This commit mixes ${PREFIX} with app files. Commit the layer change on its own ` +
          `(it goes back to gallop-ui with \`yarn ui:push\`), then the app change.`,
      );
    }
  }

  if (existsSync(layer)) {
    const shared = new Set(
      readdirSync(join(layer, "components"), { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name),
    );
    for (const file of vueFiles(join(root, "app/components"))) {
      const name = nuxtName(file);
      if (shared.has(name)) {
        problems.push(
          `app/components/${file} registers as <${name}>, which gallop-ui already has. ` +
            `Use the layer's (restyle it with pt) and delete the app's copy.`,
        );
      }
    }
  }

  if (problems.length) fail(`gallop-ui check failed:\n- ${problems.join("\n- ")}`);
}

switch (command) {
  case "add": {
    if (existsSync(layer))
      fail(`${PREFIX} already exists (version ${version()}). Use \`yarn ui:pull\`.`);
    requireClean();
    const v = args[0] ?? latest();
    run("git", [
      "subtree",
      "add",
      `--prefix=${PREFIX}`,
      REMOTE,
      v,
      "--squash",
      "-m",
      `chore(gallop-ui): add ${v}`,
    ]);
    console.log(
      `\nAdded gallop-ui ${v}. Next: yarn add reka-ui@^2.10.5 (if missing), then read ${PREFIX}/README.md.`,
    );
    break;
  }
  case "pull": {
    if (!existsSync(layer)) fail(`No ${PREFIX} yet. Use \`yarn ui:add\`.`);
    requireClean();
    const v = args[0] ?? latest();
    console.log(
      `Updating gallop-ui ${version()} → ${v}. Read its CHANGELOG.md for breaking changes.`,
    );
    run("git", [
      "subtree",
      "pull",
      `--prefix=${PREFIX}`,
      REMOTE,
      v,
      "--squash",
      "-m",
      `chore(gallop-ui): pull ${v}`,
    ]);
    break;
  }
  case "push": {
    const branch = args[0];
    if (!branch) fail("Usage: yarn ui:push <branch-name-for-gallop-ui>");
    run("git", ["subtree", "push", `--prefix=${PREFIX}`, REMOTE, branch]);
    console.log(`\nPushed. Open a PR in gallop-systems/gallop-ui from ${branch}.`);
    break;
  }
  case "impact": {
    const script = join(layer, "scripts", "impact.mjs");
    if (!existsSync(script))
      fail(
        `This app's ${PREFIX} (version ${version()}) has no ui:impact yet. Take a newer one with \`yarn ui:pull\`.`,
      );
    run("node", [script, ...args]);
    break;
  }
  case "version":
    console.log(version() ?? `No ${PREFIX} in this app.`);
    break;
  case "test":
    if (!existsSync(layer)) break;
    run("yarn", ["vitest", "run", "--root", PREFIX]);
    break;
  case "check":
    check(args.includes("--staged"));
    break;
  default:
    // The comment block at the top of this file is the help.
    console.log(
      readFileSync(new URL(import.meta.url), "utf8")
        .split("\n")
        .slice(1)
        .filter((l, i, all) => all.slice(0, i + 1).every((x) => x.startsWith("//")))
        .map((l) => l.replace(/^\/\/ ?/, ""))
        .join("\n"),
    );
    process.exit(command ? 1 : 0);
}
