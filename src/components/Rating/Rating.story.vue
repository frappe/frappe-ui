<script setup lang="ts">
import { reactive } from 'vue'
import Rating from './Rating.vue'

const state = reactive({
  size: 'md',
  label: 'Rating',
})
</script>

<template>
  <div class="p-2 w-[300px]">
    <Rating v-bind="state" />
  </div>
</template>
