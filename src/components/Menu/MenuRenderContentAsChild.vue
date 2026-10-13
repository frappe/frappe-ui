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

// One component object for the row's lifetime. Built inline in the template
// it would be a new object on every render, which Vue treats as a different
// component: the row's content would unmount and remount each time the menu
// re-renders (on highlight, on hover), dropping any focus inside it.
const Root = { render: renderRootNode }
</script>

<template>
  <component :is="Root" />
</template>
