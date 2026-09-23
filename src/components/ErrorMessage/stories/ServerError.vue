<script setup lang="ts">
import { ref } from 'vue'
import { Button, ErrorMessage } from 'frappe-ui'

const error = ref<Error | null>(null)

// Stands in for a failed call to a whitelisted method, which returns
// several messages on the error.
function save() {
  error.value = Object.assign(new Error('Validation failed'), {
    messages: [
      'Email <b>jane@example.com</b> is already in use.',
      'Phone number must include a country code.',
    ],
  })
}
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-3">
    <ErrorMessage :message="error ?? undefined" />
    <div class="flex gap-2">
      <Button variant="solid" @click="save">Save contact</Button>
      <Button v-if="error" @click="error = null">Dismiss</Button>
    </div>
  </div>
</template>
