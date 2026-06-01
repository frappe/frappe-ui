<template>
  <li
    v-bind="listAttrs"
    class="toc-item"
    :class="[
      node.value.isScrolledOver ? 'text-ink-gray-5' : 'text-ink-gray-8',
      node.value.isActive && !node.value.isScrolledOver ? 'font-medium' : '',
    ]"
  >
    <p style="margin: 0; cursor: pointer" @click="onClick">
      {{ node.value.text }}
    </p>
    <ol
      v-if="node.children.length"
      v-bind="orderedAttrs"
      @click.stop
    >
      <TocItem
        v-for="child in node.children"
        :key="child.value.id || child.value.pos"
        :node="child"
        :ordered-attrs="orderedAttrs"
        :list-attrs="listAttrs"
        @select="$emit('select', $event)"
      />
    </ol>
  </li>
</template>

<script setup lang="ts">
import type { HeadingTreeNode } from '@molecules/editor/extensions/shared/heading-tree-utils'
import type { EnrichedAnchor } from '@molecules/editor/composables/useTocActiveHeading'

const props = defineProps<{
  node: HeadingTreeNode<EnrichedAnchor>
  orderedAttrs: Record<string, unknown>
  listAttrs: Record<string, unknown>
}>()

const emit = defineEmits<{
  (e: 'select', anchor: EnrichedAnchor): void
}>()

function onClick(event: MouseEvent): void {
  event.preventDefault()
  event.stopPropagation()
  emit('select', props.node.value)
}
</script>
