<script setup lang="ts">
import { reactive } from 'vue'
import Progress from './Progress.vue'

const state = reactive({
  size: 'sm',
  value: 50,
})

const sizes = ['sm', 'md', 'lg', 'xl']
</script>

<template>
  <div class="space-y-4">
    <Progress v-bind="state" label="Progress" />
    <Progress v-bind="state" label="Progress" :hint="true" />
    <Progress v-bind="state" label="Progress" :intervals="true" :interval-count="5" />

    <div class="flex gap-4 items-center mt-4">
      <input type="range" v-model="state.value" min="0" max="100" />
      <select v-model="state.size">
        <option v-for="size in sizes" :key="size" :value="size">{{ size }}</option>
      </select>
    </div>
  </div>
</template>
