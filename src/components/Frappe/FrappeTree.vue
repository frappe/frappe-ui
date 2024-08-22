<template>
  <div v-if="treeNodes">
    <Tree :node="treeNodes" nodeKey="name" :options="options">
      <template #node="{ node, hasChildren, isCollapsed, toggleCollapsed }">
        <slot
          name="node"
          v-bind="{ node, hasChildren, isCollapsed, toggleCollapsed }"
        />
      </template>
    </Tree>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { createResource } from '../../resources'
import Tree from '../Tree/Tree.vue'
import type { TreeNode, TreeOptions } from '../types/Tree'

const props = defineProps<{
  doctype: string
  options?: TreeOptions
}>()

type TreeData = {
  parent: string
  data: {
    value: string
    title: string
  }[]
}

const treeNodes = ref<TreeNode>()

const allChildren = createResource({
  url: 'frappe.desk.treeview.get_all_nodes',
  makeParams: () => ({
    doctype: props.doctype,
    is_root: 1,
    label: props.doctype,
    parent: '',
    tree_method: 'frappe.desk.treeview.get_children',
  }),
})

const buildNestedTree = (
  node = props.doctype,
  label = props.doctype,
): TreeNode => {
  const rootData = (allChildren.data as TreeData[]).find(
    (child) => child.parent == node,
  )
  const children = rootData?.data || []
  if (!children.length) {
    return {
      name: node,
      label: label,
      children: [],
    }
  }
  return {
    name: node,
    label: label,
    // build sub-tree for each child
    children: children.map((child) =>
      buildNestedTree(child.value, child.title),
    ),
  }
}

onBeforeMount(async () => {
  await allChildren.fetch()
  treeNodes.value = buildNestedTree()
})
</script>
