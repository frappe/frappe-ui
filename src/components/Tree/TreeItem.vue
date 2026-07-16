<template>
  <li
    ref="el"
    role="treeitem"
    data-slot="item"
    :data-level="level"
    :data-state="expanded ? 'expanded' : 'collapsed'"
    :data-has-children="hasChildren"
    :data-disabled="ctx.disabled.value || undefined"
    :data-dragging="isDragging || undefined"
    :data-drop="dropEdge || undefined"
    :aria-expanded="hasChildren ? expanded : undefined"
    :aria-level="level"
    :aria-setsize="setSize"
    :aria-posinset="index + 1"
    :tabindex="tabbable ? 0 : -1"
    @focus="ctx.focusedKey.value = key"
  >
    <div
      data-slot="row"
      class="frappe-tree-row group/row relative flex items-center gap-1.5 rounded-md px-1.5"
      :class="[
        ctx.draggable.value && !ctx.disabled.value ? 'cursor-grab' : '',
        // When the row is fully overridden via #item, the consumer owns its hover/selected surface
        $slots.item ? '' : 'hover:bg-surface-gray-2',
      ]"
      :draggable="ctx.draggable.value && !ctx.disabled.value"
      @click="onRowClick"
      @dragstart="ctx.onDragStart($event, node, parent)"
      @dragend="ctx.onDragEnd()"
      @dragover.prevent="ctx.onDragOver($event, node)"
      @dragleave="ctx.onDragLeave(node)"
      @drop.prevent="ctx.onDrop(node, parent)"
    >
      <!-- Fully-overridden item -->
      <slot v-if="$slots.item" name="item" v-bind="slotProps" />

      <!-- Default node rendering -->
      <template v-else>
        <button
          v-if="hasChildren"
          type="button"
          data-slot="toggle"
          :data-state="expanded ? 'expanded' : 'collapsed'"
          class="flex size-5 shrink-0 items-center justify-center rounded text-ink-gray-5 hover:bg-surface-gray-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-outline-gray-3"
          :aria-label="expanded ? 'Collapse' : 'Expand'"
          tabindex="-1"
          @click.stop="ctx.toggle(node)"
        >
          <svg
            class="size-3.5 transition-transform duration-150 motion-reduce:transition-none"
            :style="{ transform: expanded ? 'rotate(90deg)' : 'none' }"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
        <span v-else class="size-5 shrink-0" aria-hidden="true" />

        <slot name="item-prefix" v-bind="itemSlotProps" />

        <slot name="item-label" v-bind="itemSlotProps">
          <span class="truncate text-base text-ink-gray-8">{{ label }}</span>
        </slot>

        <span class="ml-auto flex items-center">
          <slot name="item-suffix" v-bind="itemSlotProps" />
        </span>
      </template>
    </div>

    <!-- Children -->
    <ul v-if="hasChildren && expanded" role="group" class="frappe-tree-group">
      <TreeItem
        v-for="(child, childIndex) in children"
        :key="ctx.keyOf(child)"
        :node="child"
        :parent="node"
        :level="level + 1"
        :index="childIndex"
        :set-size="children.length"
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
    </ul>
  </li>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue'
import { TreeContextKey, type TreeNode, type TreeNodeSlotProps } from './types'

const props = defineProps<{
  node: TreeNode
  parent: TreeNode | null
  level: number
  index: number
  setSize: number
}>()

defineSlots<{
  item: (props: TreeNodeSlotProps) => unknown
  'item-prefix': (props: Omit<TreeNodeSlotProps, 'toggle'>) => unknown
  'item-label': (props: Omit<TreeNodeSlotProps, 'toggle'>) => unknown
  'item-suffix': (props: Omit<TreeNodeSlotProps, 'toggle'>) => unknown
}>()

const injected = inject(TreeContextKey)
if (!injected) throw new Error('TreeItem must be used inside a Tree')
const ctx = injected

const el = ref<HTMLElement | null>(null)

