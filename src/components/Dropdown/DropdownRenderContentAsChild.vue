<script setup lang="ts">
import {
  cloneVNode,
  Comment,
  Fragment,
  computed,
  useAttrs,
  type VNode,
} from 'vue'

const props = defineProps<{
  content?: any
}>()

const attrs = useAttrs()

const rootNode = computed(() => {
  const node = getFirstRenderableElement(props.content)
  return node ? cloneVNode(node, attrs) : null
})

function getFirstRenderableElement(content: any): VNode | null {
  if (Array.isArray(content)) {
    for (const node of content) {
      const renderableNode = getFirstRenderableElement(node)
      if (renderableNode) {
        return renderableNode
      }
    }

    return null
  }

  if (!content || typeof content !== 'object') {
    return null
  }

  if (content.type === Comment) {
    return null
  }

  if (content.type === Fragment) {
    const children = Array.isArray(content.children) ? content.children : []
    return getFirstRenderableElement(children)
  }

  return content as VNode
}
</script>

<template>
  <component :is="{ render: () => rootNode }" />
</template>
