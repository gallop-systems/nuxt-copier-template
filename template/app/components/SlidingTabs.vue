<script setup lang="ts" generic="T extends string">
interface TabOption {
  value: T;
  label: string;
  icon?: string;
  iconSvg?: string;
  count?: number | null;
}

const props = withDefaults(
  defineProps<{
    modelValue: T;
    options: readonly TabOption[];
    ariaLabel?: string;
    size?: "sm" | "md";
    /**
     * Responsive behavior, keyed on whether EVERY option has an icon:
     *  - all options have an icon  → desktop shows icon + label, mobile shows
     *    icon-only (labels hidden below md).
     *  - some/no options have icons → icons are dropped entirely and labels show
     *    at every width.
     * Defaults to on. Pass `:responsive="false"` to always show labels (icons
     * stay on desktop, never collapse) — e.g. when the icons are ambiguous.
     *
     * NOTE: this MUST be defaulted via withDefaults. A bare `boolean` prop is
     * subject to Vue's Boolean casting — when absent it coerces to `false`, not
     * `undefined`, which would silently disable the collapse everywhere.
     */
    responsive?: boolean;
  }>(),
  { responsive: true },
);

const emit = defineEmits<{
  "update:modelValue": [value: T];
}>();

const size = computed(() => props.size ?? "md");

const containerRef = ref<HTMLElement | null>(null);
const activeIndex = computed(() => props.options.findIndex((o) => o.value === props.modelValue));

// Only treat this as an icon toggle when EVERY option carries an icon.
const allHaveIcons = computed(
  () => props.options.length > 0 && props.options.every((o) => !!(o.icon || o.iconSvg)),
);
// Show icons at all? Only when every option has one (avoids a mixed icon/label row).
const showIcons = computed(() => allHaveIcons.value);
// Hide labels on mobile (icon-only) — only in the all-icons case, unless overridden.
const collapseLabels = computed(() => allHaveIcons.value && props.responsive);

// The indicator is measured from the live DOM, so it must re-measure whenever
// layout changes — not just on click. A ResizeObserver covers resizes and the
// label show/hide that happens when the mobile breakpoint flips.
const layoutVersion = ref(0);
let ro: ResizeObserver | null = null;
onMounted(() => {
  const el = containerRef.value;
  if (el && typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(() => {
      layoutVersion.value++;
    });
    ro.observe(el);
  }
});
onBeforeUnmount(() => {
  ro?.disconnect();
  ro = null;
});

const indicatorStyle = computed(() => {
  void layoutVersion.value; // re-measure on layout changes
  if (!containerRef.value) return { left: "0px", width: "0px" };
  const buttons = containerRef.value.querySelectorAll("button");
  const btn = buttons[activeIndex.value];
  if (!btn) return { left: "0px", width: "0px" };
  return {
    left: `${btn.offsetLeft}px`,
    width: `${btn.offsetWidth}px`,
  };
});
</script>

<template>
  <div
    ref="containerRef"
    :class="[
      'relative inline-flex bg-surface-muted p-0.5 gap-0.5',
      size === 'sm' ? 'rounded-md' : 'rounded-lg',
    ]"
    role="group"
    :aria-label="ariaLabel"
  >
    <div
      :class="[
        'absolute top-0.5 bottom-0.5 bg-surface shadow-sm',
        size === 'sm' ? 'rounded' : 'rounded-md',
      ]"
      :style="{
        left: indicatorStyle.left,
        width: indicatorStyle.width,
        transition:
          'left 0.6s cubic-bezier(0.22, 1, 0.36, 1), width 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
      }"
    />
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      :aria-label="opt.label"
      @click="emit('update:modelValue', opt.value)"
      :class="[
        'relative z-10 inline-flex items-center justify-center gap-1.5 rounded font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400',
        size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-sm',
        modelValue === opt.value ? 'text-fg' : 'text-fg-muted hover:text-fg',
      ]"
      :aria-pressed="modelValue === opt.value"
    >
      <span
        v-if="showIcons && opt.iconSvg"
        class="inline-flex h-3 w-3 [&>svg]:h-full [&>svg]:w-full"
        aria-hidden="true"
        v-html="opt.iconSvg"
      />
      <i v-else-if="showIcons && opt.icon" :class="['text-xs', opt.icon]" />
      <span v-if="opt.label" :class="collapseLabels ? 'hidden md:inline' : ''">{{
        opt.label
      }}</span>
      <span
        v-if="opt.count != null"
        :class="[
          'text-xs tabular-nums',
          collapseLabels ? 'hidden md:inline' : '',
          modelValue === opt.value ? 'text-fg-muted' : 'text-fg-subtle',
        ]"
      >
        {{ opt.count }}
      </span>
    </button>
  </div>
</template>
