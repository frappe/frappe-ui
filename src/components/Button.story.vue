<script setup lang="ts">
import { reactive } from 'vue'
import Button from './Button.vue'
const state = reactive({
  theme: 'gray',
  size: 'sm',
  label: 'Button',
  loading: false,
  loadingText: null,
  disabled: false,
  link: null,
})
const variants = ['solid', 'subtle', 'outline', 'ghost']
const themes = ['gray', 'blue', 'green', 'red']
const sizes = ['sm', 'md', 'lg', 'xl', '2xl']
</script>

<template>
  <Story :layout="{ type: 'grid', width: 300 }">
    <Variant v-for="variant in variants" :key="variant" :title="variant">
      <Button :variant="variant" v-bind="state">{{ state.label }}</Button>
    </Variant>

    <template #controls>
      <HstText v-model="state.label" title="Content" />
      <HstCheckbox v-model="state.disabled" title="Disabled" />
      <HstSelect v-model="state.theme" :options="themes" title="Theme" />
      <HstSelect v-model="state.size" :options="sizes" title="Size" />
    </template>
  </Story>
</template>
