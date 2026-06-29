<template>
  <ul
    ref="treeRef"
    v-bind="$attrs"
    role="tree"
    class="frappe-tree select-none"
    :data-guides="guides"
    @keydown="onKeydown"
    @focusin="onFocusin"
  >
    <TreeItem
      v-for="(node, index) in roots"
      :key="keyOf(node)"
      :node="node"
      :parent="null"
      :level="1"
      :index="index"
      :set-size="roots.length"
    >
      <template v-if="$slots.item" #item="p"
        ><slot name="item" v-bind="p"
      /></template>
      <template v-if="$slots['item-label']" #item-label="p"
        ><slot name="item-label" v-bind="p"
      /></template>
      <template v-if="$slots['item-prefix']" #item-prefix="p"
        ><slot name="item-prefix" v-bind="p"
      /></template>
      <template v-if="$slots['item-suffix']" #item-suffix="p"
        ><slot name="item-suffix" v-bind="p"
      /></template>
    </TreeItem>

    <li v-if="!roots.length" role="none" data-slot="empty">
      <slot name="empty" />
    </li>
  </ul>

  <!-- Floating drag indicator -->
  <Teleport to="body">
    <div
      v-if="dragLabel"
      class="frappe-tree-drag-label pointer-events-none fixed z-[1000] rounded-md bg-surface-gray-7 px-2 py-1 text-xs text-ink-white shadow-lg"
      :style="{
        top: `${dragDrop.state.y + 18}px`,
        left: `${dragDrop.state.x + 12}px`,
      }"
    >
      {{ dragLabel }}
    </div>
  </Teleport>

  <!-- Polite live region for drag/drop announcements -->
  <div class="sr-only" role="status" aria-live="polite">{{ liveMessage }}</div>
</template>

<script setup lang="ts">
import { computed, nextTick, provide, ref, toRef, watch } from 'vue'
import TreeItem from './TreeItem.vue'
import { useTreeDragDrop } from './useTreeDragDrop'
import { useTreeKeyboard, type FlatNode } from './useTreeKeyboard'
import {
  TreeContextKey,
  type DropInfo,
  type TreeKey,
  type TreeNode,
  type TreeNodeSlotProps,
  type TreeProps,
} from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TreeProps>(), {
  nodeKey: 'key',
  draggable: false,
  guides: 'connectors',
  disabled: false,
})

const emit = defineEmits<{
  'drag-start': [node: TreeNode]
  'drag-end': [info: DropInfo | null]
}>()

defineSlots<{
  item: (props: TreeNodeSlotProps) => unknown
  'item-prefix': (props: Omit<TreeNodeSlotProps, 'toggle'>) => unknown
  'item-label': (props: Omit<TreeNodeSlotProps, 'toggle'>) => unknown
  'item-suffix': (props: Omit<TreeNodeSlotProps, 'toggle'>) => unknown
  empty: () => unknown
}>()

/**
 * Expand/collapse-all switch. Toggling it writes that value into every node's
 * `expanded` field. Two-way: it also reflects whether all collapsible nodes are
 * currently open, so a bound button stays in sync. Per-node state lives on the
 * nodes themselves (`node.expanded`).
 */
const expanded = defineModel<boolean>('expanded', { default: false })

const treeRef = ref<HTMLElement | null>(null)
const focusedKey = ref<TreeKey | null>(null)
const liveMessage = ref('')
const itemEls = new Map<TreeKey, HTMLElement>()

// --- node field accessors -------------------------------------------------
const roots = computed(() => props.nodes ?? [])
const keyOf = (node: TreeNode) => node[props.nodeKey] as TreeKey
const labelOf = (node: TreeNode) => node.label ?? ''
const childrenOf = (node: TreeNode) => node.children ?? []
const hasChildren = (node: TreeNode) => childrenOf(node).length > 0
// Siblings of a node: a parent's children, or the roots for top-level nodes.
const siblingsOf = (parent: TreeNode | null) =>
  parent ? childrenOf(parent) : roots.value

// --- expansion ------------------------------------------------------------
// Per-node state lives on the node itself. Expanded by default — a node is only
// closed when it explicitly carries `expanded: false`.
const isExpanded = (node: TreeNode) => node.expanded !== false

function setExpanded(node: TreeNode, value: boolean) {
  if (props.disabled || !hasChildren(node)) return
  node.expanded = value
  syncModel()
}

const toggle = (node: TreeNode) => setExpanded(node, !isExpanded(node))
const expand = (node: TreeNode) => setExpanded(node, true)
const collapse = (node: TreeNode) => setExpanded(node, false)

function eachCollapsible(nodes: TreeNode[], fn: (node: TreeNode) => void) {
  for (const node of nodes) {
    if (hasChildren(node)) {
      fn(node)
      eachCollapsible(childrenOf(node), fn)
    }
  }
}

