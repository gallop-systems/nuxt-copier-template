/**
 * GET /api/auth/preview-login — dev-mode login for preview boxes.
 *
 * A preview sandbox serves the app on a dynamic URL that can't be a
 * pre-registered Google OAuth redirect URI, so the normal sign-in flow is
 * unusable there. Instead a preview box establishes a session as the seeded
 * anchor user (server/db/seeds → server/utils/preview.ts).
 *
 * Two layers of gating:
 *   - `import.meta.dev` — a COMPILE-TIME floor: production is a built server, so
 *     this branch is statically dead there and the bypass cannot exist in a prod
 *     build regardless of env vars.
 *   - `NUXT_PREVIEW_MODE` — a RUNTIME narrowing: import.meta.dev alone would also
 *     fire in every developer's local `yarn dev`; this scopes the bypass to an
 *     actual preview box, where the serve step sets the flag. The login page only
 *     surfaces the button when the matching public.previewMode flag is on.
 */

import { PREVIEW_ANCHOR_USER } from "~~/server/utils/preview";

export default defineEventHandler(async (event) => {
  if (!import.meta.dev || !process.env.NUXT_PREVIEW_MODE) {
    throw createError({ statusCode: 404, statusMessage: "Not Found" });
  }

  const db = useDatabase();
  const user = await db
    .selectFrom("users")
    .select(["id", "email", "first_name", "last_name", "deactivated_at"])
    .where("email", "=", PREVIEW_ANCHOR_USER.email)
    .executeTakeFirst();

  if (!user) {
    throw createError({
      statusCode: 500,
      message: "Preview user not seeded — run `yarn db:seed`.",
    });
  }
  if (user.deactivated_at) {
    throw createError({ statusCode: 403, message: "Preview user is deactivated." });
  }

  await setUserSession(event, {
    user: {
      // `id` is a bigint column — kysely-codegen types it as `string`; coerce to
      // match the session User type (and the google.get.ts handler).
      id: Number(user.id),
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    },
  });

  return sendRedirect(event, "/");
});
