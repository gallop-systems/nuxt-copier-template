/**
 * Server middleware for API route authentication.
 *
 * Requires authentication for all /api/* routes except:
 * - /api/public/* (public endpoints)
 * - /api/webhooks/* (webhook endpoints with their own auth)
 * - /api/auth/* (authentication endpoints)
 * - /api/_auth/* (nuxt-auth-utils' own session endpoint, which must answer signed-out visitors)
 */
export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;

  if (
    path.startsWith("/api/public/") ||
    path.startsWith("/api/webhooks/") ||
    path.startsWith("/api/auth/") ||
    path.startsWith("/api/_auth/")
  ) {
    return;
  }

  if (!path.startsWith("/api/")) {
    return;
  }

  const session = await getUserSession(event);

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: "Authentication required",
    });
  }

  event.context.user = session.user;
});
