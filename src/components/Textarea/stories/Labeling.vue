<script setup lang="ts">
import { computed, ref } from 'vue'
import { Checkbox, Textarea } from 'frappe-ui'

const bio = ref('')
const required = ref(true)
const showError = ref(false)

const error = computed(() => (showError.value ? 'Bio cannot be empty.' : ''))
</script>

<template>
  <div class="flex gap-8 items-start">
    <Textarea
      v-model="bio"
      label="Bio"
      description="Tell us a bit about yourself."
      :error="error"
      :required="required"
      placeholder="Write something..."
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
