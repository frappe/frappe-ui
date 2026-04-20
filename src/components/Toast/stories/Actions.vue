<template>
  <FrappeUIProvider>
    <Story title="Toast Actions" :layout="{ width: 420 }">
      <Variant title="Action, persistent, and stacked examples">
        <div class="flex flex-wrap gap-2">
          <Button label="Show action toast" @click="showActionToast" />
          <Button label="Show persistent toast" @click="showPersistentToast" />
          <Button label="Show promise toast" @click="showPromiseToast" />
          <Button label="Show stacked toasts" @click="showStackedToasts" />
        </div>
      </Variant>
    </Story>
  </FrappeUIProvider>
</template>

<script setup lang="ts">
import { Button, FrappeUIProvider, toast } from 'frappe-ui'

function resetToasts() {
  toast.removeAll()
}

function showActionToast() {
  resetToasts()
  toast.success('Post archived', {
    action: {
      label: 'Undo',
      onClick() {
        toast.info('Archive undone')
      },
    },
  })
}

function showPersistentToast() {
  resetToasts()
  toast.info('Background sync in progress', {
    duration: 0,
    closable: false,
  })
}

function showPromiseToast() {
  resetToasts()
  void toast.promise(
    new Promise<string>((resolve) => {
      setTimeout(() => resolve('done'), 1000)
    }),
    {
      loading: 'Saving changes…',
      success: 'Changes saved',
      error: 'Failed to save changes',
    },
  )
}

async function showStackedToasts() {
  resetToasts()
  toast.info('First notification', { duration: 0 })
  await new Promise((resolve) => setTimeout(resolve, 500))
  toast.success('Second notification', { duration: 0 })
  await new Promise((resolve) => setTimeout(resolve, 700))
  toast.warning('Third notification', { duration: 0 })
}
</script>
