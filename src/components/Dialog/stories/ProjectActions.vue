<script setup lang="ts">
// Rename and delete from a list without mounting a <Dialog> per row.
// `dialog.prompt` collects the new name, `dialog.danger` confirms the delete.
import { ref } from 'vue'
import { Button, dialog, Dialogs } from 'frappe-ui'

const projects = ref(['Website redesign', 'Mobile app', 'Q4 hiring'])

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

function rename(index: number) {
  const current = projects.value[index]
  dialog.prompt({
    title: 'Rename project',
    fields: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        defaultValue: current,
        validate: (value: string) =>
          projects.value.some((p) => p === value && p !== current)
            ? 'A project with this name already exists.'
            : null,
      },
    ],
    confirmLabel: 'Rename',
    onConfirm: async ({ values }) => {
      await wait(400)
      projects.value[index] = values.name
    },
  })
}

function remove(index: number) {
  dialog.danger({
    title: `Delete ${projects.value[index]}?`,
    message: 'Its tasks and files are deleted too. This cannot be undone.',
    onConfirm: async () => {
      await wait(400)
      projects.value.splice(index, 1)
    },
  })
}
</script>

<template>
  <div class="flex w-full max-w-md flex-col divide-y divide-outline-gray-1">
    <div
      v-for="(project, i) in projects"
      :key="project"
      class="flex items-center gap-2 py-2"
    >
      <span class="lucide-folder size-4 text-ink-gray-5" aria-hidden="true" />
      <span class="flex-1 text-base text-ink-gray-8">{{ project }}</span>
      <Button
        variant="ghost"
        icon="lucide-pencil"
        label="Rename"
        @click="rename(i)"
      />
      <Button
        variant="ghost"
        icon="lucide-trash-2"
        label="Delete"
        @click="remove(i)"
      />
    </div>
    <p
      v-if="!projects.length"
      class="py-4 text-center text-base text-ink-gray-5"
    >
      No projects left.
    </p>
  </div>
  <!-- In real apps <FrappeUIProvider> mounts <Dialogs /> for you. -->
  <Dialogs />
</template>
