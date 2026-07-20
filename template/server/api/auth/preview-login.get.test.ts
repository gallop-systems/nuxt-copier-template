import { test, expect, mockGet } from "#server/test-utils";
import { beforeEach, vi } from "vitest";
import handler from "./preview-login.get";
import { PREVIEW_ANCHOR_USER } from "#server/utils/preview";

// setUserSession / sendRedirect aren't stubbed by the shared setup — stub them
// here (file-scoped, so we never touch the setup.ts globals like useDatabase).
const setUserSession = vi.fn(async (_event: unknown, _session: unknown) => {});
const sendRedirect = vi.fn((_event: unknown, to: string) => to);
vi.stubGlobal("setUserSession", setUserSession);
vi.stubGlobal("sendRedirect", sendRedirect);

beforeEach(() => {
  setUserSession.mockClear();
  sendRedirect.mockClear();
});

async function withPreviewMode<T>(on: boolean, fn: () => Promise<T>): Promise<T> {
  const prev = process.env.NUXT_PREVIEW_MODE;
  if (on) process.env.NUXT_PREVIEW_MODE = "true";
  else delete process.env.NUXT_PREVIEW_MODE;
  try {
    return await fn();
  } finally {
    if (prev === undefined) delete process.env.NUXT_PREVIEW_MODE;
    else process.env.NUXT_PREVIEW_MODE = prev;
  }
}

test("404s when NUXT_PREVIEW_MODE is unset (the production gate)", async ({ factories }) => {
  await factories.user({ email: PREVIEW_ANCHOR_USER.email });
  await withPreviewMode(false, async () => {
    await expect(handler(mockGet())).rejects.toMatchObject({ statusCode: 404 });
  });
  expect(setUserSession).not.toHaveBeenCalled();
});

test("logs in as the seeded anchor user and redirects to /", async ({ factories }) => {
  await factories.user({
    email: PREVIEW_ANCHOR_USER.email,
    first_name: "Preview",
    last_name: "User",
  });

  const result = await withPreviewMode(true, () => handler(mockGet()));

  expect(result).toBe("/");
  expect(setUserSession).toHaveBeenCalledOnce();
  const session = setUserSession.mock.calls[0]![1] as { user: Record<string, unknown> };
  expect(session.user).toMatchObject({
    email: PREVIEW_ANCHOR_USER.email,
    first_name: "Preview",
    last_name: "User",
  });
});

test("500s in preview mode when the anchor user hasn't been seeded", async ({ factories: _ }) => {
  await withPreviewMode(true, async () => {
    await expect(handler(mockGet())).rejects.toMatchObject({ statusCode: 500 });
  });
  expect(setUserSession).not.toHaveBeenCalled();
});
