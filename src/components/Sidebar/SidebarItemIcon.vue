<template>
  <!-- Icon fallback used when no #prefix slot is supplied: a lucide CSS class,
       plain text, or a component. -->
  <span
    v-if="isLucideClass"
    class="size-4 text-ink-gray-6"
    :class="icon as string"
    aria-hidden="true"
  />
  <span v-else-if="typeof icon === 'string'" class="size-4 text-ink-gray-6">
    {{ icon }}
  </span>
  <component v-else-if="icon" :is="icon" class="size-4 text-ink-gray-6" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'

const props = defineProps<{ icon?: string | Component }>()

const isLucideClass = computed(
  () => typeof props.icon === 'string' && props.icon.startsWith('lucide-'),
)
</script>
