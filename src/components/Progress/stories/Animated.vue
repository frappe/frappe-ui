<script setup lang="ts">
import { ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import { Progress, Button } from 'frappe-ui'

const value = ref(0)

// A poll or upload reports progress in coarse steps. The fill transitions
// between them, so the bar reads as continuous motion instead of jumping.
// The tick matches the fill's own transition duration, so each step is still
// moving when the next arrives — that hand-off is the point of the demo.
const { pause, resume, isActive } = useIntervalFn(
  () => {
    value.value += 10
    if (value.value >= 100) pause()
  },
  660,
  { immediate: false },
)

function start() {
  value.value = 0
  resume()
}
</script>

<template>
  <div class="grid w-full max-w-[400px] gap-4">
    <Progress :value="value" label="Uploading" :hint="true" size="md" />

    <div class="flex gap-2">
      <Button variant="solid" :disabled="isActive" @click="start">
        {{ value === 100 ? 'Restart' : 'Start' }}
      </Button>
      <Button :disabled="!isActive" @click="pause()">Pause</Button>
    </div>
  </div>
</template>
