<template>
  <FrappeUIProvider>
    <Story title="Toast Actions" :layout="{ width: 420 }">
      <Variant title="Action button">
        <div class="flex flex-wrap gap-2">
          <Button label="With action button" @click="showActionToast" />
          <Button label="Persistent + action" @click="showPersistentActionToast" />
        </div>
      </Variant>

      <Variant title="Promise">
        <div class="flex flex-wrap gap-2">
          <Button label="Resolve" @click="showResolvePromise" />
          <Button label="Reject" @click="showRejectPromise" />
        </div>
      </Variant>

      <Variant title="Update in place (id-keyed)">
        <Button label="Loading → success" @click="showUpdateInPlace" />
      </Variant>
    </Story>
  </FrappeUIProvider>
</template>

<script setup lang="ts">
import { Button, FrappeUIProvider, toast } from 'frappe-ui'

function showActionToast() {
  toast.success('Post archived', {
    action: {
      label: 'Undo',
      onClick() {
        toast.info('Archive undone')
      },
    },
  })
}

function showPersistentActionToast() {
  toast.info('Background sync in progress', {
    duration: Infinity,
    action: {
      label: 'Cancel',
      onClick: () => toast.dismiss(),
    },
  })
}

function showResolvePromise() {
  toast.promise(
    new Promise<string>((resolve) => setTimeout(() => resolve('done'), 1500)),
    {
      loading: 'Saving changes…',
      success: 'Changes saved',
      error: 'Failed to save changes',
    },
  )
}

function showRejectPromise() {
  toast.promise(
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Network error')), 1500),
    ),
    {
      loading: 'Saving changes…',
      success: 'Changes saved',
      error: (err: Error) => err.message,
    },
  )
}

function showUpdateInPlace() {
  const id = toast.loading('Uploading file…')
  setTimeout(() => {
    toast.success('Upload complete', { id })
  }, 2000)
}
</script>
