<script setup lang="ts">
import { ref } from 'vue'
import { Rating } from 'frappe-ui'

const spice = ref(2)
const levels = ['Not rated', 'Mild', 'Medium', 'Hot']
</script>

<template>
  <div class="flex items-end gap-3">
    <Rating
      v-model="spice"
      icon="lucide-flame"
      :max="3"
      size="md"
      label="Spice level"
    />
    <span class="flex h-5 items-center text-base text-ink-gray-7">{{
      levels[spice]
    }}</span>
  </div>
</template>
