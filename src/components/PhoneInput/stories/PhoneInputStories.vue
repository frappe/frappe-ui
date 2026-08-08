<template>
  <div class="p-8 max-w-sm space-y-4">
    <PhoneInput
      v-model="val"
      placeholder="Enter phone number"
    />
    <div class="text-xs font-mono text-ink-gray-6 bg-surface-gray-2 p-2 rounded">
      Value: {{ val || '(empty)' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PhoneInput from '../PhoneInput.vue'

const val = ref('')
</script>
