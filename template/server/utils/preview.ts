/**
 * Preview-mode shared constants.
 *
 * The anchor login user is created by the core seed (server/db/seeds) and logged
 * in as by the preview-login backdoor (server/api/auth/preview-login.get.ts) —
 * a single source of truth so the two can't drift. Pure data, no imports, so the
 * seed can import it while running in the bare `kysely seed:run` context (no
 * Nitro auto-imports).
 *
 * Background: a preview box can't use Google OAuth — its URL is dynamic and
 * can't be a pre-registered redirect URI — so preview login is a dev-mode
 * backdoor that establishes a session as this seeded user. Both the backdoor
 * endpoint and the runtimeConfig flag that reveals it are hard-gated on
 * NUXT_PREVIEW_MODE, so neither exists in production. Change the email/name here
 * to rebrand the anchor user for your project.
 */
export const PREVIEW_ANCHOR_USER = {
  email: "preview@example.com",
  first_name: "Preview",
  last_name: "User",
} as const;
