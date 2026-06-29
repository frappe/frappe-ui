<script setup lang="ts">
import { ref } from 'vue'
import { Tree } from 'frappe-ui'
import type { TreeNode } from '../types'

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
        expanded: false,
        children: [
          { name: 'somefile.txt', label: 'somefile.txt' },
          { name: 'somefile.pdf', label: 'somefile.pdf' },
        ],
      },
    ],
  },
])
</script>

<template>
  <div class="w-80">
    <Tree :nodes="nodes" node-key="name" />
  </div>
</template>
