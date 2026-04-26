# Icons

Frappe UI ships with the full [Lucide](https://lucide.dev) icon set. There are
three ways to use an icon in your templates. Pick the first one that fits —
they all render the same icon, but the recommended path keeps your code
simpler and your bundle smaller.

## Recommended: class-based icons

Every Lucide icon is exposed as a Tailwind utility class named
`lucide-<icon-name>`. Drop it on any element and size/tint it with the usual
utilities:

```vue
<template>
  <span class="lucide-menu size-4 text-ink-gray-7" />
  <span class="lucide-chevron-down size-3" />
  <span class="lucide-circle-check size-5 text-ink-green-6" />
</template>
```

No imports, no component registration, no auto-import magic. Icon names match
Lucide's own kebab-case names — search them at
[lucide.dev/icons](https://lucide.dev/icons).

### How it works

A Tailwind plugin (`tailwind/iconPackPlugin.js`) reads every SVG from the
`lucide-static` package at build time and registers each one as a Tailwind
component class via `matchComponents`. The generated rule sets
`mask-image` to a data-URI of the icon's SVG and `background-color` to
`currentColor`, so the icon paints in whatever color the element inherits
and crops to whatever size you give it.

Tailwind's JIT only emits CSS for classes it can find as literal strings in
your source — so even though ~1800 icons are registered, only the ones you
actually use end up in the output bundle. That's why a dynamic class like
`` `lucide-${name}` `` produces no CSS: the JIT scanner can't see what to
emit.

### Sizing and color

The icon defaults to `1em × 1em` (it scales with surrounding text) and uses
`currentColor`, so any `text-*` utility tints it.

```vue
<!-- Inherits the parent's text color and font-size -->
<p class="text-base text-ink-gray-7">
  <span class="lucide-info" /> heads up
</p>

<!-- Or set both explicitly -->
<span class="lucide-info size-5 text-ink-blue-6" />
```

### Always write the full class name

Tailwind only generates CSS for classes it can find as complete strings in
your source. **Do not** build the icon class dynamically:

```vue
<!-- ❌ Won't render — Tailwind cannot see this class -->
<span :class="`lucide-${name}`" />
```

Instead, list each option as a complete literal:

```vue
<!-- ✅ Both classes are statically visible -->
<span :class="open ? 'lucide-chevron-down' : 'lucide-chevron-right'" />
```

If your icon name is genuinely data-driven (e.g. coming from an API or a
config object built at runtime), use the import-based approach below.

## Also supported: `~icons/lucide/*` imports

The Vite plugin resolves `~icons/lucide/<name>` to a Vue component. Useful
when you need an actual SVG node — for example, when the icon name is
dynamic, or when something downstream expects a component reference rather
than a class string.

```vue
<script setup>
import LucideMenu from '~icons/lucide/menu'
import LucideChevronDown from '~icons/lucide/chevron-down'
</script>

<template>
  <LucideMenu class="size-4" />
  <LucideChevronDown class="size-3" />
</template>
```

You can also pass the imported component into props that accept a component
reference:

```vue
<Button :icon-left="LucideMenu" />
```

### How it works

`~icons/lucide/*` is a virtual module backed by a Vite plugin
(`vite/lucideIcons.js`). When Vite resolves an import like
`~icons/lucide/menu`, the plugin reads the matching SVG from
`lucide-static` and synthesizes a small Vue component that renders the
icon as an inline `<svg>` element. The component is bundled into your JS
like any other module, so each icon you import adds a few hundred bytes
to the bundle.

## Also supported: auto-imported `<LucideName />`

For convenience, every Lucide icon is also available as a global Vue
component named `<Lucide<PascalName> />` — no import needed.

```vue
<template>
  <LucideMenu class="size-4" />
  <LucideChevronDown class="size-3" />
</template>
```

This is functionally identical to the `~icons/lucide/*` import form; pick
whichever reads better in context.

### How it works

`unplugin-vue-components` scans your templates and, when it sees a tag
like `<LucideMenu />`, automatically inserts an import for
`~icons/lucide/menu` at compile time. From there it's the same path as
the manual-import form above — a virtual-module Vue component rendered as
an inline `<svg>`.

## Which one should I use?

| Situation                                   | Use                          |
| ------------------------------------------- | ---------------------------- |
| Static icon in a template                   | Class — `lucide-menu`        |
| Icon name from props/data with a known set  | Class — list each literal    |
| Icon name truly dynamic (loops, API data)   | `~icons/lucide/*` import     |
| Passing an icon as a prop value             | `~icons/lucide/*` import     |
| Inside an `<svg>` (need real SVG children)  | `~icons/lucide/*` import     |
| Quick prototyping in a template             | `<LucideName />` auto-import |

In most components you write, the class form is the right answer.
