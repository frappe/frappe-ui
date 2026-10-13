<template>
  <!-- Espresso subheader on frappe-ui's second-row geometry (see the recipes'
       `PageHeaderBase` toolbars): a full-width strip under the header, inset
       like the header, with 10px above and below its controls. The Tabs row
       instead fills a 40px strip and carries the rule, so its underline rides
       the bottom edge. -->
  <div
    data-slot="subheader"
    class="flex shrink-0 items-center justify-between gap-8 bg-surface-base px-3 sm:px-5"
    :class="
      variant === 'tabs' ? 'h-10 border-b border-outline-gray-1' : 'py-2.5'
    "
  >
    <div
      class="flex min-w-0 items-center"
      :class="variant === 'tabs' ? 'h-full' : 'gap-2'"
    >
      <slot name="left" />
    </div>
    <div v-if="$slots.right" class="flex shrink-0 items-center gap-2">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'default' | 'tabs' }>(), {
  variant: 'default',
})

defineSlots<{
  left?: () => any
  right?: () => any
}>()
</script>
