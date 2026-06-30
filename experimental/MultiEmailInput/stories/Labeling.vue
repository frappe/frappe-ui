<script setup lang="ts">
import { computed, ref } from 'vue'
import { MultiEmailInput } from '..'

const emails = ref<string[]>([])
const options = [
  { label: 'Ada Lovelace', value: 'ada@example.com' },
  { label: 'Grace Hopper', value: 'grace@example.com' },
]

// Surface a required-field error until at least one address is added.
const error = computed(() =>
  emails.value.length ? '' : 'Add at least one recipient.',
)
</script>

<template>
  <div class="max-w-md">
    <MultiEmailInput
      v-model="emails"
      :options="options"
      label="Invite by email"
      description="Pick existing users, or type a new address and press Enter."
      :required="true"
      :error="error"
    />
  </div>
</template>
