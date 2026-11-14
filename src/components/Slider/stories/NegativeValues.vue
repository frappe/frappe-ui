<script setup lang="ts">
import { computed, ref } from 'vue'
import { Slider } from 'frappe-ui'

const exposure = ref([-20])
const exposureText = computed(
  () => `${exposure.value[0] > 0 ? '+' : ''}${exposure.value[0]}`,
)
</script>

<template>
  <div class="w-full max-w-md">
    <Slider v-model="exposure" :min="-100" :max="100">
      <template #label>
        <span class="flex items-center justify-between">
          Exposure
          <span class="tabular-nums text-ink-gray-8" aria-hidden="true">
            {{ exposureText }}
          </span>
        </span>
      </template>
    </Slider>
  </div>
</template>
