<script setup lang="ts">
import { Accordion } from 'frappe-ui'

const items = [
  {
    value: 'shipping',
    title: 'How long does shipping take?',
    content:
      'Orders are processed within 1–2 business days and typically arrive within 5–7 business days.',
  },
  {
    value: 'returns',
    title: 'What is your return policy?',
    content:
      'You can return any unused item within 30 days of delivery for a full refund.',
  },
  {
    value: 'support',
    title: 'How do I contact support?',
    content:
      'Reach out to our team any time at support@example.com and we will get back to you within a day.',
  },
]
</script>

<template>
  <div class="w-full max-w-lg">
    <Accordion :items="items" default-value="shipping" />
  </div>
</template>
