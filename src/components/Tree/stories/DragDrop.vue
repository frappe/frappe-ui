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

// Only allow dropping into a "folder" (a node that can have children).
function canDrop({ target }: DropContext) {
  return Array.isArray(target.children)
}

function onMove(move: MoveEvent) {
  // In a real app you'd persist the change, then update `nodes`.
  console.log('move', move)
}
</script>

<template>
  <div class="w-80">
    <Tree
      :nodes="nodes"
      node-key="name"
      guides="none"
      v-model:expanded="expanded"
      draggable
      :can-drop="canDrop"
      @move="onMove"
    />
  </div>
</template>
