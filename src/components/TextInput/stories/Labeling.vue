<script setup lang="ts">
import { computed, ref } from 'vue'
import { Checkbox, TextInput } from 'frappe-ui'

const email = ref('')
const required = ref(true)
const showError = ref(false)

const error = computed(() => (showError.value ? 'Email is required.' : ''))
</script>

<template>
  <div class="flex gap-8 items-start">
    <TextInput
      v-model="email"
      label="Email"
      description="We'll only use this to send product updates."
      :error="error"
      :required="required"
      placeholder="you@example.com"
      class="w-72"
    />
    <div
      class="flex flex-col gap-2 items-start border-l border-outline-gray-2 pl-6"
    >
      <Checkbox v-model="required" label="required" />
      <Checkbox v-model="showError" label="show error" />
    </div>
  </div>
</template>
