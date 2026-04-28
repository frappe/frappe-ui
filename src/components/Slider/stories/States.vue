<script setup lang="ts">
import { ref } from 'vue'
import { Slider } from 'frappe-ui'

const a = ref([30])
const b = ref([30])
const c = ref([30])
const d = ref([30])
</script>

<template>
  <div class="flex flex-col gap-6 w-full max-w-md">
    <Slider v-model="a" label="Default" />
    <Slider v-model="b" label="Required" required />
    <Slider v-model="c" label="Disabled" disabled />
    <Slider v-model="d" label="With error" error="Required." />
  </div>
</template>
