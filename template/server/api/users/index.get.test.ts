import { describe, test, expect, mockGet } from "#server/test-utils";
import handler from "./index.get";

describe("GET /api/users", () => {
  test("returns empty list when no users", async ({ factories: _ }) => {
    const event = mockGet();
    const result = await handler(event);
    expect(result).toEqual([]);
  });

  test("returns users", async ({ factories }) => {
    await factories.user({ email: "alice@example.com", first_name: "Alice", last_name: "Smith" });
    const event = mockGet();
    const result = await handler(event);
    expect(result).toHaveLength(1);
    expect(result[0]!.email).toBe("alice@example.com");
  });
});
