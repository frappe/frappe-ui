<script setup lang="ts">
import { ref } from 'vue'
import { Badge, Slider } from 'frappe-ui'

const value = ref([20, 80])
</script>

<template>
  <div class="flex flex-col gap-3 w-full max-w-md">
    <Slider v-model="value" label="Price range" />
    <Badge class="w-fit !rounded-sm">{{ value.join(' – ') }}</Badge>
  </div>
</template>
