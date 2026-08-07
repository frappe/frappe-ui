<script setup lang="ts">
import { ref } from 'vue'
import { Switch } from 'frappe-ui'

const writing = ref({
  spelling: true,
  autocorrect: true,
  smartCompose: false,
})
</script>

<template>
  <div class="w-[420px] divide-y divide-outline-gray-1">
    <Switch
      v-model="writing.spelling"
      label="Spelling suggestions"
      description="Underline misspelled words as you type."
      class="w-full py-2.5"
    />
    <Switch
      v-model="writing.autocorrect"
      label="Autocorrect"
      description="Automatically fix common spelling mistakes."
      class="w-full py-2.5"
    />
    <Switch
      v-model="writing.smartCompose"
      label="Smart compose"
      description="Show predictive writing suggestions as you compose emails."
      class="w-full py-2.5"
    />
  </div>
</template>
