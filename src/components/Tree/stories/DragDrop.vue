<script setup lang="ts">
import { ref } from 'vue'
import { Switch, Tree } from 'frappe-ui'
import type { DropInfo, MoveContext, TreeNode } from '../types'

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
            name: 'archive',
            label: 'archive',
            children: [{ name: 'image.png', label: 'image.png' }],
          },
        ],
      },
      {
        name: 'documents',
        label: 'Documents',
        children: [
          { name: 'resume.pdf', label: 'resume.pdf' },
          { name: 'notes.txt', label: 'notes.txt' },
        ],
      },
    ],
  },
])

const expanded = ref<string[]>(['guest', 'downloads', 'documents', 'archive'])
const disabled = ref(false)

// Folders (nodes with a `children` array) can receive drops; files cannot.
function move({ target, position }: MoveContext) {
  if (position === 'inside') return Array.isArray(target.children)
  return true
}

// Locate a node by key, returning the array that holds it and its index.
function locate(
  list: TreeNode[],
  key: string,
): { list: TreeNode[]; index: number } | null {
  for (let i = 0; i < list.length; i++) {
    if (list[i].name === key) return { list, index: i }
    const children = list[i].children
    if (children) {
      const found = locate(children, key)
      if (found) return found
    }
  }
  return null
}

// Persist a committed move by splicing the node into its new position.
function onDragEnd(info: DropInfo | null) {
  if (!info) return
  const roots = nodes.value
  const src = locate(roots, info.node.name as string)
  if (!src) return
  const [moved] = src.list.splice(src.index, 1)

  let dest = roots
  if (info.to !== null) {
    const hit = locate(roots, info.to as string)
    const parent = hit?.list[hit.index]
    if (parent) {
      if (!parent.children) parent.children = []
      dest = parent.children
      if (!expanded.value.includes(info.to as string))
        expanded.value = [...expanded.value, info.to as string]
    }
  }
  dest.splice(info.newIndex, 0, moved)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <Switch v-model="disabled" label="Disable interaction" />
    <div class="w-80">
      <Tree
        :nodes="nodes"
        node-key="name"
        v-model:expanded="expanded"
        :disabled="disabled"
        draggable
        :move="move"
        @drag-end="onDragEnd"
      />
    </div>
  </div>
</template>
