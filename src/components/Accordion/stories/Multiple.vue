<script setup lang="ts">
import { ref } from 'vue'
import { Accordion } from 'frappe-ui'

const open = ref<string[]>(['general', 'billing'])

const items = [
  {
    value: 'general',
    title: 'General',
    content: 'Account-wide preferences such as language, timezone, and theme.',
  },
  {
    value: 'billing',
    title: 'Billing',
    content: 'Manage your plan, payment methods, and download past invoices.',
  },
  {
    value: 'notifications',
    title: 'Notifications',
    content: 'Choose which email and in-app notifications you want to receive.',
  },
]
</script>

<template>
  <div class="w-full max-w-lg">
    <Accordion type="multiple" v-model="open" :items="items" />
  </div>
</template>
