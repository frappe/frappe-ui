<script setup lang="ts">
import { ref } from 'vue'
import { Button, Password, TextInput } from 'frappe-ui'

const email = ref('')
const password = ref('')
</script>

<template>
  <form class="flex w-full max-w-xs flex-col gap-4" @submit.prevent>
    <TextInput
      v-model="email"
      type="email"
      label="Email"
      placeholder="jane@example.com"
      autocomplete="email"
    />
    <Password
      v-model="password"
      label="Password"
      autocomplete="current-password"
    >
      <template #prefix>
        <span class="lucide-lock size-4 text-ink-gray-5" aria-hidden="true" />
      </template>
    </Password>
    <Button variant="solid" type="submit">Sign in</Button>
  </form>
</template>
