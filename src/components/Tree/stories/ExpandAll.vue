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

// The model holds the keys of the open nodes, so it doubles as a readout.
const expanded = ref<string[]>(['guest'])

// `expandAll` / `collapseAll` write the same model through a template ref.
const tree = ref<InstanceType<typeof Tree> | null>(null)
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex gap-2">
      <Button @click="tree?.expandAll()">Expand all</Button>
      <Button @click="tree?.collapseAll()">Collapse all</Button>
      <Button @click="tree?.toggle('documents')">Toggle Documents</Button>
    </div>
    <div class="w-80">
      <Tree
        ref="tree"
        :nodes="nodes"
        node-key="name"
        v-model:expanded="expanded"
      />
    </div>
    <p class="text-sm text-ink-gray-5">
      expanded: {{ expanded.length ? expanded.join(', ') : '(none)' }}
    </p>
  </div>
</template>
