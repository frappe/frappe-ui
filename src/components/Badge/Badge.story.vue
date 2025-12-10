<script setup lang="ts">
import { reactive } from 'vue'
import Badge from './Badge.vue'

const state = reactive({
  theme: 'gray',
  size: 'sm',
  label: 'Badge',
})

const variants = ['solid', 'subtle', 'outline', 'ghost']
const themes = ['gray', 'blue', 'green', 'orange', 'red']
const sizes = ['sm', 'md', 'lg']
</script>

<template>
  <div class="grid gap-4">
    <Badge
      v-for="variant in variants"
      :key="variant"
      :variant="variant"
      v-bind="state"
    >
      {{ state.label }}
    </Badge>
  </div>
</template>
