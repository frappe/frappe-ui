<script setup lang="ts">
import { h } from 'vue'
import { Icon } from 'frappe-ui'

// The escape hatch: pass any Vue component as the icon source.
const CustomIcon = () =>
  h(
    'svg',
    { viewBox: '0 0 24 24', fill: 'none', class: 'size-5' },
    [
      h('circle', {
        cx: 12,
        cy: 12,
        r: 9,
        stroke: 'currentColor',
        'stroke-width': 2,
      }),
    ],
  )
</script>

<template>
  <Icon :name="CustomIcon" class="text-ink-gray-8" />
</template>
