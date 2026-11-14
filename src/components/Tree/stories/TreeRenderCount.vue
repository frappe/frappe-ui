<script setup lang="ts">
import Tree from '../Tree.vue'
import type { TreeNode } from '../types'

// Test fixture: an SFC parent, so the slots it passes compile as stable.
const props = defineProps<{
  nodes: TreeNode[]
  expanded: string[]
  renders: Record<string, number>
}>()

function count(id: string) {
  props.renders[id] = (props.renders[id] ?? 0) + 1
  return true
}
</script>

<template>
  <Tree :nodes node-key="id" :expanded>
    <template #item-label="{ node }">
      <span v-if="count(String(node.id))">{{ node.label }}</span>
    </template>
  </Tree>
</template>
