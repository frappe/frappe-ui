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
  <Teleport :to="portalTarget ?? 'body'">
    <div
      v-if="dragLabel"
      class="frappe-tree-drag-label pointer-events-none fixed z-[1000] rounded-5 bg-surface-gray-7 px-2 py-1 text-xs text-ink-white shadow-lg"
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
import type { WatchStopHandle } from 'vue'
import TreeItem from './TreeItem.vue'
import { useTreeDragDrop } from './useTreeDragDrop'
import { usePortalTarget } from '../../composables/usePortalTarget'
import { warnOnce, warnRemoved } from '../../utils/warnDeprecated'
import { useTreeKeyboard, type FlatNode } from './useTreeKeyboard'
import {
  TreeContextKey,
  type DropInfo,
  type TreeExposed,
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

const portalTarget = usePortalTarget()

const emit = defineEmits<{
  /** Fired when a drag is picked up. */
  'drag-start': [node: TreeNode]
  /** Fired when a drag ends: the committed move, or `null` if it was cancelled. */
  'drag-end': [info: DropInfo | null]
}>()

defineSlots<{
  /** Fully replaces a row's default rendering — receives `toggle` plus node state. */
  item: (props: TreeNodeSlotProps) => unknown
  /** Leading content before the label, inside the default row layout. */
  'item-prefix': (props: Omit<TreeNodeSlotProps, 'toggle'>) => unknown
  /** Overrides the row's label text, inside the default row layout. */
  'item-label': (props: Omit<TreeNodeSlotProps, 'toggle'>) => unknown
  /** Trailing content after the label, inside the default row layout. */
  'item-suffix': (props: Omit<TreeNodeSlotProps, 'toggle'>) => unknown
  /** Rendered instead of the tree when `nodes` is empty. */
  empty: () => unknown
}>()

// Documented on `expanded` in `./types.ts`. A JSDoc block here would be
// appended to that description by `propsgen`, not replace it.
const expandedKeys = defineModel<TreeKey[]>('expanded', { default: () => [] })

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
// Expansion lives in the `expanded` model as a list of keys, never on the nodes
// themselves. A key that is absent means collapsed.
//
// `defineModel` keeps its own copy only while the model is unbound; under a
// bound `v-model:expanded` a write travels out as an emit and comes back as a
// prop one render later. `pending` holds what we last wrote so two writes in
// the same tick both land, and is dropped on the next tick — if the caller
// rejected the write, their value is authoritative again.
//
// One tick is the whole window on purpose: a caller that is slow (a store
// action, a debounced setter) and a caller that refuses the write look
// identical from here, and a component that quietly diverges from a bound
// model is the worse of the two failures.
const pending = ref<TreeKey[] | null>(null)

const currentKeys = computed(() => {
  const keys = pending.value ?? expandedKeys.value
  if (Array.isArray(keys)) return keys
  // A beta caller still passing the old expand-all boolean. Warn instead of
  // throwing `TypeError: true is not iterable` out of the render.
  warnRemoved(
    "Tree's boolean `v-model:expanded`",
    "an array of the open nodes' keys",
  )
  return []
})

const expandedSet = computed(() => new Set(currentKeys.value))
const isExpanded = (node: TreeNode) => expandedSet.value.has(keyOf(node))

// Always assign a fresh array — an in-place push would skip `update:expanded`
// and leave shallow watchers and immutable stores behind.
function writeKeys(keys: TreeKey[]) {
  pending.value = keys
  expandedKeys.value = keys
  nextTick(() => (pending.value = null))
}

function setKeyExpanded(key: TreeKey, value: boolean) {
  if (expandedSet.value.has(key) === value) return
  writeKeys(
    value
      ? [...currentKeys.value, key]
      : currentKeys.value.filter((k) => k !== key),
  )
}

// The interaction path: a row toggle, a chevron click, a keyboard arrow.
function setExpanded(node: TreeNode, value: boolean) {
  if (props.disabled || !hasChildren(node)) return
  setKeyExpanded(keyOf(node), value)
}

const toggleNode = (node: TreeNode) => setExpanded(node, !isExpanded(node))
const expandNode = (node: TreeNode) => setExpanded(node, true)
const collapseNode = (node: TreeNode) => setExpanded(node, false)

function eachCollapsible(nodes: TreeNode[], fn: (node: TreeNode) => void) {
  for (const node of nodes) {
    if (hasChildren(node)) {
      fn(node)
      eachCollapsible(childrenOf(node), fn)
    }
  }
}

// --- imperative API -------------------------------------------------------
// Key-based and programmatic, so `disabled` (which freezes user interaction)
// does not block them. `expand` accepts a key whose children have not loaded
// yet — the node opens as soon as they arrive.

// Adds to the open keys rather than replacing them, so a key waiting on
// children that have not loaded survives an expand-all.
function expandAll() {
  const keys = new Set(currentKeys.value)
  eachCollapsible(roots.value, (node) => keys.add(keyOf(node)))
  writeKeys([...keys])
}

// Documented on `TreeExposed` in `./types.ts`.
defineExpose<TreeExposed>({
  expand: (key) => setKeyExpanded(key, true),
  collapse: (key) => setKeyExpanded(key, false),
  toggle: (key) => setKeyExpanded(key, !expandedSet.value.has(key)),
  expandAll,
  collapseAll: () => writeKeys([]),
})

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

// The per-node `expanded` field went with the boolean model. `TreeNode` has an
// index signature, so a beta caller keeping it gets no type error — and no
// runtime effect either, leaving the node silently shut. Warn on the data.
//
// `expanded` is also a plausible column name, and a node is allowed arbitrary
// extra fields, so this reports what it found rather than telling the caller
// what they did.
//
// Watching `flat` rather than `nodes` deep: `flat` is already computed for
// rendering, so this costs no extra traversal, where a deep watch would
// re-walk the forest on every edit — for the life of any tree that never
// trips it, which is most of them. The trade is that a node under a closed
// ancestor is reported when it first renders instead of at mount.
if (import.meta.env.DEV) {
  let reported = false
  let stop: WatchStopHandle | undefined
  stop = watch(
    flat,
    (rows) => {
      if (reported || !rows.some((row) => 'expanded' in row.node)) return
      reported = true
      warnOnce(
        'Tree.node.expanded',
        '[frappe-ui] Tree: a node in `nodes` carries an `expanded` field. ' +
          'Tree does not read it — expansion is `v-model:expanded`, an array ' +
          'of node keys. Ignore this if the field is your own data.',
      )
      // `undefined` on the immediate pass, which the call below covers.
      stop?.()
    },
    { immediate: true },
  )
  if (reported) stop()
}

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
  expand: expandNode,
  collapse: collapseNode,
  toggle: toggleNode,
})

// --- lifecycle ------------------------------------------------------------
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
  toggle: toggleNode,
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
