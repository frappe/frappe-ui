<script setup lang="ts">
import { ref } from 'vue'
import { TextInput } from 'frappe-ui'

const price = ref<number | ''>(49)
</script>

<template>
  <div class="flex w-full max-w-xs flex-col gap-3">
    <TextInput
      v-model.number="price"
      type="number"
      label="Monthly price"
      placeholder="0"
    >
      <template #suffix>
        <span class="text-sm text-ink-gray-5">USD</span>
      </template>
    </TextInput>
    <p class="text-p-sm text-ink-gray-5">
      Yearly: {{ price === '' ? '—' : `${price * 12} USD` }}
    </p>
  </div>
</template>
