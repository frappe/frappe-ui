<script setup lang="ts">
// The Tree page: the file's six trees (node 35763:137741) as one tree, with
// the file's controller beside it (node 35764:147484) choosing between them
// — the indentation guides (connectors, none, lines) and whether a row's
// hover fill runs the full width or only the row's own box — plus two the
// user added: whether rows can be dragged into a new place, and the tree
// disabled. The tree stands on the left and the controller on the right,
// the pair centred on the page — on the tree's full height, the file's 476,
// which the tree's box keeps whether its folders are open or not, so a fold
// changes what is drawn inside the box and moves nothing.
//
// The row's states are the item set's (node 34717:49031): hover on
// surface-gray-2, pressed on surface-gray-3, focus white inside a 2px
// outline-gray-3 ring, disabled at half opacity.
//
// The tree is frappe-ui's `Tree`, whose `guides` prop is the file's
// indentation property one for one. What the file draws differently is set
// on top of it in CSS below, measured off the file:
//
//   row        28 tall, every level 24 further in
//   row box    6/8 inside, radius 8; the states above on the box, or on
//              the whole row when full width
//   contents   a 16px chevron (the file's small-right-chevron, turned down
//              when open; a 16px blank where a leaf has none), 4, the label
//              at 14 in ink-gray-6; the chevron in ink-gray-7
//   guides     1px outline-gray-1, the stem 16 in from the level's left
//              edge, the arm 12 long on the row's middle; an elbow stops
//              its stem at the arm. "Lines" is the stem alone, the whole
//              way down; "none" is nothing.
//
// The library indents by padding the nested lists, which puts the row's box
// — and so its hover fill — after the indent. The file's full-width row
// fills from the tree's left edge, so the indent is moved inside the row
// (the `#item` slot knows its level) and the guides are drawn from the
// tree's left edge, level by level, above the fill.
import { onMounted, ref } from 'vue'
import { Select, Switch, Tree } from '../../src'
import type {
  DropInfo,
  TreeExposed,
  TreeKey,
  TreeNode,
} from '../../src/components/Tree/types'
import TreeIcon from './TreeIcon.vue'

type Guides = 'connectors' | 'none' | 'lines'
const guides = ref<Guides>('connectors')
const fullWidth = ref(false)
const draggable = ref(false)
const disabled = ref(false)

// the file's own words for its three trees: connector, none, line
const guideOptions = [
  { label: 'Connector', value: 'connectors' },
  { label: 'None', value: 'none' },
  { label: 'Line', value: 'lines' },
]

/** The file's own example: a source tree, every folder open. */
const nodes = ref<TreeNode[]>([
  {
    key: 'src',
    label: 'src',
    children: [
      {
        key: 'app',
        label: 'app',
        children: [
          {
            key: 'components',
            label: 'components',
            children: [
              {
                key: 'tree',
                label: 'tree',
                children: [
                  {
                    key: 'parts',
                    label: 'parts',
                    children: [
                      {
                        key: 'guides',
                        label: 'guides',
                        children: [
                          { key: 'blank', label: 'blank.tsx' },
                          { key: 'elbow', label: 'elbow.tsx' },
                        ],
                      },
                      { key: 'index', label: 'index.ts' },
                    ],
                  },
                  { key: 'tree-tsx', label: 'tree.tsx' },
                ],
              },
              { key: 'utils', label: 'utils.ts' },
            ],
          },
          { key: 'main', label: 'main.tsx' },
        ],
      },
      {
        key: 'assets',
        label: 'assets',
        children: [
          { key: 'logo', label: 'logo.svg' },
          { key: 'icon', label: 'icon.svg' },
          { key: 'cover', label: 'cover.png' },
        ],
      },
      { key: 'assets-root', label: 'assets' },
    ],
  },
])

/**
 * A drop, applied. The library never writes to the nodes it is given: it
 * says what moved where (`DropInfo`), and the page moves it — out of its
 * old parent, into the new one (or the roots) at the index the drop asked
 * for. The library's own guards (not onto itself, not into its own
 * descendants) have run by then.
 */
