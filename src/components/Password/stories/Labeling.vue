<script setup lang="ts">
import { ref } from 'vue'
import { Button, Checkbox, Password } from 'frappe-ui'

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
    <div class="flex gap-3 items-center">
      <Checkbox v-model="required" label="required" />
      <Button
        size="sm"
        @click="error = error ? '' : 'Password is too short.'"
      >
        Toggle error
      </Button>
    </div>
  </div>
</template>
