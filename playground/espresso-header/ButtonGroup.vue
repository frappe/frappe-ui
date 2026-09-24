<template>
  <!-- Figma's `button-group`: a run of buttons on one row. frappe-ui has no
       ButtonGroup component, so this is the layout wrapper the design draws —
       the buttons inside are frappe-ui `Button`s. -->
  <div class="flex items-center" :class="gaps[spacing]" role="group">
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ spacing?: 'flush' | 'xs' | 'sm' | 'md' }>(), {
  spacing: 'flush',
})

const gaps = {
  flush: 'gap-0',
  xs: 'gap-0.5',
  sm: 'gap-1',
  md: 'gap-2',
} as const
</script>
