<template>
  <div class="p-8 max-w-sm space-y-6">
    <div>
      <span class="text-xs text-ink-gray-5 font-mono mb-1 block">variant="subtle"</span>
      <PhoneInput v-model="v1" variant="subtle" placeholder="Subtle variant" />
    </div>
    <div>
      <span class="text-xs text-ink-gray-5 font-mono mb-1 block">variant="outline"</span>
      <PhoneInput v-model="v2" variant="outline" placeholder="Outline variant" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PhoneInput from '../PhoneInput.vue'

const v1 = ref('')
const v2 = ref('')
</script>
