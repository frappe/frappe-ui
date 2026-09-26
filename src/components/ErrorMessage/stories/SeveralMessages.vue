<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, ErrorMessage, TextInput } from 'frappe-ui'

const email = ref('')
const password = ref('')
const submitted = ref(false)

const errors = computed(() => {
  if (!submitted.value) return []
  const list: string[] = []
  if (!email.value) list.push('Email is required.')
  if (password.value.length < 8)
    list.push('Password must be at least 8 characters.')
  return list
})
</script>

<template>
  <form
    class="flex w-full max-w-xs flex-col gap-3"
    @submit.prevent="submitted = true"
  >
    <TextInput
      v-model="email"
      type="email"
      placeholder="Email"
      aria-label="Email"
    />
    <TextInput
      v-model="password"
      type="password"
      placeholder="Password"
      aria-label="Password"
    />
    <ErrorMessage :message="errors" />
    <Button variant="solid" type="submit">Create account</Button>
  </form>
</template>
