# Design Language

A minimal, zinc-based design system emphasizing clarity and restraint.

## Core Principles

1. **Zinc-first palette** - Use zinc for almost everything; reserve color for semantic meaning
2. **No decorative shadows** - Shadows only appear on hover to indicate interactivity
3. **Subtle interactions** - Color shade changes indicate hover states, not shadows or transforms
4. **Consistent rounding** - `rounded-xl` for inputs/buttons, `rounded-2xl` for cards

---

## Color Palette

### Primary (Zinc)
| Use | Class |
|-----|-------|
| Text primary | `text-zinc-900` |
| Text secondary | `text-zinc-500` |
| Text muted | `text-zinc-400` |
| Backgrounds | `bg-white`, `bg-zinc-50`, `bg-zinc-100` |
| Borders | `border-zinc-200` |
| Primary buttons | `bg-zinc-900` → `hover:bg-zinc-800` |
| Secondary buttons | `bg-zinc-100` → `hover:bg-zinc-200` |
| Avatars | `bg-zinc-200 text-zinc-700` |
| Header icons | `bg-gradient-to-br from-zinc-800 to-zinc-950 text-white` |

### Semantic Colors
| Meaning | Class |
|---------|-------|
| Success/Active | `bg-emerald-50 text-emerald-700` |
| Danger/Delete | `bg-red-50 text-red-600` → `hover:bg-red-100` |
| Error states | `bg-red-50 text-red-400` |

---

## Typography

```
Headings:     text-zinc-900 font-semibold
Body:         text-zinc-900
Secondary:    text-zinc-500 text-sm
Labels:       text-zinc-700 text-sm font-medium
Captions:     text-zinc-400 text-xs uppercase tracking-wide
Mono:         font-mono text-sm (for IDs, codes)
```

---

## Components

### Buttons

**Primary**
```vue
<Button
  label="Action"
  class="px-4 py-2.5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors text-sm font-medium"
/>
```

**Secondary**
```vue
<Button
  label="Cancel"
  class="px-4 py-2.5 bg-zinc-100 text-zinc-700 rounded-xl hover:bg-zinc-200 transition-colors text-sm font-medium"
/>
```

**Danger**
```vue
<Button
  label="Delete"
  class="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium"
/>
```

### Cards

```vue
<Card class="bg-white rounded-2xl border border-zinc-200/80 shadow-none p-6">
```

Interactive cards add hover state:
```
hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-200/50 transition-all
```

### Avatars

```vue
<!-- User avatar -->
<Avatar
  :text="initials"
  alt="Name"
  class="w-10 h-10 rounded-xl bg-zinc-200 text-zinc-700 font-semibold text-sm"
/>

<!-- Header icon -->
<Avatar
  icon="ph:users"
  alt="Users"
  class="w-11 h-11 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 text-white"
/>
```

### Tags/Badges

```vue
<!-- Status badge -->
<Pill
  label="Active"
  color="success"
  class="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium"
/>

<!-- Neutral badge -->
<Pill
  label="Draft"
  class="inline-flex items-center px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-600 text-xs font-medium"
/>
```

### Inputs

```vue
<Input
  class="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 focus:bg-white transition-all"
/>
```

### Tables (DataTable)

```vue
<DataTable
  :columns="columns"
  :rows="rows"
  :pt="{
    table: { class: 'w-full' },
    headerCell: { class: 'py-3.5 px-5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-200 bg-zinc-50' },
    bodyCell: { class: 'py-4 px-5 border-0' },
  }"
/>
```

### Dialogs

```vue
<Modal
  v-model:open="open"
  title="Edit contract"
  class="max-w-md w-full mx-4 rounded-2xl border border-zinc-200 bg-white"
>
  …
</Modal>
```

### Icon Buttons (circular)

```vue
<button class="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors">
  <Icon name="ph:caret-right" class="text-zinc-600 text-sm" />
</button>
```

---

## Layout Patterns

### Page Structure
```vue
<div class="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
  <!-- Sticky header -->
  <div class="bg-white/80 backdrop-blur-sm border-b border-zinc-200/60 sticky top-0 z-10">
    <div class="max-w-6xl mx-auto px-6 py-6">
      <!-- Header content -->
    </div>
  </div>

  <!-- Main content -->
  <div class="max-w-6xl mx-auto px-6 py-8">
    <!-- Content -->
  </div>
</div>
```

