<script setup lang="ts">
import { reactive } from 'vue'
import Checkbox from './Checkbox.vue'

const state = reactive({
  size: 'sm',
  value: false,
})

const sizes = ['sm', 'md']
</script>
<template>
  <Story :layout="{ width: 500, type: 'grid' }">
    <div class="p-2">
      <Checkbox v-bind="state" v-model="state.value" label="Enable feature" />
    </div>

    <template #controls>
      <HstSelect v-model="state.size" :options="sizes" title="Size" />
    </template>
  </Story>
</template>
