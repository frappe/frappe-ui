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
  defaultExpanded: false,
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

const expanded = defineModel<TreeKey[]>('expanded', { default: () => [] })

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
const expandedSet = computed(() => new Set(expanded.value))
const isExpanded = (node: TreeNode) => expandedSet.value.has(keyOf(node))

function setExpanded(node: TreeNode, value: boolean) {
  if (props.disabled || !hasChildren(node)) return
  const key = keyOf(node)
  const next = new Set(expanded.value)
  value ? next.add(key) : next.delete(key)
  expanded.value = [...next]
}

const toggle = (node: TreeNode) => setExpanded(node, !isExpanded(node))
const expand = (node: TreeNode) => setExpanded(node, true)
const collapse = (node: TreeNode) => setExpanded(node, false)

function collectCollapsibleKeys(nodes: TreeNode[], acc: TreeKey[] = []) {
  for (const node of nodes) {
    if (hasChildren(node)) {
      acc.push(keyOf(node))
      collectCollapsibleKeys(childrenOf(node), acc)
    }
  }
  return acc
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
// Seed once, on the first non-empty roots — so async-loaded nodes still expand.
let seeded = false
watch(
  roots,
  (r) => {
    if (seeded || !props.defaultExpanded || !r.length) return
    if (expanded.value.length === 0) expanded.value = collectCollapsibleKeys(r)
    seeded = true
  },
  { immediate: true },
)

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
