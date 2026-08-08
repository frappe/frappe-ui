<template>
  <div class="p-8 max-w-sm space-y-6">
    <div>
      <span class="text-xs text-ink-gray-5 font-mono mb-1 block">size="sm"</span>
      <PhoneInput v-model="v1" size="sm" placeholder="Small input" />
    </div>
    <div>
      <span class="text-xs text-ink-gray-5 font-mono mb-1 block">size="md"</span>
      <PhoneInput v-model="v2" size="md" placeholder="Medium input" />
    </div>
    <div>
      <span class="text-xs text-ink-gray-5 font-mono mb-1 block">size="lg"</span>
      <PhoneInput v-model="v3" size="lg" placeholder="Large input" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PhoneInput from '../PhoneInput.vue'

const v1 = ref('')
const v2 = ref('')
const v3 = ref('')
</script>
