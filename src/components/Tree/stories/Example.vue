<script setup lang="ts">
import { ref } from 'vue'
import { Tree } from 'frappe-ui'
import type { DropContext, MoveEvent, TreeNode } from '../types'

const nodes = ref<TreeNode[]>([
  {
    name: 'guest',
    label: 'Guest',
    children: [
      {
        name: 'downloads',
        label: 'Downloads',
        children: [
          {
            name: 'download.zip',
            label: 'download.zip',
            children: [{ name: 'image.png', label: 'image.png' }],
          },
        ],
      },
      {
        name: 'documents',
        label: 'Documents',
        children: [
          { name: 'somefile.txt', label: 'somefile.txt' },
          { name: 'somefile.pdf', label: 'somefile.pdf' },
        ],
      },
    ],
  },
])

const expanded = ref<string[]>(['guest', 'downloads', 'documents'])
const selected = ref<string | null>(null)

// Block dropping a node into a "file" (a node without children).
function canDrop({ target }: DropContext) {
  return Array.isArray(target.children)
}

function onMove(move: MoveEvent) {
  // In a real app you'd persist, then update `nodes`. Here we just log.
  console.log('move', move)
}
</script>

<template>
  <div class="w-80">
    <Tree
      :nodes="nodes"
      node-key="name"
      v-model:expanded="expanded"
      v-model:selected="selected"
      draggable
      :can-drop="canDrop"
      guides="connectors"
      @move="onMove"
    />
  </div>
</template>