function parentOf(
  key: TreeKey | null,
  list: TreeNode[] = nodes.value,
): TreeNode[] | null {
  if (key === null) return nodes.value
  for (const n of list) {
    if (n.key === key) return (n.children ??= [])
    const found = n.children && parentOf(key, n.children)
    if (found) return found
  }
  return null
}
function onDrop(info: DropInfo | null) {
  if (!info) return
  const from = parentOf(info.from)
  const to = parentOf(info.to)
  if (!from || !to) return
  const i = from.findIndex((n) => n.key === info.node.key)
  if (i < 0) return
  const [moved] = from.splice(i, 1)
  to.splice(Math.min(info.newIndex, to.length), 0, moved)
  if (info.to !== null && !expanded.value.includes(info.to as string))
    expanded.value = [...expanded.value, info.to as string]
}

const tree = ref<TreeExposed | null>(null)
const expanded = ref<string[]>([])
onMounted(() => tree.value?.expandAll())
</script>

<template>
  <!-- centred on the pair's constant height: the tree's box is always its
       full 476, so a fold happens inside it and the pair stays put -->
  <div class="flex h-full items-center justify-center px-5 py-10">
    <div class="flex items-start gap-10">
      <!--
        the tree: 280 wide, as the file draws each of its six. Wrapped, since
        the library's Tree renders more than one root and so never carries
        this page's scope — the styling below reaches it through the wrap.
      -->
      <div
        class="tree-espresso h-[476px] w-[280px]"
        :class="fullWidth && 'is-full-width'"
      >
        <Tree
          ref="tree"
          v-model:expanded="expanded"
          :nodes="nodes"
          :guides="guides"
          :draggable="draggable"
          :disabled="disabled"
          node-key="key"
          @drag-end="onDrop"
        >
          <template
            #item="{ node, level, expanded: open, hasChildren, toggle }"
          >
            <!-- the indent lives in the row, so the row's box is the full row -->
            <span
              class="flex h-7 min-w-0 flex-1 items-center"
              :style="{ paddingLeft: `${(level - 1) * 24}px` }"
            >
              <span
                class="tree-row-box flex h-7 min-w-0 flex-1 items-center gap-1 rounded-4 px-2"
              >
                <button
                  v-if="hasChildren"
                  type="button"
                  class="flex size-4 shrink-0 items-center justify-center text-ink-gray-7 outline-none"
                  :aria-label="open ? 'Collapse' : 'Expand'"
                  tabindex="-1"
                  @click.stop="toggle()"
                >
                  <TreeIcon
                    name="small-right-chevron"
                    class="size-4 transition-transform duration-150"
                    :class="open && 'rotate-90'"
                  />
                </button>
                <span v-else class="size-4 shrink-0" aria-hidden="true" />
                <span class="truncate text-base text-ink-gray-6">{{
                  node.label
                }}</span>
              </span>
            </span>
          </template>
        </Tree>
      </div>
      <!--
        The controller (node 35764:147484): 274 wide, 16 inside (13 at the
        foot), radius 16, a 1px outline-gray-1 line; the title at 16/600,
        then 12 to the rows, which are 28 tall and 8 apart — a 14px
        ink-gray-7 label with its control at the right end: a sm subtle
        Select for the guides (wide enough for its longest word — the file's
        104 cropped "Connector"), a sm Switch for the rest.
      -->
      <div
        class="flex w-[274px] shrink-0 flex-col gap-3 rounded-7 border border-outline-gray-1 bg-surface-elevation-2 px-4 pb-[13px] pt-4"
      >
        <p class="text-lg-semibold leading-[1.15] text-ink-gray-9">Tree</p>
        <div class="flex flex-col gap-2">
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Indentation</span>
            <Select
              v-model="guides"
              :options="guideOptions"
              size="sm"
              variant="subtle"
              class="w-[120px]"
              aria-label="Indentation"
            />
          </div>
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Full width</span>
            <Switch v-model="fullWidth" size="sm" aria-label="Full width" />
          </div>
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Draggable</span>
            <Switch v-model="draggable" size="sm" aria-label="Draggable" />
          </div>
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Disabled</span>
            <Switch v-model="disabled" size="sm" aria-label="Disabled" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tree-espresso {
  --tree-row-height: 28px;
  --tree-indent: 24px;
}
/* the row is bare: the box inside it, or the row itself, carries the
   states — hover surface-gray-2, pressed surface-gray-3, focus white in a
   2px outline-gray-3 ring (the item set, node 34717:49031) */
.tree-espresso :deep(.frappe-tree-row) {
  gap: 0;
  padding: 0;
  border-radius: var(--radius-4);
  transition: background-color 75ms;
}
.tree-espresso :deep(.tree-row-box) {
  transition:
    background-color 75ms,
    box-shadow 75ms;
}
.tree-espresso:not(.is-full-width)
  :deep(li:not([data-disabled]) > .frappe-tree-row:hover .tree-row-box),
