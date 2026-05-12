<script setup lang="ts">
// Real-world imperative patterns drawn from gameplan/SpaceOptions and
// insights/workbooks.ts:
// - Destructive confirm with `theme: 'red'` and async work between
//   resolve and `close()` (so the action button keeps its loading state).
// - Minimal "import workbook?" confirm — just title + message.
// - One-shot alert after a save.
// - Prompt with required field + select.
// In real apps `<Dialogs />` is rendered by `FrappeUIProvider`, the same
// component that hosts the toast viewport. No extra setup needed.
import { Button, dialog, Dialogs } from 'frappe-ui'

async function deleteSpace() {
  const { ok, close } = await dialog.confirm({
    title: 'Delete space',
    message:
      'This will permanently delete the space along with 12 discussions and 4 tasks.',
    confirmLabel: 'Delete',
    theme: 'red',
  })
  if (ok) {
    await new Promise((r) => setTimeout(r, 900)) // pretend API call
  }
  close()
}

async function importWorkbook() {
  const { ok, close } = await dialog.confirm({
    title: 'Import workbook',
    message: 'Are you sure you want to import this workbook?',
  })
  if (ok) await new Promise((r) => setTimeout(r, 500))
  close()
}

async function savedAlert() {
  const { close } = await dialog.alert({
    title: 'Changes saved',
    message: 'Your changes are saved.',
    theme: 'green',
  })
  close()
}

async function newFolder() {
  const { values, close } = await dialog.prompt({
    title: 'New folder',
    fields: [
      {
        name: 'name',
        label: 'Folder name',
        type: 'text',
        required: true,
        placeholder: 'e.g. Q4 Plans',
      },
      {
        name: 'visibility',
        label: 'Visibility',
        type: 'select',
        defaultValue: 'private',
        options: [
          { label: 'Private', value: 'private' },
          { label: 'Team', value: 'team' },
          { label: 'Public', value: 'public' },
        ],
      },
    ],
    confirmLabel: 'Create',
  })
  if (values) {
    await new Promise((r) => setTimeout(r, 500))
    // eslint-disable-next-line no-console
    console.log('created folder', values)
  }
  close()
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <Button theme="red" variant="subtle" @click="deleteSpace">
      dialog.confirm (destructive)
    </Button>
    <Button @click="importWorkbook">dialog.confirm (minimal)</Button>
    <Button @click="savedAlert">dialog.alert</Button>
    <Button @click="newFolder">dialog.prompt</Button>
  </div>
  <!-- In real apps <FrappeUIProvider> auto-mounts <Dialogs />. -->
  <Dialogs />
</template>
