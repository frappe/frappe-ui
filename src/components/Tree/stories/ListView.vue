<script setup lang="ts">
import { ref } from 'vue'
import { Avatar, Button, Tree } from 'frappe-ui'
import type { TreeNode } from '../types'

const nodes = ref<TreeNode[]>([
  {
    id: 'james',
    name: 'James Cooper',
    role: 'Head of Sales',
    image: 'https://i.pravatar.cc/80?img=11',
    children: [
      {
        id: 'wade',
        name: 'Wade Warren',
        role: 'Account Executive',
        image: 'https://i.pravatar.cc/80?img=12',
        children: [
          {
            id: 'ethan',
            name: 'Ethan Howard',
            role: 'Sales Rep',
            image: 'https://i.pravatar.cc/80?img=13',
          },
        ],
      },
      {
        id: 'cody',
        name: 'Cody Fisher',
        role: 'Account Executive',
        image: 'https://i.pravatar.cc/80?img=15',
      },
    ],
  },
])

const expanded = ref<string[]>(['james', 'wade'])

function addReport(node: TreeNode) {
  console.log('add report under', node.id)
}
</script>

<template>
  <div class="w-96">
    <Tree
      :nodes="nodes"
      node-key="id"
      label-key="name"
      v-model:expanded="expanded"
      guides="none"
      row-height="48px"
    >
      <!-- Avatar on the left -->
      <template #prefix="{ node }">
        <Avatar
          :image="node.image as string"
          :label="node.name as string"
          size="lg"
        />
      </template>

      <template #label="{ node }">
        <div class="flex min-w-0 flex-col">
          <span class="truncate text-base text-ink-gray-8">{{
            node.name
          }}</span>
          <span class="truncate text-sm text-ink-gray-5">{{ node.role }}</span>
        </div>
      </template>

      <!-- Add action -->
      <template #suffix="{ node }">
        <Button
          variant="ghost"
          icon="plus"
          :aria-label="`Add report under ${node.name}`"
          @click.stop="addReport(node)"
        />
      </template>
    </Tree>
  </div>
</template>
