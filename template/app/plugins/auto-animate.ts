import { autoAnimatePlugin } from "@formkit/auto-animate/vue";

// Registers the `v-auto-animate` directive globally. Drop it on any parent
// element to smooth add/remove/move of its children (list rows, conditional
// fields, expanding panels). Keep it to layout changes — no decorative motion.
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(autoAnimatePlugin);
});
