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
  <Story :layout="{ type: 'grid', width: 300 }">
    <Variant v-for="variant in variants" :key="variant" :title="variant">
      <Badge :variant="variant" v-bind="state">{{ state.label }}</Badge>
    </Variant>

    <template #controls>
      <HstText v-model="state.label" title="Content" />
      <HstSelect v-model="state.theme" :options="themes" title="Theme" />
      <HstSelect v-model="state.size" :options="sizes" title="Size" />
    </template>
  </Story>
</template>
