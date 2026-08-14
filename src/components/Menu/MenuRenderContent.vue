<script setup lang="ts">
import { defineComponent, type PropType, type VNodeChild } from 'vue'

const RenderContent = defineComponent({
  name: 'MenuRenderContentRenderer',
  props: {
    content: {
      type: [Object, Array, String, Number] as PropType<VNodeChild>,
      default: undefined,
    },
  },
  setup(props) {
    return () => props.content ?? null
  },
})

defineProps<{
  content?: VNodeChild
}>()
</script>

<template>
  <RenderContent :content="content" />
</template>
