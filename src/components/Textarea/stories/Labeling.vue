<script setup lang="ts">
import { ref } from 'vue'
import { Textarea } from 'frappe-ui'

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
    <div class="flex gap-3 items-center text-p-sm text-ink-gray-6">
      <label class="flex items-center gap-1">
        <input type="checkbox" v-model="required" />
        required
      </label>
      <button
        type="button"
        class="underline"
        @click="error = error ? '' : 'Bio cannot be empty.'"
      >
        toggle error
      </button>
    </div>
  </div>
</template>