const key = computed(() => ctx.keyOf(props.node))
const label = computed(() => ctx.labelOf(props.node))
const children = computed(() => ctx.childrenOf(props.node))
const hasChildren = computed(() => ctx.hasChildren(props.node))
const expanded = computed(() => ctx.isExpanded(props.node))
const isDragging = computed(() => ctx.dragSourceKey.value === key.value)

const dropEdge = computed(() =>
  ctx.dropTargetKey.value === key.value ? ctx.dropPosition.value : null,
)

const tabbable = computed(
  () =>
    ctx.focusedKey.value === key.value ||
    (ctx.focusedKey.value == null && props.level === 1 && props.index === 0),
)

const itemSlotProps = computed(() => ({
  node: props.node,
  level: props.level,
  expanded: expanded.value,
  hasChildren: hasChildren.value,
  focused: ctx.focusedKey.value === key.value,
  disabled: ctx.disabled.value,
}))

const slotProps = computed(() => ({
  ...itemSlotProps.value,
  toggle: () => ctx.toggle(props.node),
}))

function onRowClick() {
  if (ctx.disabled.value) return
  ctx.toggle(props.node)
}

watch(
  el,
  (node) => {
    if (node) ctx.registerItem(key.value, node)
  },
  { immediate: true },
)
onBeforeUnmount(() => ctx.unregisterItem(key.value))
</script>

<style>
/* ---- Sizing (override via --tree-row-height / --tree-indent in CSS) ---- */
.frappe-tree-row {
  height: var(--_tree-row-height);
}
.frappe-tree-group {
  padding-left: var(--_tree-indent);
}

/* ---- Connector guides (elbow lines) ---- */
.frappe-tree[data-guides='connectors'] [role='group'] > li {
  position: relative;
}

/* vertical line running down siblings */
.frappe-tree[data-guides='connectors'] [role='group'] > li::before {
  content: '';
  position: absolute;
  left: calc(var(--_tree-indent) / -2);
  top: 0;
  bottom: 0;
  border-left: 1px solid var(--outline-gray-2, #e5e7eb);
}

/* horizontal elbow reaching each node */
.frappe-tree[data-guides='connectors'] [role='group'] > li::after {
  content: '';
  position: absolute;
  left: calc(var(--_tree-indent) / -2);
  top: calc(var(--_tree-row-height) / 2);
  width: calc(var(--_tree-indent) / 2);
  border-top: 1px solid var(--outline-gray-2, #e5e7eb);
}

/* last child: stop the vertical at the elbow + round the corner */
.frappe-tree[data-guides='connectors'] [role='group'] > li:last-child::before {
  bottom: auto;
  height: calc(var(--_tree-row-height) / 2);
  border-bottom: 1px solid var(--outline-gray-2, #e5e7eb);
  border-bottom-left-radius: 6px;
}

/* ---- Simple vertical lines ---- */
.frappe-tree[data-guides='lines'] [role='group'] {
  margin-left: calc(var(--_tree-indent) / 2);
  border-left: 1px solid var(--outline-gray-2, #e5e7eb);
  padding-left: calc(var(--_tree-indent) / 2) !important;
}

/* ---- Drop indicators ---- */
.frappe-tree-row {
  outline-offset: -1px;
}
[data-drop='inside'] > .frappe-tree-row {
  outline: 2px solid var(--outline-blue-3, #2490ef);
  background: var(--surface-blue-1, rgba(36, 144, 239, 0.08));
}
[data-drop='before'] > .frappe-tree-row,
[data-drop='after'] > .frappe-tree-row {
  position: relative;
}
[data-drop='before'] > .frappe-tree-row::before,
[data-drop='after'] > .frappe-tree-row::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--outline-blue-3, #2490ef);
  z-index: 1;
}
[data-drop='before'] > .frappe-tree-row::before {
  top: -1px;
}
[data-drop='after'] > .frappe-tree-row::after {
  bottom: -1px;
}

[data-dragging] > .frappe-tree-row {
  opacity: 0.4;
}

.frappe-tree [role='treeitem']:focus-visible {
  outline: 2px solid var(--outline-blue-3, #2490ef);
  outline-offset: -1px;
  border-radius: 6px;
}
.frappe-tree [role='treeitem']:focus {
  outline: none;
}
</style>
