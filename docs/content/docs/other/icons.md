# Icons

Frappe UI includes every [Lucide](https://lucide.dev) icon. Put the class
`lucide-<name>` on an element to show an icon, and pass the same string to any
component prop that takes an icon.

## Browse all icons

Search the set below and click an icon to copy its name. Add `lucide-` in front
of the name to get its class.

<script setup>
import LucideGallery from '../../../components/LucideGallery.vue'
</script>

<ClientOnly>
  <LucideGallery />
</ClientOnly>

## Class form

Each icon is a Tailwind class named `lucide-<name>`. Put it on an empty
`<span>`:

```vue
<template>
  <span class="lucide-menu size-4" />
  <span class="lucide-chevron-down size-3" />
  <span class="lucide-circle-check size-5 text-ink-green-5" />
</template>
```

You need no imports and no Vite setup. The classes come from the frappe-ui
Tailwind preset (see [Getting Started](../getting-started)).

The preset draws each icon as a CSS mask filled with the text color. Tailwind
adds CSS only for classes it finds as complete strings in your source, so your
bundle holds only the icons you use.

### Write the full class name

Tailwind cannot see a class built at runtime, so this icon does not show:

```vue
<!-- Does not render: Tailwind cannot see this class -->
<span :class="`lucide-${name}`" />
```

Write each class in full instead:

```vue
<span :class="open ? 'lucide-chevron-down' : 'lucide-chevron-right'" />
```

For a name that comes from data, map each value to a full class name:

```js
const statusIcons = {
  open: 'lucide-circle',
  done: 'lucide-circle-check',
  cancelled: 'lucide-circle-x',
}
```

If you cannot list the names ahead of time, import the icons as components.
See [Other ways to import](#other-ways-to-import).

## Size and color

An icon is `1em` square by default, so it follows the font size around it. It
takes the text color, so any `text-*` class colors it.

```vue
<!-- Uses the parent's font size and text color -->
<div class="flex items-center gap-1 text-base text-ink-gray-7">
  <span class="lucide-info" /> Heads up
</div>

<!-- Set both on the icon -->
<span class="lucide-info size-5 text-ink-blue-5" />
```

Icons are `display: block`, the same as Tailwind's default for `<svg>`. To
place an icon next to text, put both in a `flex`, `inline-flex` or `grid`
container.

## Icons in component props

Components that take an icon accept a `lucide-*` string or a Vue component.

```vue
<Button icon-left="lucide-plus" label="New task" />
<Button icon-right="lucide-arrow-right" label="Continue" />
<Button icon="lucide-settings" tooltip="Settings" />
```

Menu options take an `icon` field in the same way:

```vue
<script setup>
const options = [
  { label: 'Profile', icon: 'lucide-user', onClick: () => {} },
  { label: 'Settings', icon: 'lucide-settings', onClick: () => {} },
  { label: 'Sign out', icon: 'lucide-log-out', onClick: () => {} },
]
</script>

<template>
  <Dropdown :options="options">
    <Button icon-left="lucide-circle-user" label="Account" />
  </Dropdown>
</template>
```

The strings are complete in your source, so Tailwind finds them. The same
applies to `Alert`, `Dialog`, `Select`, `Combobox`, `MultiSelect`, `Switch`,
`Tabs`, `TabButtons`, `Sidebar` and others. Check each component's reference
for the prop names. To show an icon outside a prop, use a `<span>` with the
class, or the [Icon](../components/icon) component.

## Other ways to import

Two more forms render the icon as an inline `<svg>` Vue component. Use them
when you cannot list the icon names ahead of time, or when you need real SVG
elements. Each icon you use adds a few hundred bytes to your JavaScript bundle.

Both need the `lucideIcons` option on the frappe-ui Vite plugin. It is off by
default:

```js
// vite.config.js
frappeui({ lucideIcons: true })
```

Without it, an import fails the build, and a `<LucideMenu />` tag renders
nothing (development shows a "Failed to resolve component" warning).

**`~icons/lucide/<name>` imports.** Import the icon and use it as a component,
or pass it to an icon prop:

```vue
<script setup>
import LucideMenu from '~icons/lucide/menu'
</script>

<template>
  <LucideMenu class="size-4" />
  <Button :icon-left="LucideMenu" label="Menu" />
</template>
```

**Auto-imported `<LucideName />` tags.** Write the icon's PascalCase name as a
tag, with no import. The plugin adds the `~icons/lucide/<name>` import when it
compiles the template.

```vue
<template>
  <LucideChevronDown class="size-3" />
</template>
```
