<script setup lang="ts">
import { reactive } from 'vue'
import { Checkbox } from 'frappe-ui'

const ticketTypes = reactive({
  primary: true,
  promotions: true,
  social: true,
  updates: true,
})
</script>

<template>
  <div class="flex gap-3 items-start border-b border-outline-gray-1 py-3 w-[28rem]">
    <p class="text-base text-ink-gray-7 pt-1.5 w-40 shrink-0">Default ticket type</p>
    <div class="flex flex-col gap-1 items-start">
      <Checkbox v-model="ticketTypes.primary" label="Primary" disabled />
      <Checkbox v-model="ticketTypes.promotions" label="Promotions" />
      <Checkbox v-model="ticketTypes.social" label="Social" />
      <Checkbox v-model="ticketTypes.updates" label="Updates" />
    </div>
  </div>
</template>
