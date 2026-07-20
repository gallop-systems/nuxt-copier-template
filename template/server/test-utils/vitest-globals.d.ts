// The backend vitest project runs with `globals: true` (see vitest.config.ts),
// so `describe`/`beforeAll`/`vi`/... are ambient at runtime. Declare them for
// the typechecker too — `yarn typecheck` runs vue-tsc over
// .nuxt/tsconfig.server.json, which has no `types` entry for vitest.
/// <reference types="vitest/globals" />
// `vite/client` supplies the `import.meta.glob` type used by
// server/db/seeds.harness.test.ts (Vite's glob import is not in the base lib).
/// <reference types="vite/client" />
