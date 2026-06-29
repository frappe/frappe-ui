<script setup lang="ts">
import { defineComponent, type PropType, type VNode } from 'vue'

const RenderContent = defineComponent({
  name: 'MenuRenderContentRenderer',
  props: {
    content: {
      type: [Object, Array] as PropType<VNode | VNode[]>,
      default: undefined,
    },
  },
  setup(props) {
    return () => props.content ?? null
  },
})

defineProps<{
  content?: VNode | VNode[]
}>()
</script>

<template>
  <RenderContent :content="content" />
</template>
