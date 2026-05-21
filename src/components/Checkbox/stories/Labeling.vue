<script setup lang="ts">
import { computed, ref } from 'vue'
import { Checkbox } from 'frappe-ui'

const accepted = ref(false)
const required = ref(true)
const showError = ref(false)

const error = computed(() =>
  showError.value ? 'You must accept the terms.' : '',
)
</script>

<template>
  <div class="flex gap-8 items-start">
    <Checkbox
      v-model="accepted"
      label="Accept terms"
      description="Required to continue."
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
