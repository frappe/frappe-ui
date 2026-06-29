<script setup lang="ts">
import { ref } from 'vue'
import { Avatar, Button, Tree } from 'frappe-ui'
import type { TreeNode } from '../types'

const nodes = ref<TreeNode[]>([
  {
    id: 'james',
    label: 'James Cooper',
    role: 'Head of Sales',
    image: 'https://i.pravatar.cc/80?img=11',
    children: [
      {
        id: 'wade',
        label: 'Wade Warren',
        role: 'Account Executive',
        image: 'https://i.pravatar.cc/80?img=12',
        children: [
          {
            id: 'ethan',
            label: 'Ethan Howard',
            role: 'Sales Rep',
            image: 'https://i.pravatar.cc/80?img=13',
          },
        ],
      },
      {
        id: 'cody',
        label: 'Cody Fisher',
        role: 'Account Executive',
        image: 'https://i.pravatar.cc/80?img=15',
      },
    ],
  },
])

function addReport(node: TreeNode) {
  console.log('add report under', node.id)
}
</script>

<template>
  <div class="w-96" style="--tree-row-height: 48px">
    <Tree :nodes="nodes" node-key="id" guides="none">
      <!-- Avatar on the left -->
      <template #item-prefix="{ node }">
        <Avatar
          :image="node.image as string"
          :label="node.label as string"
          size="lg"
        />
      </template>

      <template #item-label="{ node }">
        <div class="flex min-w-0 flex-col">
          <span class="truncate text-base text-ink-gray-8">{{
            node.label
          }}</span>
          <span class="truncate text-sm text-ink-gray-5">{{ node.role }}</span>
        </div>
      </template>

      <!-- Add action -->
      <template #item-suffix="{ node }">
        <Button
          variant="ghost"
          icon="plus"
          :aria-label="`Add report under ${node.label}`"
          @click.stop="addReport(node)"
        />
      </template>
    </Tree>
  </div>
</template>
