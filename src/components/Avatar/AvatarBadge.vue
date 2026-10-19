<template>
  <!-- The defaults sit in `:where()` (zero specificity), so a color class on
       the badge wins whatever order the stylesheet emits them in. -->
  <span
    data-slot="avatar-badge"
    class="flex size-full items-center justify-center rounded-full [:where(&)]:bg-surface-gray-5 [:where(&)]:text-white"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import type { AvatarBadgeSlots } from './types'

defineSlots<AvatarBadgeSlots>()
</script>