### Back Button
```vue
<NuxtLink
  to="/parent"
  class="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors"
>
  <Icon name="ph:caret-left" class="text-zinc-600" />
</NuxtLink>
```

---

## Spacing Scale

| Use | Value |
|-----|-------|
| Button padding | `px-4 py-2.5` |
| Card padding | `p-5` or `p-6` |
| Section gaps | `gap-6` |
| Input padding | `px-3.5 py-2.5` |
| Page horizontal | `px-6` |
| Page vertical | `py-8` or `py-10` |

---

## Icons

Use the app's icon set via `@nuxt/icon`'s `<Icon>` component: the set in `gallopUi.iconSet` (`app/app.config.ts`), which
gallop-ui's own components draw with too. A new app uses [Phosphor](https://phosphoricons.com) (`ph:*`, regular weight); an
app from before gallop-ui 1.1 may use [Lucide](https://lucide.dev/icons/) (`lucide:*`). Don't mix the two in one app. The
examples below are Phosphor; `layers/gallop-ui/docs/icons.md` maps common names between the sets.
Icons are bundled offline (no runtime API calls) — see `nuxt.config.ts`.

```vue
<Icon name="ph:users" />
<Icon name="ph:plus" />
<Icon name="ph:caret-left" />
<Icon name="ph:caret-right" />
<Icon name="ph:x" />
<Icon name="ph:pencil-simple" />
<Icon name="ph:trash" />
<Icon name="ph:magnifying-glass" />
<Icon name="ph:circle-notch" class="animate-spin" />  <!-- Loading -->
```

- Icons render at `1em` and inherit `currentColor`, so size/color them with
  Tailwind utilities (`text-zinc-500`, `text-base`) like any text. Size them with `text-*`: @nuxt/icon
  sets width and height outside Tailwind's layers, so `size-*` on an `<Icon>` does nothing.
- **Use static, literal `name` values.** Offline bundling relies on
  `clientBundle.scan` (see `nuxt.config.ts`), which scans the source for
  `<Icon name="...">` with string literals. A computed name
  (`:name="iconFor(row)"`) is **not** scanned — it won't be bundled and will
  silently fall back to a network fetch (and break offline). If you must pick an
  icon dynamically, list every possible value explicitly in
  `icon.clientBundle.icons` in `nuxt.config.ts`.
- Phosphor and Lucide are monochrome and have **no brand logos**. For brand marks (OAuth
  buttons, etc.) use the `simple-icons` set, which also tints with
  `currentColor`: `<Icon name="simple-icons:google" />`.
- A gallop-ui component that takes an icon (`Button`, `Avatar`) takes any Iconify name in its
  `icon` prop, brand marks included:

  ```vue
  <Button label="Sign in with Google" icon="simple-icons:google" @click="signIn" />
  ```

---

## Motion

Animation is deliberately minimal. Two tools cover almost everything:

- **`transition-colors`** (Tailwind) for hover/active state changes — already
  the norm across buttons, cards, and inputs.
- **gallop-ui's built-in transitions** for overlays (Modal, Drawer, Toaster,
  DropdownMenu) — no extra work needed.

For DOM changes that aren't covered above — list rows being added/removed,
conditional fields appearing, panels expanding — use **AutoAnimate**. The
`v-auto-animate` directive is registered globally; drop it on the parent:

```vue
<ul v-auto-animate>
  <li v-for="row in rows" :key="row.id">{{ row.name }}</li>
</ul>
```

Keep motion in service of clarity, not decoration:

- Only animate layout changes (add / remove / move / show / hide).
- Keep it subtle — default duration is fine; don't slow it down.
- No entrance/scroll/spring flourishes. If an app genuinely needs a marketing
  surface, add a motion library to *that* app locally rather than here.

---

## Don'ts

- Don't add shadows to static elements
- Don't use colorful gradients for avatars or accents
- Don't use transforms (`-translate-y`) for hover states
- Don't use borders between table rows
- Don't use blue/purple accent colors - stick to zinc
- Don't use the default gallop-ui component styles without customization
- Don't add decorative entrance/scroll/spring animations — use AutoAnimate only for layout changes
