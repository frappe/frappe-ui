<script setup lang="ts">
import { ref } from 'vue'
import { Slider } from 'frappe-ui'

const small = ref([30])
const medium = ref([60])
</script>

<template>
  <div class="flex flex-col gap-6 w-full max-w-md">
    <Slider v-model="small" size="sm" label="Small" />
    <Slider v-model="medium" size="md" label="Medium" />
  </div>
</template>
