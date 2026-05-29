<script setup lang="ts">
import { Button, toast } from 'frappe-ui'

function sendInvite() {
  toast.promise(new Promise<void>((resolve) => setTimeout(resolve, 1500)), {
    loading: 'Sending invite to alex@example.com…',
    success: 'Invite sent to alex@example.com',
    error: 'Could not send invite',
  })
}

function deleteFile() {
  const file = { id: 'f_42', name: 'report.pdf' }
  const willFail = Math.random() < 0.5

  toast.promise(
    new Promise<{ id: string; name: string }>((resolve, reject) =>
      setTimeout(
        () =>
          willFail
            ? reject(new Error('Network error'))
            : resolve(file),
        1500,
      ),
    ),
    {
      loading: `Deleting ${file.name}…`,
      success: (deleted) => ({
        message: `Deleted ${deleted.name}`,
        action: {
          label: 'Undo',
          onClick: () => toast.success(`Restored ${deleted.name}`),
        },
      }),
      error: (err: Error) => ({
        message: `Couldn't delete ${file.name} — ${err.message}`,
        action: {
          label: 'Retry',
          onClick: () => deleteFile(),
        },
      }),
    },
  )
}

function deployPipeline() {
  const steps = [
    { label: 'Linting…', delay: 0 },
    { label: 'Type-checking…', delay: 600 },
    { label: 'Running tests…', delay: 1200 },
    { label: 'Building…', delay: 1900 },
    { label: 'Deploying to production…', delay: 2700 },
  ]
  const id = toast.loading(steps[0].label)
  steps.slice(1).forEach((step) => {
    setTimeout(() => toast.loading(step.label, { id }), step.delay)
  })
  setTimeout(
    () =>
      toast.success('Deployed to production', {
        id,
        description: 'v2.4.1 is live • took 3.6s',
      }),
    3500,
  )
}
</script>

<template>
  <Button label="Send invite" @click="sendInvite" />
  <Button label="Delete file" @click="deleteFile" />
  <Button label="Deploy pipeline" @click="deployPipeline" />
</template>
