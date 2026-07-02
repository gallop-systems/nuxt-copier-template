import { defineConfig } from "vitest/config";
import { defineVitestConfig } from "@nuxt/test-utils/config";
import path from "path";

const isFrontendTest = process.env.VITEST_ENV === "nuxt";

export default isFrontendTest
  ? defineVitestConfig({
      test: {
        environment: "nuxt",
        globals: true,
        include: [
          "app/components/**/*.test.ts",
          "app/pages/**/*.test.ts",
          "app/composables/**/*.test.ts",
        ],
      },
    })
  : defineConfig({
      // Backend tests run as a dev-like context. Nuxt/Nitro replace
      // `import.meta.dev` at build; under plain vitest it's undefined, which
      // would make dev-only server guards (e.g. server/api/auth/preview-login)
      // read as "production" and 404. Define it so those branches are exercised,
      // not dead.
      define: {
        "import.meta.dev": true,
      },
      test: {
        globals: true,
        environment: "node",
        include: ["server/**/*.test.ts"],
        globalSetup: ["./server/test-utils/global-setup.ts"],
        setupFiles: ["./server/test-utils/setup.ts"],
        coverage: {
          provider: "v8",
          reporter: ["text", "json", "json-summary"],
          include: ["server/**/*.ts"],
          exclude: ["server/**/*.test.ts", "server/test-utils/**", "server/db/migrations/**"],
        },
      },
      resolve: {
        alias: {
          "~": path.resolve(__dirname),
          "@": path.resolve(__dirname),
          "~~": path.resolve(__dirname),
          "@@": path.resolve(__dirname),
          // Nuxt provides `#server` (server/ dir) in the app + nuxt-env test
          // build; plain-vitest backend tests don't get it, so map it here.
          "#server": path.resolve(__dirname, "server"),
        },
      },
    });
