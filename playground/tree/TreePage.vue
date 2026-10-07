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
// An Example select swaps the tree: Default is the file's source tree; Layers
// is the file's second tree (node 35800:160601), where every row carries a
// prefix — a 16px glyph for what the layer is, 4 after the chevron's place
// and 4 before the label, in the chevron's ink-gray-7 — and a leaf still
// keeps the chevron's 16. There each level steps in by 20, the width of one
// place in the row (16 + 4), so a child's chevron stands under its parent's
// glyph and its glyph under its parent's label — the columns the user asked
// for (the file's own 24 leaves them 4 apart). The file shows that one at
// 320 wide with no guides and full-width rows, and gives
// its first row a hint: a 13px ink-gray-4 note at the row's far end. On the
// source tree a hint is a file's size; a folder has none. Hierarchy is the
// file's third tree (node 35807:125292): a team, 500 wide, a 1px
// outline-gray-1 divider between rows (so rows sit 29 apart), no guides,
// the hover fill the full row, a 16px dot where a leaf has no chevron, the
// drag grip in the chevron's place on a hovered row when rows can be
// dragged, and a suffix on a group row: the file's "+ Assign", a sm ghost
// Button at the row's right end. The Suffix switch is on for that example.
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
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { Button, Select, Switch, Tree } from '../../src'
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
const hint = ref(false)
const suffix = ref(false)

type Example = 'default' | 'layers' | 'hierarchy'
const EXAMPLES: Example[] = ['default', 'layers', 'hierarchy']
// `?example=hierarchy` opens the page on that example
const fromUrl = new URLSearchParams(window.location.search).get('example')
const example = ref<Example>(
  EXAMPLES.includes(fromUrl as Example) ? (fromUrl as Example) : 'default',
)
const exampleOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Layers', value: 'layers' },
  { label: 'Hierarchy', value: 'hierarchy' },
]

/**
 * The file's hierarchy tree (node 35807:125292): a sales team. A group row
 * (the ones with a count) carries the file's suffix, the Assign button; the
 * people under a lead are folded in the file, so each keeps a report to
 * open; the members at the end are leaves, drawn with a dot.
 */
