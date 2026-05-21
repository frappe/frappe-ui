<script setup lang="ts">
import { Button, toast } from 'frappe-ui'

function sendInvite() {
  toast.promise(new Promise<void>((resolve) => setTimeout(resolve, 1500)), {
    loading: 'Sending invite to alex@example.com…',
    success: 'Invite sent to alex@example.com',
    error: 'Could not send invite',
  })
}

function uploadFails() {
  toast.promise(
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Network error')), 1500),
    ),
    {
      loading: 'Uploading report.pdf…',
      success: 'Upload complete',
      error: (err: Error) => `Upload failed: ${err.message}`,
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
  <Button label="Upload fails" @click="uploadFails" />
  <Button label="Deploy pipeline" @click="deployPipeline" />
</template>
