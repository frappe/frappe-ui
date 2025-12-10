<script setup lang="ts">
import { reactive } from 'vue'
import { Button } from './index'

const state = reactive({
  theme: 'gray',
  size: 'sm',
  label: 'Button',
  loading: false,
  loadingText: null,
  disabled: false,
  link: null,
  tooltip: 'Hover for more!',
})

const variants = ['solid', 'subtle', 'outline', 'ghost']
const themes = ['gray', 'blue', 'green', 'red']
const sizes = ['sm', 'md', 'lg', 'xl', '2xl']
</script>

<template>
  <div class="grid gap-3">
    <div v-for="variant in variants" :key="variant" class="p-1">
      <Button :variant="variant" v-bind="state">{{ state.label }}</Button>
    </div>
  </div>
</template>
