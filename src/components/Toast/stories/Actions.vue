<script setup lang="ts">
import { Button, toast } from 'frappe-ui'

function postArchived() {
  toast.success('Post archived', {
    action: {
      label: 'Undo',
      onClick: () => toast.info('Archive undone'),
    },
  })
}

function newVersion() {
  toast.info('A new version is available', {
    description: 'Refresh to get the latest features.',
    duration: Infinity,
    action: {
      label: 'Refresh',
      onClick: () => toast.loading('Refreshing…'),
    },
  })
}

function backgroundSync() {
  toast.info('Background sync in progress', {
    duration: Infinity,
    action: {
      label: 'Cancel',
      onClick: () => toast.dismiss(),
    },
  })
}
</script>

<template>
  <Button label="Post archived" @click="postArchived" />
  <Button label="New version" @click="newVersion" />
  <Button label="Background sync" @click="backgroundSync" />
</template>
