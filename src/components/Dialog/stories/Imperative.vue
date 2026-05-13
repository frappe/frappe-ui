<script setup lang="ts">
// Imperative `dialog.*` API — the full confirm-family surface in one place.
//
// Covers:
// - `dialog.confirm`     — basic + destructive (`theme: 'red'`) + async `onConfirm`.
// - `dialog.confirm({ actions })` — flows with more than the default
//   confirm + cancel pair (paste/replace/cancel, save/discard/cancel,
//   inline error from a throwing handler).
// - `dialog.danger`      — preset for irreversible actions; forces
//   `theme: 'red'` + warning icon, defaults `confirmLabel` to 'Delete',
//   and composes with `actions[]` for "delete with options" flows.
//
// In real apps `<Dialogs />` is mounted by `FrappeUIProvider`, the same
// component that hosts the toast viewport. No extra setup needed.
import { Button, dialog, Dialogs } from 'frappe-ui'

function destructiveConfirm() {
  dialog.confirm({
    title: 'Delete space',
    message:
      'This will permanently delete the space along with 12 discussions and 4 tasks.',
    confirmLabel: 'Delete',
    theme: 'red',
    onConfirm: async () => {
      await new Promise((r) => setTimeout(r, 900))
    },
  })
}

function minimalConfirm() {
  dialog.confirm({
    title: 'Import workbook',
    message: 'Are you sure you want to import this workbook?',
    onConfirm: async () => {
      await new Promise((r) => setTimeout(r, 500))
    },
  })
}

// Each action's button props (theme, variant, icon, …) flow through to the
// underlying `Button`. Each action's `onClick` is awaited independently —
// the clicked button shows a loading spinner while its handler is pending,
// and every other button is disabled until it settles.
function pastePage() {
  dialog.confirm({
    title: 'Paste page',
    message:
      'A page with this name already exists. Create a new copy or replace the current page?',
    actions: [
      { label: 'Cancel', variant: 'outline' },
      {
        label: 'Create copy',
        onClick: async () => {
          await new Promise((r) => setTimeout(r, 600))
        },
      },
      {
        label: 'Replace',
        theme: 'red',
        variant: 'solid',
        onClick: async () => {
          await new Promise((r) => setTimeout(r, 900))
        },
      },
    ],
  })
}

function navigateAway() {
  dialog.confirm({
    title: 'Unsaved changes',
    message: 'You have unsaved changes. Save before leaving?',
    actions: [
      { label: 'Cancel', variant: 'outline' },
      {
        label: 'Discard',
        theme: 'red',
        variant: 'subtle',
        onClick: () => {
          // eslint-disable-next-line no-console
          console.log('discarded')
        },
      },
      {
        label: 'Save and leave',
        variant: 'solid',
        onClick: async () => {
          await new Promise((r) => setTimeout(r, 700))
        },
      },
    ],
  })
}

// Throwing inside `onClick` is caught and rendered as an inline error,
// and every button re-enables so the user can retry or cancel.
function actionThatFails() {
  dialog.confirm({
    title: 'Send invitation',
    message: 'Send an invite to jane@example.com?',
    actions: [
      { label: 'Cancel', variant: 'outline' },
      {
        label: 'Send',
        variant: 'solid',
        onClick: async () => {
          await new Promise((r) => setTimeout(r, 500))
          throw new Error('Server rejected the invitation: rate limit hit.')
        },
      },
    ],
  })
}

function dangerDelete() {
  dialog.danger({
    title: 'Delete comment',
    message: 'Are you sure you want to delete this comment?',
    onConfirm: async () => {
      await new Promise((r) => setTimeout(r, 500))
    },
  })
}

function dangerCustomLabel() {
  // `confirmLabel` overrides the default 'Delete' when the action isn't a
  // delete in the literal sense.
  dialog.danger({
    title: 'Revoke invitation',
    message: 'This will revoke jane@example.com\'s pending invitation.',
    confirmLabel: 'Revoke',
    onConfirm: async () => {
      await new Promise((r) => setTimeout(r, 500))
    },
  })
}

function dangerWithActions() {
  // `actions[]` composes with `danger` — useful for "delete with options"
  // (e.g., delete only this occurrence vs the whole series).
  dialog.danger({
    title: 'Delete recurring task',
    message: 'How would you like to delete this task?',
    actions: [
      { label: 'Cancel', variant: 'outline' },
      {
        label: 'This occurrence',
        variant: 'subtle',
        theme: 'red',
        onClick: async () => {
          await new Promise((r) => setTimeout(r, 400))
        },
      },
      {
        label: 'Entire series',
        variant: 'solid',
        theme: 'red',
        onClick: async () => {
          await new Promise((r) => setTimeout(r, 400))
        },
      },
    ],
  })
}

// Close-behavior matrix for `onConfirm`:
//   • resolves        → auto-closes (close() runs after the await)
//   • throws / rejects → stays open, thrown message rendered inline
//   • calls close()    → closes immediately (the trailing auto-close is a no-op)
//
// Note: calling `ctx.setError(msg)` from inside `onConfirm` without throwing
// does NOT keep the dialog open — the auto-close still fires after the
// handler resolves. Use `throw` to stay open with an inline error.
function optimisticClose() {
  // Closes the dialog right away, then finishes the work in the background —
  // useful when the user has already committed and the UI shouldn't block.
  dialog.confirm({
    title: 'Send report',
    message: 'Send the weekly report to your team? The dialog will close immediately.',
    confirmLabel: 'Send',
    onConfirm: async ({ close }) => {
      close()
      await new Promise((r) => setTimeout(r, 1500))
      // eslint-disable-next-line no-console
      console.log('report sent in background')
    },
  })
}

// Stay open after an async call by throwing. The thrown message flows through
// `extractErrorMessage` and is rendered inline; the confirm button re-enables
// so the user can retry, edit, or cancel. This is the canonical pattern for
// server-side validation failures (e.g., username taken, quota exceeded).
function keepOpenAfterAsync() {
  dialog.confirm({
    title: 'Claim username',
    message: 'Claim the username "frappe-fan"? This pretends to call the server.',
    confirmLabel: 'Claim',
    onConfirm: async () => {
      await new Promise((r) => setTimeout(r, 700))
      // Server says no — throw to keep the dialog open with the reason.
      throw new Error('That username is already taken. Try a different one.')
    },
  })
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap gap-2">
      <Button theme="red" variant="subtle" @click="destructiveConfirm">
        dialog.confirm (destructive)
      </Button>
      <Button @click="minimalConfirm">dialog.confirm (minimal)</Button>
    </div>

    <div class="flex flex-wrap gap-2">
      <Button @click="pastePage">3 actions (paste page)</Button>
      <Button @click="navigateAway">3 actions (save/discard/cancel)</Button>
      <Button @click="actionThatFails">Action that throws</Button>
    </div>

    <div class="flex flex-wrap gap-2">
      <Button theme="red" variant="subtle" @click="dangerDelete">
        dialog.danger (delete)
      </Button>
      <Button theme="red" variant="subtle" @click="dangerCustomLabel">
        dialog.danger (custom label)
      </Button>
      <Button theme="red" variant="subtle" @click="dangerWithActions">
        dialog.danger + actions[]
      </Button>
    </div>

    <div class="flex flex-wrap gap-2">
      <Button @click="optimisticClose">close() before await</Button>
      <Button @click="keepOpenAfterAsync">stay open after async (throw)</Button>
    </div>
  </div>
  <!-- In real apps <FrappeUIProvider> auto-mounts <Dialogs />. -->
  <Dialogs />
</template>
