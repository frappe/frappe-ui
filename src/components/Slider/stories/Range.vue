<script setup lang="ts">
import { computed, ref } from 'vue'
import { Slider } from 'frappe-ui'

const price = ref([80, 450])
const priceText = computed(() => `$${price.value[0]} – $${price.value[1]}`)
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-1.5">
    <Slider v-model="price" :max="1000" :step="10">
      <!-- The value sits in the label row. It's aria-hidden so the name
           stays "Price range"; each handle announces its own value. -->
      <template #label>
        <span class="flex items-center justify-between">
          Price range
          <span class="tabular-nums text-ink-gray-8" aria-hidden="true">
            {{ priceText }}
          </span>
        </span>
      </template>
    </Slider>
    <div
      class="flex justify-between text-xs text-ink-gray-5"
      aria-hidden="true"
    >
      <span>$0</span>
      <span>$1,000</span>
    </div>
  </div>
</template>
