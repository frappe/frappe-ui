<script setup lang="ts">
// The Tree page: the file's six trees (node 35763:137741) as one tree, with
// the file's controller beside it (node 35764:147484) choosing between them
// — the indentation guides (connectors, none, lines) and whether a row's
// hover fill runs the full width or only the row's own box.
//
// The tree is frappe-ui's `Tree`, whose `guides` prop is the file's
// indentation property one for one. What the file draws differently is set
// on top of it in CSS below, measured off the file:
//
//   row        28 tall, every level 24 further in
//   row box    6/8 inside, radius 8, surface-gray-2 under the pointer
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
import type { TreeExposed, TreeNode } from '../../src/components/Tree/types'
import TreeIcon from './TreeIcon.vue'

type Guides = 'connectors' | 'none' | 'lines'
const guides = ref<Guides>('connectors')
const fullWidth = ref(false)

// the file's own words for its three trees: connector, none, line
const guideOptions = [
  { label: 'Connector', value: 'connectors' },
  { label: 'None', value: 'none' },
  { label: 'Line', value: 'lines' },
]

/** The file's own example: a source tree, every folder open. */
const nodes: TreeNode[] = [
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
]

const tree = ref<TreeExposed | null>(null)
const expanded = ref<string[]>([])
onMounted(() => tree.value?.expandAll())
</script>

<template>
  <div class="flex h-full items-center justify-center px-5 py-10">
    <div class="flex items-start gap-10">
      <!--
        The controller (node 35764:147484): 274 wide, 16 inside (13 at the
        foot), radius 16, a 1px outline-gray-1 line; the title at 16/600,
        then 12 to the rows, which are 28 tall and 8 apart — a 14px
        ink-gray-7 label with its control at the right end: a 104px sm
        subtle Select for the guides, a sm Switch for the width.
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
              class="w-[104px]"
              aria-label="Indentation"
            />
          </div>
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Full width</span>
            <Switch v-model="fullWidth" size="sm" aria-label="Full width" />
          </div>
        </div>
      </div>

      <!--
        the tree: 280 wide, as the file draws each of its six. Wrapped, since
        the library's Tree renders more than one root and so never carries
        this page's scope — the styling below reaches it through the wrap.
      -->
      <div
        class="tree-espresso w-[280px]"
        :class="fullWidth && 'is-full-width'"
      >
        <Tree
          ref="tree"
          v-model:expanded="expanded"
          :nodes="nodes"
          :guides="guides"
          node-key="key"
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
                  class="flex size-4 shrink-0 items-center justify-center text-ink-gray-7"
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
    </div>
  </div>
</template>

<style scoped>
.tree-espresso {
  --tree-row-height: 28px;
  --tree-indent: 24px;
}
/* the row is bare: the box inside it, or the row itself, takes the fill */
.tree-espresso :deep(.frappe-tree-row) {
  gap: 0;
  padding: 0;
  border-radius: var(--radius-4);
}
.tree-espresso:not(.is-full-width) :deep(.frappe-tree-row:hover .tree-row-box),
.tree-espresso.is-full-width :deep(.frappe-tree-row:hover) {
  background: var(--surface-gray-2);
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
  with connectors, an arm 12 long on the row's middle. Above the row's fill.
*/
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
