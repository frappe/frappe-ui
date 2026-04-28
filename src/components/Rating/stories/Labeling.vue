<script setup lang="ts">
import { computed, ref } from 'vue'
import { Checkbox, Rating } from 'frappe-ui'

const value = ref(0)
const required = ref(true)
const showError = ref(false)

const error = computed(() =>
  showError.value ? 'Please rate before submitting.' : '',
)
</script>

<template>
  <div class="flex gap-8 items-start">
    <Rating
      v-model="value"
      label="Quality"
      description="How would you rate the experience?"
      :error="error"
      :required="required"
    />
    <div
      class="flex flex-col gap-2 items-start border-l border-outline-gray-2 pl-6"
    >
      <Checkbox v-model="required" label="required" />
      <Checkbox v-model="showError" label="show error" />
    </div>
  </div>
</template>
