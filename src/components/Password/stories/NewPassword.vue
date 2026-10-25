<script setup lang="ts">
import { ref } from 'vue'
import { Password } from 'frappe-ui'

const password = ref('')
const error = ref('')

function validate() {
  error.value = password.value.length < 8 ? 'Use at least 8 characters.' : ''
}
</script>

<template>
  <Password
    v-model="password"
    label="New password"
    description="At least 8 characters."
    autocomplete="new-password"
    required
    :error="error"
    class="w-full max-w-xs"
    @blur="validate"
  />
</template>
