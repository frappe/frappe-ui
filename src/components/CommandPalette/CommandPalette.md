# CommandPalette

A searchable list of commands/pages in a modal, opened with `Mod+K`. Give it
`groups` of items; it emits `select` with whichever one the user picks.

<ComponentPreview name="CommandPalette-Example" />

## Groups and items

```js
const groups = [
  {
    title: 'Pages',
    items: [{ name: 'inbox', title: 'Inbox', icon: 'lucide-inbox' }],
  },
]
```

Each item needs a unique `name` and a `title`; `description` and `icon`
(a `lucide-*` string, an emoji, or a component) are optional. A group's
`hideTitle` hides its heading while still grouping its items under it.

Items render through `CommandPaletteItem` by default. Pass a group's own
`component` to render its items differently — it receives `item` and `active`
props, the same as `CommandPaletteItem`.

## Opening it

`Mod+K` opens the palette from anywhere on the page (registered internally via
[`useKeyboardShortcut`](../other/composables.md#usekeyboardshortcut)). No
wiring needed. Open it programmatically with `v-model:open`.

<!-- @include: ./CommandPalette.api.md -->
