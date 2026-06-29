<script setup lang="ts">
import { ref } from 'vue'
import { Button, Tree } from 'frappe-ui'
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
        children: [
          { name: 'somefile.txt', label: 'somefile.txt' },
          { name: 'somefile.pdf', label: 'somefile.pdf' },
        ],
      },
    ],
  },
])

// `expanded` mirrors whether every node is open (nodes start expanded), so the
// label stays in sync even when rows are toggled individually.
const expanded = ref(true)
</script>

<template>
  <div class="flex flex-col gap-3">
    <Button class="self-start" @click="expanded = !expanded">
      {{ expanded ? 'Collapse all' : 'Expand all' }}
    </Button>
    <div class="w-80">
      <Tree :nodes="nodes" node-key="name" v-model:expanded="expanded" />
    </div>
  </div>
</template>
