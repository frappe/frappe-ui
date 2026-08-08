<template>
  <div class="p-8 max-w-sm space-y-6">
    <PhoneInput
      v-model="val1"
      label="Mobile Number"
      description="We'll send a verification OTP code to this number."
      placeholder="Enter phone number"
    />
    <PhoneInput
      v-model="val2"
      label="Required Field"
      required
      placeholder="Required phone number"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PhoneInput from '../PhoneInput.vue'

const val1 = ref('')
const val2 = ref('')
</script>
