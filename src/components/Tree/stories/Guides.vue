<script setup lang="ts">
import { ref } from 'vue'
import { TabButtons, Tree } from 'frappe-ui'
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

const guides = ref<'connectors' | 'lines' | 'none'>('connectors')
const guideOptions = [
  { label: 'Connectors', value: 'connectors' },
  { label: 'Lines', value: 'lines' },
  { label: 'None', value: 'none' },
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <TabButtons v-model="guides" :options="guideOptions" />
    <div class="w-80">
      <Tree :nodes="nodes" node-key="name" :guides="guides" default-expanded />
    </div>
  </div>
</template>