const hierarchyNodes = ref<TreeNode[]>([
  {
    key: 'sales-manager',
    label: 'Sales Manager (2)',
    suffix: 'Assign',
    children: [
      {
        key: 'faris',
        label: 'Faris Ansari',
        children: [{ key: 'faris-1', label: 'Aarav Mehta' }],
      },
      {
        key: 'rushabh',
        label: 'Rushabh',
        children: [
          {
            key: 'sales-lead',
            label: 'Sales Lead',
            suffix: 'Assign',
            children: [
              {
                key: 'michelle',
                label: 'Michelle Alwa',
                children: [{ key: 'michelle-1', label: 'Ishita Rao' }],
              },
              {
                key: 'ritvik',
                label: 'Ritvik Sardana',
                children: [{ key: 'ritvik-1', label: 'Dev Kapoor' }],
              },
              {
                key: 'shariq',
                label: 'Shariq Ansari',
                children: [{ key: 'shariq-1', label: 'Meera Nair' }],
              },
              {
                key: 'rahul',
                label: 'Rahul Patel',
                children: [{ key: 'rahul-1', label: 'Kabir Shah' }],
              },
              {
                key: 'sales-members',
                label: 'Sales Members (3)',
                suffix: 'Assign',
                children: [
                  { key: 'member-1', label: 'Ritvik Sardana' },
                  { key: 'member-2', label: 'Shariq Ansari' },
                  { key: 'member-3', label: 'Jannet Patel' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
])
/** The rows the file shows open in the hierarchy; the rest stay folded. */
const hierarchyOpen = [
  'sales-manager',
  'rushabh',
  'sales-lead',
  'sales-members',
]

/**
 * The file's layers tree (node 35800:160601): each layer's kind is the
 * glyph before its name — the frame (`single-body`), a container (`square`),
 * a component (the cube), a text (`text`), an image (`image`), all from the
 * icon set — and the first row carries the file's note.
 */
const layerNodes = ref<TreeNode[]>([
  {
    key: 'body',
    label: 'Body',
    glyph: 'single-body',
    hint: 'Desktop',
    children: [{ key: 'navigation', label: 'Navigation', glyph: 'component' }],
  },
  {
    key: 'container-1',
    label: 'Container',
    glyph: 'square',
    children: [
      {
        key: 'container-1-1',
        label: 'Container',
        glyph: 'square',
        children: [
          { key: 'text-1', label: 'Text 1', glyph: 'text' },
          { key: 'text-2', label: 'Text 2', glyph: 'text' },
          { key: 'button-1', label: 'Button', glyph: 'component' },
          { key: 'button-2', label: 'Button', glyph: 'component' },
        ],
      },
      { key: 'image-1', label: 'Image', glyph: 'image' },
    ],
  },
  {
    key: 'container-2',
    label: 'Container',
    glyph: 'square',
    children: [
      { key: 'text-3', label: 'Text 3', glyph: 'text' },
      { key: 'image-2', label: 'Image', glyph: 'image' },
    ],
  },
  {
    key: 'container-3',
    label: 'Container',
    glyph: 'square',
    children: [
      {
        key: 'container-3-1',
        label: 'Container',
        glyph: 'square',
        children: [
          { key: 'container-3-1-1', label: 'Container', glyph: 'square' },
        ],
      },
      { key: 'image-3', label: 'Image', glyph: 'image' },
    ],
  },
])

/** The row's hint: the file's own on a layer, a size on a file, else none. */
const hintFor = (node: TreeNode) => String(node.hint ?? node.size ?? '')

// the file's own words for its three trees: connector, none, line
const guideOptions = [
  { label: 'Connector', value: 'connectors' },
  { label: 'None', value: 'none' },
  { label: 'Line', value: 'lines' },
]

/** The file's first example: a source tree, every folder open. */
const sourceNodes = ref<TreeNode[]>([
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
                          { key: 'blank', size: '1.2 KB', label: 'blank.tsx' },
                          { key: 'elbow', size: '1.4 KB', label: 'elbow.tsx' },
                        ],
                      },
                      { key: 'index', size: '0.3 KB', label: 'index.ts' },
                    ],
                  },
                  { key: 'tree-tsx', size: '6.8 KB', label: 'tree.tsx' },
                ],
              },
              { key: 'utils', size: '2.1 KB', label: 'utils.ts' },
            ],
          },
          { key: 'main', size: '0.9 KB', label: 'main.tsx' },
        ],
      },
      {
        key: 'assets',
        label: 'assets',
        children: [
          { key: 'logo', size: '4.0 KB', label: 'logo.svg' },
          { key: 'icon', size: '1.1 KB', label: 'icon.svg' },
          { key: 'cover', size: '212 KB', label: 'cover.png' },
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
const nodes = computed(() =>
  example.value === 'layers'
    ? layerNodes.value
    : example.value === 'hierarchy'
      ? hierarchyNodes.value
      : sourceNodes.value,
)
/**
 * The tree's width: the file draws the source tree 280 wide, the layers 320
 * and the hierarchy 500. The box around it stays 500x476 — the largest of
 * the three either way — so neither a fold nor a change of example moves
 * anything.
 */
const treeWidth = computed(
  () =>
    ({ default: '280px', layers: '320px', hierarchy: '500px' })[example.value],
)
/** A level's step: the file's 24 on the source tree; one row place, 20, on the layers. */
const indent = computed(() => (example.value === 'layers' ? 20 : 24))
watch(example, applyExample)
/** What switching example sets up, beyond the nodes. */
function applyExample(now: Example) {
  if (now === 'hierarchy') {
    // the file shows this one without guides — and it never takes any, so
    // the Indentation select stays on None and is disabled (the user's call
    // 2026-10-07) — the fill the whole row, and with its suffix; its folded
    // rows stay folded
    guides.value = 'none'
    fullWidth.value = true
    suffix.value = true
    expanded.value = [...hierarchyOpen]
  } else {
    suffix.value = false
    nextTick(() => tree.value?.expandAll())
  }
}

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
onMounted(() => applyExample(example.value))
</script>

<template>
  <!-- centred on the pair's constant size: the tree's box is always 500x476,
       so a fold, or another example, happens inside it and the pair stays put -->
  <div class="flex h-full items-center justify-center px-5 py-10">
    <div class="flex items-start gap-10">
      <!--
        the tree: 280 wide, as the file draws each of its six. Wrapped, since
        the library's Tree renders more than one root and so never carries
        this page's scope — the styling below reaches it through the wrap.
      -->
      <div
        class="tree-espresso h-[476px] w-[500px]"
        :class="[
          fullWidth && 'is-full-width',
          example === 'hierarchy' && 'is-hierarchy',
        ]"
        :style="{ '--tree-width': treeWidth, '--tree-indent': `${indent}px` }"
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
              :style="{ paddingLeft: `${(level - 1) * indent}px` }"
            >
              <span
                class="tree-row-box flex h-7 min-w-0 flex-1 items-center gap-1 rounded-4 px-2"
              >
                <!-- the chevron's place: the chevron, a dot on a hierarchy's
                     leaf, else blank; the grip takes it over on a hovered row
                     that can be dragged (hierarchy only, as the file shows) -->
                <span
                  class="tree-row-place relative flex size-4 shrink-0 items-center justify-center text-ink-gray-7"
                >
                  <button
                    v-if="hasChildren"
                    type="button"
                    class="tree-row-mark flex size-4 items-center justify-center outline-none"
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
                  <TreeIcon
                    v-else-if="example === 'hierarchy'"
                    name="dot"
                    class="tree-row-mark size-4"
                  />
                  <TreeIcon
                    v-if="example === 'hierarchy' && draggable"
                    name="drag-vertical"
                    class="tree-row-grip absolute inset-0 size-4"
                  />
                </span>
                <TreeIcon
                  v-if="node.glyph"
                  data-slot="prefix-glyph"
                  :name="String(node.glyph)"
                  class="size-4 text-ink-gray-7"
                />
                <!-- the label gives way, with an ellipsis, before the note does -->
                <span
                  class="min-w-0 flex-1 truncate text-base text-ink-gray-6"
                  >{{ node.label }}</span
                >
                <span
                  v-if="hint && hintFor(node)"
                  data-slot="hint"
                  class="ml-auto shrink-0 pl-2 text-sm text-ink-gray-4"
                  >{{ hintFor(node) }}</span
                >
                <!-- the suffix: the file's "+ Assign", a sm ghost Button
                     flush with the row's right padding -->
                <Button
                  v-if="suffix && node.suffix"
                  data-slot="suffix"
                  size="sm"
                  variant="ghost"
                  class="ml-auto shrink-0 !text-ink-gray-7"
                  @click.stop
                >
                  <template #prefix>
                    <TreeIcon name="add" class="size-4" />
                  </template>
                  {{ node.suffix }}
                </Button>
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
            <span class="text-base text-ink-gray-7">Example</span>
            <Select
              v-model="example"
              :options="exampleOptions"
              size="sm"
              variant="subtle"
              class="w-[120px]"
              aria-label="Example"
            />
          </div>
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Indentation</span>
            <Select
              v-model="guides"
              :options="guideOptions"
              size="sm"
              variant="subtle"
              class="w-[120px]"
              aria-label="Indentation"
              :disabled="example === 'hierarchy'"
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
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Hint</span>
            <Switch v-model="hint" size="sm" aria-label="Hint" />
          </div>
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Suffix</span>
            <Switch v-model="suffix" size="sm" aria-label="Suffix" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tree-espresso {
  --tree-row-height: 28px;
}
/* the tree itself is the file's width inside the constant box */
.tree-espresso :deep(.frappe-tree) {
  width: var(--tree-width);
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

/* the hierarchy: a 1px outline-gray-1 divider over every row but the
   first — a straight line the tree's whole width, drawn in the 1px gap
   above the row (not on the row itself, whose corners are round), so rows
   sit 29 apart; a hovered row's fill covers the line above it and the one
   below (the file draws the fill over both) */
.tree-espresso.is-hierarchy :deep(.frappe-tree-row) {
  position: relative;
  margin-top: 1px;
}
.tree-espresso.is-hierarchy :deep(.frappe-tree-row::before) {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: -1px;
  height: 1px;
  background: var(--outline-gray-1);
}
.tree-espresso.is-hierarchy
  :deep(.frappe-tree > li:first-child > .frappe-tree-row) {
  margin-top: 0;
}
.tree-espresso.is-hierarchy
  :deep(.frappe-tree > li:first-child > .frappe-tree-row::before),
.tree-espresso.is-hierarchy
  :deep(li:not([data-disabled]) > .frappe-tree-row:hover::before),
.tree-espresso.is-hierarchy
  :deep(li:has(> .frappe-tree-row:hover) + li > .frappe-tree-row::before),
.tree-espresso.is-hierarchy
  :deep(
    li:has(> .frappe-tree-row:hover)
      > [role='group']
      > li:first-child
      > .frappe-tree-row::before
  ) {
  content: none;
}
/* the grip: hidden until the row is hovered, then in the chevron's place */
.tree-espresso :deep(.tree-row-grip) {
  display: none;
}
.tree-espresso
  :deep(li:not([data-disabled]) > .frappe-tree-row:hover .tree-row-grip) {
  display: block;
}
.tree-espresso
  :deep(
    li:not([data-disabled])
      > .frappe-tree-row:hover
      .tree-row-place:has(.tree-row-grip)
      .tree-row-mark
  ) {
  visibility: hidden;
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
  stem (N-2) steps + 16 in — under the middle of its parent's chevron — and,
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
  left: calc(var(--_tree-indent) * 0 + 16px);
}
.tree-espresso :deep(li[data-level='3']::before),
.tree-espresso :deep(li[data-level='3']::after) {
  left: calc(var(--_tree-indent) * 1 + 16px);
}
.tree-espresso :deep(li[data-level='4']::before),
.tree-espresso :deep(li[data-level='4']::after) {
  left: calc(var(--_tree-indent) * 2 + 16px);
}
.tree-espresso :deep(li[data-level='5']::before),
.tree-espresso :deep(li[data-level='5']::after) {
  left: calc(var(--_tree-indent) * 3 + 16px);
}
.tree-espresso :deep(li[data-level='6']::before),
.tree-espresso :deep(li[data-level='6']::after) {
  left: calc(var(--_tree-indent) * 4 + 16px);
}
.tree-espresso :deep(li[data-level='7']::before),
.tree-espresso :deep(li[data-level='7']::after) {
  left: calc(var(--_tree-indent) * 5 + 16px);
}
.tree-espresso :deep(li[data-level='8']::before),
.tree-espresso :deep(li[data-level='8']::after) {
  left: calc(var(--_tree-indent) * 6 + 16px);
}
</style>
