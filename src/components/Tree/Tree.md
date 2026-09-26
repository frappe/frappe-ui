# Tree

Shows nested data as rows that open and close, such as folders or an org
chart. It supports keyboard navigation and, when you turn it on, drag and drop
to move nodes.

<ComponentPreview name="Tree-Example" />

## Examples

### Expand and collapse all

Buttons above the tree call `expandAll()`, `collapseAll()` and `toggle(key)`
on a template ref. They write the same `expanded` model that clicking a row
does.

<ComponentPreview name="Tree-ExpandAll" />

### Folder outline

`guides` sets the lines that link parents to children: `connectors`, `lines`
or `none`.

<ComponentPreview name="Tree-Guides" />

### Move files between folders

`draggable` lets people drag a file into a folder or between siblings. The
`move` function allows drops only into folders, and `@drag-end` saves the
move to the data. Turn on **Disable interaction** to see `disabled` stop both
dragging and opening rows.

<ComponentPreview name="Tree-DragDrop" />

### Reporting lines

The `#item-prefix`, `#item-label` and `#item-suffix` slots turn each row into
an avatar, a name with a role, and an add button. `guides="none"` removes the
lines.

<ComponentPreview name="Tree-ListView" />

## Behavior

### Node shape

Pass the top-level nodes as `nodes`. Each node is a plain object with a
`label` and optional `children`. Its unique key lives in the field named by
`nodeKey`, such as `name`. A node with no `children`, or an empty array, is a
leaf. Extra fields reach the slots, so you can show avatars, roles or badges.

```vue
<script setup>
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
</script>

<template>
  <Tree :nodes="nodes" node-key="name" v-model:expanded="expanded" />
</template>
```

To show a field other than `label`, use the `#item-label` slot rather than
renaming the field. The tree never writes to the objects you pass in.

### Expansion

`v-model:expanded` holds the keys of the open nodes. A missing key means
closed, so a tree with no bound model shows only its top-level nodes.
Clicking a row, or pressing `Enter` or `Space` on it, opens or closes it.

Every change assigns a new array, so shallow watchers, immutable stores and
undo logs see it.

### Drag and drop

Set `draggable` to turn on dragging. The tree works out the drop position from
the pointer (`before`, `inside` or `after`) and shows where the node will land.

- `move(ctx)` runs while you hover a target. Return `false` to reject it: the
  pointer shows no-drop and the marker hides. The tree already rejects a drop
  on the node itself or into its own children, so `move` only needs your own
  rules. `ctx` is `{ node, target, position }`.
- `@drag-start` fires with the node when a drag starts.
- `@drag-end` fires when the drag ends, with a `DropInfo` for a finished move
  or `null` for a cancelled one. Apply the move to your data and update
  `nodes`.

```vue
<Tree
  :nodes="nodes"
  node-key="name"
  draggable
  :move="({ target }) => Array.isArray(target.children)"
  @drag-end="onDragEnd"
/>
```

`DropInfo` is `{ node, from, to, position, oldIndex, newIndex }`. `from` and
`to` are the keys of the old and new parents, `null` at the top level.
`newIndex` is the node's final index in its new parent, counted after it was
removed from the old one.

### Disabled

`disabled` stops people from opening, closing and dragging rows.

### Custom rows

`#item-prefix`, `#item-label` and `#item-suffix` fill parts of the default
row. `#item` replaces the whole row and receives `toggle` along with the
row's state.

## Accessibility

The tree follows the WAI-ARIA tree view pattern, with `role="tree"`,
`treeitem` and `group`. Each row reports its level, its position among its
siblings and, for a parent, whether it is open.

| Keys              | Action                                        |
| ----------------- | --------------------------------------------- |
| `ArrowDown` / `ArrowUp`         | Move to the next or previous visible row      |
| `ArrowRight`               | Open the row, or move to its first child      |
| `ArrowLeft`               | Close the row, or move to its parent          |
| `Home` / `End`    | Move to the first or last row                 |
| `Enter` / `Space` | Open or close the row                         |
| Letters           | Move to the next row whose label starts with them |

Drag and drop announces "Picked up", "Moved" and "Cancelled move" to screen
readers.

<!-- @include: ./Tree.api.md -->
