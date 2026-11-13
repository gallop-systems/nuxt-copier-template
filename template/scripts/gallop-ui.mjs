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
//   yarn ui:migrate [options] after a breaking ui:pull: rewrite app/ for it and write a
//                             checklist (--dry shows the diff first); the layer's
//                             docs/upgrading.md
//   yarn ui:tokens [css]      check a theme CSS file (default app/assets/css/main.css) against the
//                             layer's token contract: what it is missing, what it still names the old way
//   yarn ui:probe --url <app> look for UI bugs screenshots miss (fields that differ, clipped rings, menus that
//                             don't close, colours that flash mid-transition) on a running app; the layer's
//                             docs/probe.md
//   yarn ui:version           the version this app has
//   yarn ui:test              run the layer's own tests
//   yarn ui:check [--staged|--pushed]
//                             the guards lefthook and CI run: no app component named like a
//                             layer component; with --staged (pre-commit), no commit mixing
//                             layer and app files; with --pushed (pre-push), every edit to
//                             layers/gallop-ui is on a gallop-ui branch (sent with ui:push);
//                             plain (CI), a warning listing layer edits not yet in a release
//
// An edit to layers/gallop-ui is fine, as long as it goes back: commit it on its own, then
// `yarn ui:push <branch>` and open the PR in gallop-ui before (or with) the app's PR. An
// edit that is never pushed is lost on the next ui:pull and drifts the app from its release,
// so lefthook's pre-push refuses to push the app while one is outstanding.
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
    fail(
      "Commit your changes first (or move them to a branch or worktree): git subtree needs a clean tree.",
    );
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

/** The newest `git subtree` squash commit: its tree is exactly the release last pulled. */
function releaseCommit() {
  return git("log", "--grep", `^git-subtree-dir: ${PREFIX}$`, "-1", "--format=%H");
}

const layerInHead = () =>
  spawnSync("git", ["rev-parse", "-q", "--verify", `HEAD:${PREFIX}`]).status === 0;

/** Files where layers/gallop-ui differs from the release last pulled, or null if that can't be told. */
function layerEdits() {
  const squash = releaseCommit();
  if (!squash) return null;
  // Not committed yet (a fresh ui:add, or a layer put back and not yet committed): nothing to compare.
  if (!layerInHead()) return [];
  if (git("rev-parse", `${squash}^{tree}`) === git("rev-parse", `HEAD:${PREFIX}`)) return [];
  return git("diff", "--name-only", squash, `HEAD:${PREFIX}`).split("\n").filter(Boolean);
}

const list = (files) => `${files.slice(0, 5).join(", ")}${files.length > 5 ? ", …" : ""}`;

/**
 * The edited layer files that no gallop-ui branch has as they are here, or null if gallop-ui can't be reached.
 * `ui:push` puts every edited file on a branch byte for byte; a file counts as sent back when any branch tip
 * holds the same content at the same path (or, for a deleted file, lacks it). Checking file by file, not the
 * whole tree, keeps an edit counted as pushed after a later `ui:pull` merges a release around it.
 */
function unpushed(edits) {
  // The branch tips' commits and trees, no file contents: enough to compare blob ids, cheap to fetch.
  const r = spawnSync(
    "git",
    [
      "fetch",
      "-q",
      "--no-tags",
      "--depth=1",
      "--filter=blob:none",
      REMOTE,
      "+refs/heads/*:refs/gallop-ui-check/*",
    ],
    { stdio: ["ignore", "ignore", "inherit"] },
  );
  if (r.status !== 0) return null;
  const tips = git("for-each-ref", "--format=%(refname)", "refs/gallop-ui-check/")
    .split("\n")
    .filter(Boolean);
  const blob = (rev, path) => {
    const b = spawnSync("git", ["rev-parse", "-q", "--verify", `${rev}:${path}`], {
      encoding: "utf8",
    });
    return b.status === 0 ? b.stdout.trim() : null;
  };
  return edits.filter((path) => {
    const here = blob("HEAD", `${PREFIX}/${path}`);
    return !tips.some((tip) => blob(tip, path) === here);
  });
}

