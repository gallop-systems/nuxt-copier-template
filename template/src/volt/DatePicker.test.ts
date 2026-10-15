import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import DatePicker from "./DatePicker.vue";

// A DatePicker bound like `v-model` would bind it, so the parent's value flows
// back in as the prop and the input shows what was saved.
async function mountPicker(props: Record<string, unknown> = {}) {
  const wrapper = await mountSuspended(DatePicker, {
    props: {
      modelValue: null,
      dateFormat: "M d, yy",
      "onUpdate:modelValue": (value: unknown) => wrapper.setProps({ modelValue: value }),
      ...props,
    },
  });
  return wrapper;
}

async function typeAndBlur(wrapper: Awaited<ReturnType<typeof mountPicker>>, text: string) {
  const input = wrapper.find("input");
  await input.trigger("focus");
  await input.setValue(text);
  await input.trigger("blur");
  return input;
}

// `modelValue` falls through to PrimeVue as an attribute, not a declared prop.
const model = (wrapper: Awaited<ReturnType<typeof mountPicker>>) => wrapper.vm.$attrs.modelValue;

const isoDate = (value: unknown) =>
  value instanceof Date
    ? `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`
    : value;

describe("VoltDatePicker typed input", () => {
  it.each(["Oct 11, 2026", "10/11/2026", "2026-10-11"])("saves %s on Tab", async (text) => {
    const wrapper = await mountPicker();
    const input = await typeAndBlur(wrapper, text);

    expect(isoDate(model(wrapper))).toBe("2026-10-11");
    expect(input.element.value).toBe("Oct 11, 2026");
    expect(input.attributes("aria-invalid")).not.toBe("true");
  });

  it("saves a typed date on Enter and closes the overlay", async () => {
    const wrapper = await mountPicker();
    const input = wrapper.find("input");
    await input.trigger("focus");
    await input.setValue("10/11/2026");
    await input.trigger("keydown", { code: "Enter", key: "Enter" });

    expect(isoDate(model(wrapper))).toBe("2026-10-11");
    expect(wrapper.findComponent({ name: "DatePicker" }).vm.overlayVisible).toBe(false);
  });

  it("keeps the previous value and marks the field invalid for text that isn't a date", async () => {
    const wrapper = await mountPicker({ modelValue: new Date(2026, 0, 5) });
    const input = await typeAndBlur(wrapper, "next tuesday");

    expect(isoDate(model(wrapper))).toBe("2026-1-5");
    expect(input.element.value).toBe("Jan 5, 2026");
    expect(input.attributes("aria-invalid")).toBe("true");

    await input.trigger("focus");
    expect(input.attributes("aria-invalid")).not.toBe("true");
  });

  it("rejects dates that don't exist", async () => {
    const wrapper = await mountPicker();
    const input = await typeAndBlur(wrapper, "2/30/2026");

    expect(model(wrapper)).toBeNull();
    expect(input.attributes("aria-invalid")).toBe("true");
  });

  it("sets the model to null when the input is cleared", async () => {
    const wrapper = await mountPicker({ modelValue: new Date(2026, 9, 11) });
    const input = await typeAndBlur(wrapper, "");

    expect(model(wrapper)).toBeNull();
    expect(input.attributes("aria-invalid")).not.toBe("true");
  });

  it("clears the invalid state when a date is then chosen from the calendar", async () => {
    // Clicking a day blurs the input first, so this is the order a mouse user hits.
    const wrapper = await mountPicker({ modelValue: new Date(2026, 9, 1) });
    const input = await typeAndBlur(wrapper, "next tuesday");
    expect(input.attributes("aria-invalid")).toBe("true");

    // Focusing opened the overlay; earlier tests leave theirs in <body>, so take the last.
    const panel = [...document.body.querySelectorAll('[data-pc-section="panel"]')].at(-1)!;
    const day = [...panel.querySelectorAll<HTMLElement>('[data-pc-section="day"]')].find(
      (el) => el.textContent?.trim() === "15",
    );
    day!.click();
    await wrapper.vm.$nextTick();

    expect(isoDate(model(wrapper))).toBe("2026-10-15");
    expect(input.attributes("aria-invalid")).not.toBe("true");
  });

  it("keeps a caller's own invalid state", async () => {
    const wrapper = await mountPicker({ invalid: true });

    expect(wrapper.find("input").attributes("aria-invalid")).toBe("true");
  });
});
