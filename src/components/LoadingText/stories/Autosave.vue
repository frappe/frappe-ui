<script setup lang="ts">
import { ref } from 'vue'
import { Button, LoadingText, TextInput } from 'frappe-ui'

const title = ref('Quarterly planning notes')
const saving = ref(false)

function save() {
  saving.value = true
  setTimeout(() => (saving.value = false), 1500)
}
</script>

<template>
  <div class="w-80 space-y-3">
    <TextInput v-model="title" label="Title" />
    <div class="flex items-center justify-between">
      <LoadingText v-if="saving" text="Saving..." />
      <span v-else class="text-base text-ink-gray-4">All changes saved</span>
      <Button label="Save" :disabled="saving" @click="save" />
    </div>
  </div>
</template>
