<template>
    <SplitButton
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </SplitButton>
</template>

<script setup lang="ts">
import SplitButton, { type SplitButtonPassThroughOptions, type SplitButtonProps } from 'primevue/splitbutton';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ SplitButtonProps {}
defineProps<Props>();

// A primary action joined to a dropdown that holds the alternatives, drawn as an
// outlined segmented control: white fill, a hairline zinc border, and a single
// border for the seam between the halves.
//
// Size lives here, not at the call site. A `pt:pcButton:*` / `pt:pcDropdown:*`
// override on the page *replaces* these nested-section classes instead of merging
// with them (ptViewMerge only reaches this component's own sections), so sizing
// the halves that way strips their border, padding and colors. Pick the size with
// the `size` prop: default is h-8 / 13px, small is h-7 / 12px.
const halfButton = `inline-flex cursor-pointer select-none items-center justify-center overflow-hidden relative
    h-8 text-[13px] p-small:h-7 p-small:text-[12px]
    transition-colors duration-200 disabled:pointer-events-none disabled:opacity-60
    bg-white border border-surface-200 text-surface-700
    enabled:hover:bg-surface-50 enabled:hover:text-surface-900
    dark:bg-surface-900 dark:border-surface-700 dark:text-surface-300
    dark:enabled:hover:bg-surface-800 dark:enabled:hover:text-surface-0
    focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2
    focus-visible:outline-surface-600 dark:focus-visible:outline-surface-300`;

const theme = ref<SplitButtonPassThroughOptions>({
    root: `inline-flex rounded-md`,
    pcButton: {
        root: `${halfButton} rounded-l-md rounded-r-none gap-1.5 px-3 p-small:px-2.5`,
        icon: ``,
        label: `font-medium`
    },
    pcDropdown: {
        root: `${halfButton} rounded-r-md rounded-l-none border-l-0 w-8 text-surface-500 dark:text-surface-400`,
        icon: `size-2.5`,
        label: `invisible w-0`
    },
    pcMenu: {
        root: `bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-0
            border border-surface-200 dark:border-surface-700 rounded-md min-w-52
            p-popup:shadow-md`,
        rootList: `m-0 p-1 list-none outline-none flex flex-col gap-px`,
        item: `p-focus:bg-surface-100 dark:p-focus:bg-surface-800 rounded-sm text-surface-700 dark:text-surface-0`,
        itemContent: `text-inherit rounded-sm transition-colors duration-200 hover:bg-surface-50 dark:hover:bg-surface-800`,
        itemLink: `cursor-pointer flex items-center no-underline overflow-hidden relative text-inherit px-3 py-2 gap-2 select-none`,
        itemIcon: `text-surface-400`,
        itemLabel: `leading-none`,
        submenuIcon: `text-surface-400`,
        separator: `border-t border-surface-200 dark:border-surface-700 my-1`
    }
});
</script>
