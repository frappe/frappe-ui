<template>
  <div class="p-8 max-w-sm space-y-6">
    <div>
      <span class="text-xs text-ink-gray-5 font-mono mb-1 block">disabled</span>
      <PhoneInput v-model="v1" disabled placeholder="Disabled input" />
    </div>
    <div>
      <span class="text-xs text-ink-gray-5 font-mono mb-1 block">loading</span>
      <PhoneInput v-model="v2" loading placeholder="Loading state..." />
    </div>
    <div>
      <span class="text-xs text-ink-gray-5 font-mono mb-1 block">error</span>
      <PhoneInput v-model="v3" error="Invalid phone number" placeholder="Error state" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PhoneInput from '../PhoneInput.vue'

const v1 = ref('+91-9876543210')
const v2 = ref('')
const v3 = ref('')
</script>
