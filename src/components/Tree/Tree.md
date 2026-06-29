# Tree

Displays hierarchical data as a collapsible tree. Renders a forest of roots with
keyboard navigation and optional drag-and-drop reparenting/reordering. Connector
guides visually link parents to their children.

## Default

The simplest tree — pass `nodes` and tell it which field is the key. Nodes are
expanded by default; here **Documents** carries `expanded: false` to start
collapsed.

<ComponentPreview name="Tree-Example" />

## Expand / collapse all

Bind `v-model:expanded` to a boolean for a master switch — toggling it opens or
closes every node. It's two-way, so it also reflects whether all nodes are
currently open as the user toggles rows individually.

<ComponentPreview name="Tree-ExpandAll" />

## Indentation guides

`guides` controls how nesting is drawn: `connectors` (elbow lines), `lines`
(plain vertical rules), or `none`. The indentation itself stays either way —
`guides` only changes the lines.

<ComponentPreview name="Tree-Guides" />

## Drag and drop

Set `draggable` to let nodes be dragged onto one another to reparent, or between
siblings to reorder. A `move` predicate gates where drops are allowed (here,
only into folders), and `@drag-end` hands you the committed move to persist.
This example is fully working — drag a file into a folder and it stays there.
Flip **Disable interaction** to see the `disabled` state freeze drag and
expand/collapse.

<ComponentPreview name="Tree-DragDrop" />

## List view with avatars and row actions

Use the `#item-prefix`, `#item-label`, and `#item-suffix` slots to turn the tree
into a rich list — an avatar on the left, a two-line label, and a row action (an
add button) on the right. `guides="none"` drops the connector lines for a plain
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
</script>

<template>
  <Tree :nodes="nodes" node-key="name" />
</template>
```

## Node shape

Each node is a plain object with a `label` (display text) and optional
`children`. Its unique id lives under the field named by `nodeKey` (e.g.
`name`). A node is a leaf when `children` is missing or empty. Extra fields are
passed through to the slots, so you can render avatars, roles, badges, etc.

To display a field other than `label`, use the `#item-label` slot rather than
remapping.

## Expansion

Each node owns its own state via an `expanded` field — the source of truth the
tree reads and writes as rows toggle, so expansion travels with your data. Nodes
are **expanded by default**; set `expanded: false` to start one collapsed.

`v-model:expanded` is a separate, optional boolean **switch** for the whole
tree: toggle it to open or close everything at once (see
[Expand / collapse all](#expand-collapse-all)). It's two-way, reflecting whether
all nodes are currently open.

Clicking a row, or pressing `Enter`/`Space` on it, toggles that node.

## Keyboard

Following the WAI-ARIA Tree View pattern: `↑`/`↓` move between visible rows, `→`
expands or steps into children, `←` collapses or steps to the parent,
`Home`/`End` jump to the first/last row, `Enter`/`Space` toggle expansion, and
typing letters jumps to the next matching label.

## Drag and drop

Set `draggable` to enable dragging. The tree resolves the drop position from the
cursor (`before` / `inside` / `after`) and shows a live indicator.

- `move(ctx)` — an optional predicate called as you hover. Return `false` to
  reject a target (it shows the no-drop cursor and hides the indicator).
  Built-in guards already reject drop-on-self and drop-into-own-descendant, so
  `move` only carries your domain rules. `ctx` is `{ node, target, position }`.
- `@drag-start(node)` — fires when a drag is picked up.
- `@drag-end(info)` — fires when the drag ends. `info` is a `DropInfo` on a
  committed move, or `null` if the drag was cancelled. Apply it to your data and
  update `nodes`.

```vue
<Tree
  :nodes="nodes"
  node-key="name"
  draggable
  :move="({ node, target, position }) => Array.isArray(target.children)"
  @drag-end="onDragEnd"
/>
```

`DropInfo` is `{ node, from, to, position, oldIndex, newIndex }` — `from`/`to`
are the old/new parent keys (`null` at root level) and `newIndex` is the node's
final index within its new parent, already accounting for its removal.

## Customizing rows

Use the `#item` slot to fully replace a row (you receive `toggle` plus state),
or the lighter `#item-label`, `#item-prefix`, and `#item-suffix` slots to keep
the default layout. Style via the `data-slot`, `data-state`, `data-drop` and
`data-level` attributes rather than class props.

Row height and indentation are CSS variables — override them in CSS rather than
through props:

```css
.my-tree {
  --tree-row-height: 40px;
  --tree-indent: 24px;
}
```

<!-- @include: ./Tree.api.md -->
