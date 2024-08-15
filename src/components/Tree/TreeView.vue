<template>
  <div v-if="treeNodes">
    <Tree :node="treeNodes" :options="options">
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
import Tree from './Tree.vue'
import type { TreeNode, TreeOptions } from '../types/Tree'

const props = defineProps<{
  doctype: string
  options?: TreeOptions
}>()

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

const buildNestedTree = (node: string): TreeNode => {
  const rootData = allChildren.data.find((child: any) => child.parent == node)
  const children = rootData.data || []
  if (!children.length) return { label: node, children: [] }
  return {
    label: node,
    // build sub-tree for each child
    children: children.map((child: any) => buildNestedTree(child.title)),
  }
}

onBeforeMount(async () => {
  await allChildren.fetch()
  treeNodes.value = buildNestedTree(props.doctype)
})
</script>
