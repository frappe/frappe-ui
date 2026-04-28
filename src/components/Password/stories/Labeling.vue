<script setup lang="ts">
import { computed, ref } from 'vue'
import { Checkbox, Password } from 'frappe-ui'

const value = ref('')
const required = ref(true)
const showError = ref(false)

const error = computed(() => (showError.value ? 'Password is too short.' : ''))
</script>

<template>
  <div class="flex gap-8 items-start">
    <Password
      v-model="value"
      label="Password"
      description="At least 8 characters."
      :error="error"
      :required="required"
      placeholder="Enter password"
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
