/**
 * Client-side auth middleware.
 *
 * Redirects unauthenticated users to the login page.
 * Allows access to public pages without authentication.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const publicPages = ['/login'];

  if (publicPages.some((p) => to.path.startsWith(p))) {
    return;
  }

  const { loggedIn, fetch: fetchSession } = useUserSession();

  await fetchSession();

  if (!loggedIn.value) {
    return navigateTo('/login');
  }
});
