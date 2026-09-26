<script setup lang="ts">
import { ref } from 'vue'
import { TextInput } from 'frappe-ui'

const email = ref('')
const error = ref('')

function validate() {
  if (!email.value) error.value = 'Enter your work email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
    error.value = 'This does not look like an email address.'
  else error.value = ''
}
</script>

<template>
  <TextInput
    v-model="email"
    type="email"
    label="Work email"
    description="We send a confirmation link to this address."
    placeholder="jane@example.com"
    name="email"
    required
    :error="error"
    class="w-full max-w-xs"
    @blur="validate"
  />
</template>
