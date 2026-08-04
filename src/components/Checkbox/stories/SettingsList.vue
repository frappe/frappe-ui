<script setup lang="ts">
import { ref } from 'vue'
import { Checkbox } from 'frappe-ui'

const settings = ref({
  email: true,
  mentions: true,
  threads: true,
  events: false,
})
</script>

<template>
  <div class="flex w-96 flex-col gap-4">
    <Checkbox v-model="settings.email" label="Enable email notifications" />
    <Checkbox v-model="settings.mentions" label="Mentions" />
    <Checkbox
      v-model="settings.threads"
      label="Email threads on assigned document"
      description="Get notified when an email is received on any of the documents assigned to you."
    />
    <Checkbox v-model="settings.events" label="Event reminders" />
  </div>
</template>
