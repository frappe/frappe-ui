<script setup lang="ts">
import { ref } from 'vue'
import { MultiEmailInput } from '..'

const emails = ref<string[]>(['ada@example.com'])
const options = [
  { label: 'Ada Lovelace', value: 'ada@example.com' },
  { label: 'Grace Hopper', value: 'grace@example.com' },
  { label: 'Alan Turing', value: 'alan@example.com' },
]
</script>

<template>
  <div class="max-w-md">
    <MultiEmailInput v-model="emails" :options="options" />
    <p class="mt-2 text-p-sm text-ink-gray-5">{{ emails.join(', ') }}</p>
  </div>
</template>
