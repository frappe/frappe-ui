<script setup lang="ts">
import { ref } from 'vue'
import { Slider } from 'frappe-ui'

const exposure = ref([-20])
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-2">
    <Slider v-model="exposure" label="Exposure" :min="-100" :max="100" />
    <span class="text-sm text-ink-gray-5 tabular-nums">
      {{ exposure[0] > 0 ? '+' : '' }}{{ exposure[0] }}
    </span>
  </div>
</template>
