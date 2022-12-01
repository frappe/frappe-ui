<script setup>
import { useAttrs } from 'vue'
import RenderToIFrame from './RenderToIFrame'
import tailwindStyles from '../../src/style.css'

defineProps({
  iframe: {
    type: Boolean,
    default: false,
  },
})

const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
    html {
        -webkit-font-smoothing: antialiased;
    }
    ${tailwindStyles}
`
const attrs = useAttrs()
</script>
<template>
  <RenderToIFrame class="w-full" :css="iframe ? css : null" :disabled="!iframe">
    <div
      :class="[
        'flex w-full items-center justify-center overflow-auto rounded-lg border p-4',
        attrs.class,
      ]"
    >
      <div>
        <slot name="code" />
      </div>
      <slot />
    </div>
  </RenderToIFrame>
</template>
