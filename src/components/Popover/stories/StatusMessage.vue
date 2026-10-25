<script setup lang="ts">
import { ref } from 'vue'
import { Button, Popover, TextInput } from 'frappe-ui'

const status = ref('In a meeting')
const draft = ref('')
const open = ref(false)

function save() {
  status.value = draft.value
  open.value = false
}
</script>

<template>
  <Popover v-model:open="open" :dismissible="false" @open="draft = status">
    <template #trigger>
      <Button
        icon-left="lucide-message-circle"
        :label="status || 'Set status'"
      />
    </template>
    <template #default>
      <div class="w-64 p-3">
        <TextInput v-model="draft" placeholder="What are you up to?" />
        <div class="mt-3 flex justify-end gap-2">
          <Button label="Cancel" @click="open = false" />
          <Button variant="solid" label="Save" @click="save" />
        </div>
      </div>
    </template>
  </Popover>
</template>
