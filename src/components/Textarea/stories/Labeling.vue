<script setup lang="ts">
import { ref } from 'vue'
import { Button, Checkbox, Textarea } from 'frappe-ui'

const bio = ref('')
const error = ref('')
const required = ref(true)
</script>

<template>
  <div class="flex flex-col gap-3 max-w-sm">
    <Textarea
      v-model="bio"
      label="Bio"
      description="Tell us a bit about yourself."
      :error="error"
      :required="required"
      placeholder="Write something..."
    />
    <div class="flex gap-3 items-center">
      <Checkbox v-model="required" label="required" />
      <Button
        size="sm"
        @click="error = error ? '' : 'Bio cannot be empty.'"
      >
        Toggle error
      </Button>
    </div>
  </div>
</template>
