# copier-nuxt

A [Copier](https://copier.readthedocs.io/) template for full-stack Nuxt 4 applications with Kysely, PostgreSQL, Tailwind CSS, and Volt (PrimeVue) components.

## What you get

- **Nuxt 4** with Vue 3, TypeScript, and Tailwind CSS 4
- **Kysely** for type-safe SQL queries with auto-generated types from your database
- **Volt** component library (PrimeVue + Tailwind) with a zinc-first design system
- **PostgreSQL** with migrations, codegen, and transaction-based test isolation
- **Vitest** for both backend and frontend tests
- **Optional:** Google OAuth, GitHub Actions CI, lefthook git hooks

## Prerequisites

- Node.js 22+
- Yarn (the template ships Yarn 4.12.0 via corepack)
- PostgreSQL running locally
- [Copier](https://copier.readthedocs.io/en/stable/#installation) (`pip install copier` or `pipx install copier`)

## Creating a new project

```bash
copier copy gh:gallop-systems/nuxt-copier-template my-app
```

Or from a local clone:

```bash
copier copy /path/to/copier-nuxt my-app
```

You'll be prompted for:

| Question | Default | Description |
|---|---|---|
| `project_name` | *(required)* | Used in package.json, DB names, page headers |
| `project_description` | `""` | For package.json |
| `database_name` | same as `project_name` | PostgreSQL database name |
| `auth_provider` | `google` | Auth provider to scaffold: `google`, `microsoft`, or `none` |
| `include_ci` | `true` | Add GitHub Actions CI workflow |
| `include_git_hooks` | `true` | Add lefthook pre-commit hooks |

After answering, Copier automatically:

1. Creates the PostgreSQL databases (`<database_name>` and `<database_name>-test`)
2. Copies `.env.example` to `.env`
3. Runs `yarn install`
4. Installs Volt UI components
5. Creates and runs the initial `users` migration
6. Generates TypeScript types from the database schema
7. Initializes a git repo with an initial commit

## Requiring CI to pass before merge

GitHub does **not** read required status checks from committed workflow files —
branch protection is configured on the repo, so a fresh project starts with
nothing gating merges. After pushing the repo to GitHub (and letting CI run once
so the check is known), require the CI gate on `main`:

```bash
echo '{"required_status_checks":{"strict":false,"contexts":["ci-success"]},"enforce_admins":false,"required_pull_request_reviews":null,"restrictions":null}' \
  | gh api -X PUT repos/{owner}/{repo}/branches/main/protection --input -
```

Require the single **`ci-success`** context, not the individual jobs. The backend
test job is sharded, so its check names embed the shard count (`test (shard
1/4)`, …) and change as the suite grows — pinning protection to them would break.
`ci-success` is a stable aggregate that passes only when every gating job
(`test`, `test-frontend`, `typecheck`, `static`, `build`) succeeds. The
`coverage` job is intentionally excluded so it never blocks a merge.

Requires admin on the repo and the `include_ci` workflow. Add
`"required_pull_request_reviews"` or other fields if you also want review rules.

## Updating an existing project

When the template evolves, pull changes into a project that was scaffolded from it:

```bash
cd my-app
copier update
```

Copier diffs the template version you originally copied against the latest tagged version and applies the changes, letting you resolve any conflicts.

**This only works if the template repo has git tags** (see [Versioning](#versioning) below). Without tags, Copier can't determine what changed between versions.

## Versioning

Copier uses git tags to track template versions, and **[release-please](https://github.com/googleapis/release-please) automates them** — you don't tag by hand. Land changes on `main` with [Conventional Commit](https://www.conventionalcommits.org/) messages and release-please opens/maintains a release PR; **merging that PR cuts the `vX.Y.Z` tag + GitHub Release**. The version bump is inferred from the commits:

- `fix:` / dependency bumps → **patch** (`v0.1.1`)
- `feat:` / new questions / new optional components → **minor** (`v0.2.0`)
- a `!` or `BREAKING CHANGE:` footer → **major** (`v1.0.0`)

Dependencies (including `@gallopsystems/agent-skills`) are bumped automatically by **Renovate** (see `renovate.json`) as `fix(deps):` commits, so a dependency update flows straight to a patch release with no manual step — which the template-update sweep then propagates.

Creating a GitHub Release (release-please does this) — not just a tag — matters because downstream projects link to release notes when applying template updates.

Without tags, `copier copy` warns "No git tags found in template" and `copier update` won't work in downstream projects.

## Testing the template

Run the test script from the repo root:

```bash
./test.sh
```

This scaffolds a throwaway project into a temp directory, runs both backend and frontend tests, then cleans up (drops test databases, removes the temp directory). Exit code 0 means the template is valid.

## Template structure

```
copier-nuxt/
├── copier.yml          # Template questions, settings, and post-copy tasks
├── test.sh             # Template validation script
└── template/           # Everything inside here gets copied
    ├── app/            # Frontend: pages, components, composables, layouts
    ├── server/         # Backend: API routes, DB, middleware, test utils
    ├── src/volt/       # Volt UI components (populated by post-copy task)
    ├── scripts/        # Build/setup scripts
    ├── package.json.jinja
    ├── nuxt.config.ts.jinja
    ├── vitest.config.ts
    └── ...
```

Files ending in `.jinja` are processed by Copier's Jinja2 engine. Filenames can also be conditional (e.g., `{% if include_ci %}ci.yml{% endif %}.jinja`).

## Scaffolded project commands

| Command | Description |
|---|---|
| `yarn dev` | Start dev server on http://localhost:3000 |
| `yarn build` | Production build |
| `yarn test` | Run backend tests (watch mode) |
| `yarn test:run` | Run backend tests once |
| `yarn test:frontend` | Run frontend tests (watch mode) |
| `yarn test:frontend:run` | Run frontend tests once |
| `yarn db:migrate` | Run pending migrations |
| `yarn db:migrate:down` | Rollback last migration |
| `yarn db:migrate:make <name>` | Create a new migration |
| `yarn db:codegen` | Regenerate TypeScript types from database |

## Contributing to the template

1. Make changes in the `template/` directory (or `copier.yml` for questions/tasks)
2. Run `./test.sh` to verify the template still produces a working project
3. Commit with a Conventional Commit message and open a PR; once merged, release-please cuts the new version so downstream projects can `copier update` (see [Versioning](#versioning))
