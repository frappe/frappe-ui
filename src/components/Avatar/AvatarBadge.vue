<template>
  <!-- The default color sits in `:where()` (zero specificity), so a color
       class on the badge wins whatever order the stylesheet emits them in. -->
  <span
    data-slot="avatar-badge"
    class="flex size-full items-center justify-center rounded-full text-ink-white [:where(&)]:bg-surface-gray-5"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
defineSlots<{
  /** Content centered in the badge, such as an icon */
  default?: () => any
}>()
</script>
