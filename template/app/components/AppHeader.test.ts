import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import AppHeader from "./AppHeader.vue";

describe("AppHeader", () => {
  it("renders the app header", async () => {
    const wrapper = await mountSuspended(AppHeader);
    expect(wrapper.exists()).toBe(true);
  });
});
