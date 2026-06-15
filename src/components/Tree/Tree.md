# Tree

Displays hierarchical data as a collapsible tree. Renders a forest of roots with
keyboard navigation, optional single-selection, and optional drag-and-drop
reparenting/reordering. Connector guides visually link parents to their
children.

## Default

The simplest tree — pass `nodes` and tell it which field is the key.

<ComponentPreview name="Tree-Example" />

## Drag and drop

Set `draggable` to let nodes be dragged onto one another to reparent. A
`canDrop` validator gates where drops are allowed, and `@move` reports the
change for you to persist.

<ComponentPreview name="Tree-DragDrop" />

## List view with avatars and row actions

Use the `#prefix`, `#label`, and `#suffix` slots to turn the tree into a rich
list — an avatar on the left, a two-line label, and a row action (an add
button) on the right. `guides="none"` drops the connector lines for a plain
list look.

<ComponentPreview name="Tree-ListView" />

## Usage

```vue
<script setup>
import { ref } from 'vue'
import { Tree } from 'frappe-ui'

const nodes = ref([
  {
    name: 'src',
    label: 'src',
    children: [
      { name: 'index.ts', label: 'index.ts' },
      { name: 'app.vue', label: 'app.vue' },
    ],
  },
])
const expanded = ref(['src'])
const selected = ref(null)
</script>

<template>
  <Tree
    :nodes="nodes"
    node-key="name"
    v-model:expanded="expanded"
    v-model:selected="selected"
  />
</template>
```

## Node shape

Each node is a plain object. The field names for its **id**, **label** and
**children** are configurable via the `nodeKey`, `labelKey` and `childrenKey`
props, so existing records can be rendered without remapping. A node is a leaf
when its children field is missing or empty.

## Expansion & selection

- `v-model:expanded` holds the array of expanded node keys (controlled or
  uncontrolled). When unbound, `defaultExpanded` seeds the initial state.
- `v-model:selected` holds the single selected key, or `null`.

Both are optional — leave them unbound and the tree manages state internally.

## Keyboard

Following the WAI-ARIA Tree View pattern: `↑`/`↓` move between visible rows,
`→` expands or steps into children, `←` collapses or steps to the parent,
`Home`/`End` jump to the first/last row, `Enter`/`Space` select, and typing
letters jumps to the next matching label.

## Drag and drop

Set `draggable` to let nodes be dragged onto one another to reparent. Provide a
`canDrop(ctx)` validator to gate drops — built-in guards already reject
drop-on-self and drop-into-own-descendant. Enable `reorderable` to also allow
`before`/`after` sibling drops. A valid drop emits `move`; the consumer persists
the change and updates `nodes`.

```vue
<Tree
  :nodes="nodes"
  node-key="name"
  draggable
  :can-drop="({ node, target }) => target.name !== 'locked'"
  @move="onMove"
/>
```

## Customizing rows

Use the `#node` slot to fully replace a row (you receive `toggle` and `select`
plus state), or the lighter `#label`, `#prefix`, and `#suffix` slots to keep the
default layout. Style via the `data-slot`, `data-state`, `data-selected`,
`data-drop` and `data-level` attributes rather than class props.

<!-- @include: ./Tree.api.md -->