function check(mode) {
  const staged = mode === "staged";
  const problems = [];

  if (staged) {
    // --no-renames: a file moved out of the layer counts as a layer change (its old path), not only an app one.
    const files = git("diff", "--cached", "--name-only", "--no-renames")
      .split("\n")
      .filter(Boolean);
    const inLayer = files.filter((f) => f.startsWith(`${PREFIX}/`));
    if (inLayer.length && inLayer.length !== files.length) {
      problems.push(
        `This commit mixes ${PREFIX} with app files. Commit the layer change on its own ` +
          `(it goes back to gallop-ui with \`yarn ui:push\`), then the app change.`,
      );
    }
  } else if (!existsSync(layer) && !layerInHead() && releaseCommit()) {
    problems.push(
      `${PREFIX} is gone, but this app pulled a gallop-ui release before. Put back that release ` +
        `with \`git read-tree --prefix=${PREFIX}/ -u ${releaseCommit().slice(0, 12)}\` rather than deleting the layer.`,
    );
  } else if (existsSync(layer)) {
    const edits = layerEdits();
    if (edits === null) {
      console.warn(
        `gallop-ui check: no \`git subtree\` squash commit in the history (a shallow clone?), so ${PREFIX} ` +
          `couldn't be compared with its release. Fetch the full history (fetch-depth: 0 in CI).`,
      );
    } else if (edits.length && mode === "pushed") {
      const missing = unpushed(edits);
      if (missing === null) {
        console.warn(
          `gallop-ui check: couldn't reach ${REMOTE} to see whether the layer edits were pushed.`,
        );
      } else if (missing.length) {
        problems.push(
          `${PREFIX} has edits that aren't on any gallop-ui branch (${missing.length} file(s): ${list(missing)}). ` +
            `Send them back first: \`yarn ui:push <branch>\`, then open the PR in gallop-systems/gallop-ui. ` +
            `(If that PR is already merged and released, \`yarn ui:pull\` instead.) An edit that isn't pushed ` +
            `is lost on the next ui:pull.`,
        );
      }
    } else if (edits.length) {
      // CI can't reach the private gallop-ui repo, so here it is a reminder, not a failure.
      const msg =
        `${PREFIX} differs from the release it was pulled at (${edits.length} file(s): ${list(edits)}). ` +
        `Make sure it's been sent back with \`yarn ui:push <branch>\` and has a PR in gallop-systems/gallop-ui.`;
      console.warn(
        process.env.GITHUB_ACTIONS
          ? `::warning title=gallop-ui layer edits::${msg}`
          : `gallop-ui check: ${msg}`,
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
    console.log(
      `\nPushed. Open the PR now (a Conventional Commit title, client-neutral):\n` +
        `  https://github.com/gallop-systems/gallop-ui/compare/${branch}?expand=1\n` +
        `Once it's released, take it here with \`yarn ui:pull\`.`,
    );
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
  case "tokens": {
    const script = join(layer, "scripts", "tokens-check.mjs");
    if (!existsSync(script))
      fail(
        `This app's ${PREFIX} (version ${version()}) has no token check. Take a newer one with \`yarn ui:pull\`.`,
      );
    run("node", [script, args[0] ?? "app/assets/css/main.css"]);
    break;
  }
  case "probe": {
    const script = join(layer, "scripts", "probe.mjs");
    if (!existsSync(script))
      fail(
        `This app's ${PREFIX} (version ${version()}) has no ui:probe yet. Take a newer one with \`yarn ui:pull\`.`,
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
    check(args.includes("--staged") ? "staged" : args.includes("--pushed") ? "pushed" : "plain");
    break;
  case "migrate": {
    const script = join(layer, "scripts", "migrate.mjs");
    if (!existsSync(script))
      fail(
        `This app's ${PREFIX} (version ${version()}) has no ui:migrate yet. Take 0.18 or later with \`yarn ui:pull\`.`,
      );
    run("node", [script, ...args]);
    break;
  }
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
