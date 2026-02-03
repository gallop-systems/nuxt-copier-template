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
          exclude: [
            "server/**/*.test.ts",
            "server/test-utils/**",
            "server/db/migrations/**",
          ],
        },
      },
      resolve: {
        alias: {
          "~": path.resolve(__dirname),
          "@": path.resolve(__dirname),
          "~~": path.resolve(__dirname),
          "@@": path.resolve(__dirname),
        },
      },
    });
