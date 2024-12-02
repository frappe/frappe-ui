<template>
  <Story :layout="{ type: 'grid', width: 300 }">
    <Variant title="default">
      <div class="p-2">
        <Rating v-bind="state" />
      </div>
    </Variant>
  </Story>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import Rating from './Rating.vue'

const state = reactive({
  size: 'md',
  label: 'Rating',
})
</script>
