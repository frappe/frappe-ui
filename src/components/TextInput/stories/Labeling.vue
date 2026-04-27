<script setup lang="ts">
import { ref } from 'vue'
import { Button, Checkbox, TextInput } from 'frappe-ui'

const email = ref('')
const error = ref('')
const required = ref(true)
</script>

<template>
  <div class="flex flex-col gap-3 max-w-sm">
    <TextInput
      v-model="email"
      label="Email"
      description="We'll only use this to send product updates."
      :error="error"
      :required="required"
      placeholder="you@example.com"
    />
    <div class="flex flex-col gap-2 items-start">
      <Checkbox v-model="required" label="required" />
      <Button
        size="sm"
        @click="error = error ? '' : 'Email is required.'"
      >
        Toggle error
      </Button>
    </div>
  </div>
</template>
