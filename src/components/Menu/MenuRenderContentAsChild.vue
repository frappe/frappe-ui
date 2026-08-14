<script setup lang="ts">
import { cloneVNode, useAttrs, type VNodeChild } from 'vue'
import { getFirstRenderableElement } from '../../utils/vnode'

const props = defineProps<{
  content?: VNodeChild
}>()

const attrs = useAttrs()

function renderRootNode() {
  const node = getFirstRenderableElement(props.content)
  return node ? cloneVNode(node, attrs) : null
}
</script>

<template>
  <component :is="{ render: renderRootNode }" />
</template>