// Write `value` into every collapsible node's `expanded` field.
function setAll(value: boolean) {
  eachCollapsible(roots.value, (node) => (node.expanded = value))
}

// True when every collapsible node is open (drives the two-way switch).
function allExpanded() {
  let total = 0
  let open = 0
  eachCollapsible(roots.value, (node) => {
    total++
    if (isExpanded(node)) open++
  })
  return total > 0 ? open === total : expanded.value
}

// Reflect the per-node state back onto the switch without re-triggering setAll.
let syncing = false
function syncModel() {
  const all = allExpanded()
  if (expanded.value === all) return
  syncing = true
  expanded.value = all
  syncing = false
}

// --- focus -----------------------------------------------------------------
function focus(key: TreeKey) {
  focusedKey.value = key
  nextTick(() => itemEls.get(key)?.focus())
}

function onFocusin() {
  if (focusedKey.value == null && roots.value.length)
    focusedKey.value = keyOf(roots.value[0])
}

const registerItem = (key: TreeKey, el: HTMLElement) => itemEls.set(key, el)
const unregisterItem = (key: TreeKey) => itemEls.delete(key)

// --- flattened visible list (for keyboard nav) ----------------------------
const flat = computed(() => {
  const out: FlatNode[] = []
  const walk = (
    nodes: TreeNode[],
    parentKey: TreeKey | null,
    level: number,
  ) => {
    for (const node of nodes) {
      const expandedNow = isExpanded(node)
      out.push({
        key: keyOf(node),
        node,
        parentKey,
        level,
        hasChildren: hasChildren(node),
        expanded: expandedNow,
      })
      if (expandedNow && hasChildren(node))
        walk(childrenOf(node), keyOf(node), level + 1)
    }
  }
  walk(roots.value, null, 1)
  return out
})

// --- drag & drop ----------------------------------------------------------
const dragDrop = useTreeDragDrop({
  keyOf,
  childrenOf,
  siblingsOf,
  labelOf,
  disabled: toRef(props, 'disabled'),
  move: (ctx) => props.move?.(ctx) ?? true,
  emitDragStart: (node) => emit('drag-start', node),
  emitDragEnd: (info) => emit('drag-end', info),
  announce: (message) => (liveMessage.value = message),
})

const dragLabel = computed(() => {
  const { state } = dragDrop
  const position = dragDrop.dropPosition.value
  if (!state.source || !state.target || !position) return null
  const target = labelOf(state.target)
  return position === 'inside'
    ? `Move under ${target}`
    : `Move ${position} ${target}`
})

// --- keyboard -------------------------------------------------------------
const { onKeydown } = useTreeKeyboard({
  flat,
  focusedKey,
  labelOf,
  focus,
  expand,
  collapse,
  toggle,
})

// --- lifecycle ------------------------------------------------------------
// The switch applies to every node when toggled. Skip the initial `false` so a
// tree's per-node `expanded` data is respected on first render.
watch(
  expanded,
  (value, old) => {
    if (syncing) return
    if (old === undefined && value === false) return
    setAll(value)
  },
  { immediate: true, flush: 'sync' },
)

// Keep the switch reflecting the real per-node state, including initial data
// and async-loaded nodes.
watch(roots, syncModel, { immediate: true })

// Keep focus valid if the focused node disappears from the tree.
watch(flat, (rows) => {
  if (focusedKey.value != null && !rows.some((r) => r.key === focusedKey.value))
    focusedKey.value = rows[0]?.key ?? null
})

// --- provide context ------------------------------------------------------
provide(TreeContextKey, {
  nodeKey: toRef(props, 'nodeKey'),
  guides: toRef(props, 'guides'),
  draggable: toRef(props, 'draggable'),
  disabled: toRef(props, 'disabled'),
  focusedKey,
  keyOf,
  labelOf,
  childrenOf,
  hasChildren,
  isExpanded,
  toggle,
  focus,
  registerItem,
  unregisterItem,
  dragSourceKey: dragDrop.dragSourceKey,
  dropTargetKey: dragDrop.dropTargetKey,
  dropPosition: dragDrop.dropPosition,
  onDragStart: dragDrop.onDragStart,
  onDragOver: dragDrop.onDragOver,
  onDragLeave: dragDrop.onDragLeave,
  onDrop: dragDrop.onDrop,
  onDragEnd: dragDrop.onDragEnd,
})
</script>

<style>
.frappe-tree {
  --_tree-row-height: var(--tree-row-height, 32px);
  --_tree-indent: var(--tree-indent, 24px);
  padding: 0;
}
.frappe-tree,
.frappe-tree ul {
  list-style: none;
  margin: 0;
}
</style>
