<script setup lang="ts">
import { ref } from 'vue'
import { Password } from 'frappe-ui'

const value = ref('')
const error = ref('')
const required = ref(true)
</script>

<template>
  <div class="flex flex-col gap-3 max-w-sm">
    <Password
      v-model="value"
      label="Password"
      description="At least 8 characters."
      :error="error"
      :required="required"
      placeholder="Enter password"
    />
    <div class="flex gap-3 items-center text-p-sm text-ink-gray-6">
      <label class="flex items-center gap-1">
        <input type="checkbox" v-model="required" />
        required
      </label>
      <button
        type="button"
        class="underline"
        @click="error = error ? '' : 'Password is too short.'"
      >
        toggle error
      </button>
    </div>
  </div>
</template>