.tree-espresso.is-full-width
  :deep(li:not([data-disabled]) > .frappe-tree-row:hover) {
  background: var(--surface-gray-2);
}
.tree-espresso:not(.is-full-width)
  :deep(li:not([data-disabled]) > .frappe-tree-row:active .tree-row-box),
.tree-espresso.is-full-width
  :deep(li:not([data-disabled]) > .frappe-tree-row:active) {
  background: var(--surface-gray-3);
}
/* the keyboard's focus: the ring on the box, never the browser's outline
   on the list item */
.tree-espresso :deep(li[role='treeitem']) {
  outline: none;
}
.tree-espresso:not(.is-full-width)
  :deep(li:focus-visible > .frappe-tree-row .tree-row-box),
.tree-espresso.is-full-width :deep(li:focus-visible > .frappe-tree-row) {
  background: var(--surface-elevation-1);
  box-shadow: 0 0 0 2px var(--outline-gray-3);
}
/* while dragging, the library floats a "Move above …" label by the
   pointer; the blue line already says where the row will land, so the
   label goes (the screen-reader announcement stays) */
.tree-espresso :deep(.frappe-tree-drag-label) {
  display: none;
}

/* disabled: the box at half opacity, nothing under the pointer */
.tree-espresso :deep(li[data-disabled] > .frappe-tree-row) {
  opacity: 0.5;
  cursor: default;
}

/* the indent is in the row now, not on the nested lists */
.tree-espresso :deep([role='group']) {
  margin-left: 0 !important;
  padding-left: 0 !important;
  border-left: 0 !important;
}

/*
  The guides, drawn from the tree's left edge: a child at level N keeps its
  stem (N-2)*24 + 16 in — under the middle of its parent's chevron — and,
  with connectors, an arm 12 long on the row's middle. The arm runs 4 into
  the row's box, and the box paints over it (the file draws the box after
  the guides), so a hovered row covers the arm's end; the full-width fill
  is the row behind everything, so there the guides stay on top.
*/
.tree-espresso:not(.is-full-width) :deep(.tree-row-box) {
  position: relative;
  z-index: 2;
}
.tree-espresso :deep([role='group'] > li) {
  position: relative;
}
.tree-espresso :deep([role='group'] > li::before),
.tree-espresso :deep([role='group'] > li::after) {
  content: none;
  z-index: 1;
  border-color: var(--outline-gray-1);
  border-radius: 0;
}
.tree-espresso
  :deep(.frappe-tree[data-guides='connectors'] [role='group'] > li::before),
.tree-espresso
  :deep(.frappe-tree[data-guides='lines'] [role='group'] > li::before) {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  height: auto;
  width: 0;
  border-left: 1px solid var(--outline-gray-1);
  border-bottom: 0;
}
.tree-espresso
  :deep(.frappe-tree[data-guides='connectors'] [role='group'] > li::after) {
  content: '';
  position: absolute;
  top: 14px;
  width: 12px;
  border-top: 1px solid var(--outline-gray-1);
}
/* an elbow: the last child's stem stops on the arm (15 tall, 14 + the arm) */
.tree-espresso
  :deep(
    .frappe-tree[data-guides='connectors']
      [role='group']
      > li:last-child::before
  ) {
  bottom: auto;
  height: 15px;
}
.tree-espresso :deep(li[data-level='2']::before),
.tree-espresso :deep(li[data-level='2']::after) {
  left: 16px;
}
.tree-espresso :deep(li[data-level='3']::before),
.tree-espresso :deep(li[data-level='3']::after) {
  left: 40px;
}
.tree-espresso :deep(li[data-level='4']::before),
.tree-espresso :deep(li[data-level='4']::after) {
  left: 64px;
}
.tree-espresso :deep(li[data-level='5']::before),
.tree-espresso :deep(li[data-level='5']::after) {
  left: 88px;
}
.tree-espresso :deep(li[data-level='6']::before),
.tree-espresso :deep(li[data-level='6']::after) {
  left: 112px;
}
.tree-espresso :deep(li[data-level='7']::before),
.tree-espresso :deep(li[data-level='7']::after) {
  left: 136px;
}
.tree-espresso :deep(li[data-level='8']::before),
.tree-espresso :deep(li[data-level='8']::after) {
  left: 160px;
}
</style>
