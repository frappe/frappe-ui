<script setup lang="ts">
// Adapted from gameplan/NewTaskDialog.vue — a "new task" form with a
// single full-width primary action that owns the submit. Demonstrates
// using `dismissible` from a dirty-form flag, the canonical `#default`
// slot for the form, and an `#actions` slot that's a single CTA.
import { computed, ref } from 'vue'
import { Button, Dialog, FormControl, KeyboardShortcut } from 'frappe-ui'

const open = ref(false)
const task = ref({ title: '', description: '', assignee: '' })

const isDirty = computed(
  () => !!(task.value.title || task.value.description || task.value.assignee),
)

async function createTask(close: () => void) {
  await new Promise((r) => setTimeout(r, 500))
  task.value = { title: '', description: '', assignee: '' }
  close()
}
</script>

<template>
  <Button @click="open = true">New task</Button>

  <Dialog v-model:open="open" title="New task" :dismissible="!isDirty">
    <div class="space-y-4">
      <FormControl
        label="Title"
        v-model="task.title"
        placeholder="What needs to happen?"
        required
      />
      <FormControl
        label="Description"
        type="textarea"
        v-model="task.description"
      />
      <FormControl
        label="Assignee"
        v-model="task.assignee"
        placeholder="@username"
      />
    </div>

    <template #actions="{ close }">
      <Button
        class="w-full"
        variant="solid"
        :disabled="!task.title"
        @click="createTask(close)"
      >
        Create
        <template #suffix>
          <KeyboardShortcut ctrl>Enter</KeyboardShortcut>
        </template>
      </Button>
    </template>
  </Dialog>
</template>
