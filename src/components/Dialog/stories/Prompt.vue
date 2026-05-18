<script setup lang="ts">
// `dialog.prompt(...)` — the full prompt surface in one place.
//
// Covers:
// - Basic prompt with `text` + `select` fields (and a `defaultValue`).
// - `type: 'combobox'` for searchable pickers, plus grouped options and
//   `allowCreate: true` (mirrors Combobox's `allowCustomValue` so the typed
//   query becomes the value when no option matches — useful for
//   category-style fields where users can add new entries inline).
// - Per-field `validate` — sync, async, and cross-field. Validators run
//   after the built-in `required` check, in parallel across all fields.
//   Returning a non-empty string marks the field invalid and renders that
//   string inline below it; returning `null`/`undefined`/`''` means valid.
//   The submit button keeps its loading state while async validators
//   settle, and errors clear the instant the user edits the field.
import { Button, dialog, Dialogs } from 'frappe-ui'

function newFolder() {
  dialog.prompt({
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
    onConfirm: async ({ values }) => {
      await new Promise((r) => setTimeout(r, 500))
      // eslint-disable-next-line no-console
      console.log('created folder', values)
    },
  })
}

const spaces = [
  { label: 'Engineering', value: 'engineering' },
  { label: 'Design', value: 'design' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Product', value: 'product' },
  { label: 'Operations', value: 'operations' },
  { label: 'Sales', value: 'sales' },
]

function moveDiscussion() {
  dialog.prompt({
    title: 'Move discussion',
    message: 'Pick a space to move this discussion to.',
    fields: [
      {
        name: 'space',
        label: 'Space',
        type: 'combobox',
        options: spaces,
        placeholder: 'Search spaces…',
        required: true,
      },
    ],
    confirmLabel: 'Move',
    onConfirm: async ({ values }) => {
      await new Promise((r) => setTimeout(r, 500))
      // eslint-disable-next-line no-console
      console.log('moved to', values.space)
    },
  })
}

function newSpaceWithCategory() {
  // Grouped + `allowCreate` — typing a brand new category name accepts
  // the query as the value instead of forcing the user to use the list.
  dialog.prompt({
    title: 'New space',
    fields: [
      {
        name: 'name',
        label: 'Space name',
        type: 'text',
        required: true,
        placeholder: 'e.g. Q4 Roadmap',
      },
      {
        name: 'category',
        label: 'Category',
        type: 'combobox',
        allowCreate: true,
        placeholder: 'Pick or type a new category',
        options: [
          {
            group: 'Existing',
            options: [
              { label: 'Engineering', value: 'engineering' },
              { label: 'Design', value: 'design' },
              { label: 'Product', value: 'product' },
            ],
          },
        ],
      },
    ],
    confirmLabel: 'Create',
    onConfirm: async ({ values }) => {
      await new Promise((r) => setTimeout(r, 500))
      // eslint-disable-next-line no-console
      console.log('created', values)
    },
  })
}

const reservedUsernames = new Set(['admin', 'root', 'support', 'me'])

function createAccount() {
  dialog.prompt({
    title: 'Create account',
    fields: [
      {
        name: 'username',
        label: 'Username',
        required: true,
        placeholder: 'jane.doe',
        // Async validator — pretend we're hitting the server to check
        // uniqueness. The submit button keeps spinning until this resolves.
        validate: async (value: string) => {
          await new Promise((r) => setTimeout(r, 600))
          if (reservedUsernames.has(value.toLowerCase())) {
            return `"${value}" is reserved. Pick another.`
          }
          if (value.length < 3) return 'Use at least 3 characters.'
          return null
        },
      },
      {
        name: 'email',
        label: 'Email',
        required: true,
        placeholder: 'jane@example.com',
        // Sync validator — runs in the same parallel pass as `username`.
        validate: (value: string) => {
          if (!value.includes('@')) return 'That doesn\'t look like an email.'
          return null
        },
      },
      {
        name: 'password',
        label: 'Password',
        type: 'text',
        required: true,
        // Cross-field validation via the second argument.
        validate: (value: string, all) => {
          if (value.length < 8) return 'Use at least 8 characters.'
          if (typeof all.username === 'string' && value.includes(all.username)) {
            return 'Password must not contain your username.'
          }
          return null
        },
      },
    ],
    confirmLabel: 'Create account',
    onConfirm: async ({ values }) => {
      await new Promise((r) => setTimeout(r, 500))
      // eslint-disable-next-line no-console
      console.log('created', values)
    },
  })
}
</script>

<template>
  <div class="w-full flex flex-wrap gap-2">
    <Button @click="newFolder">Basic (text + select)</Button>
    <Button @click="moveDiscussion">Combobox (single field)</Button>
    <Button @click="newSpaceWithCategory">
      Combobox + grouped + allowCreate
    </Button>
    <Button @click="createAccount">
      Per-field validate (sync + async + cross-field)
    </Button>
  </div>
  <Dialogs />
</template>
