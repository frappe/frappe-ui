<template>
  <FrappeUIProvider>
    <Story title="Toast Examples" :layout="{ width: 420 }">
      <Variant title="Basic types">
        <div class="flex flex-wrap gap-2">
          <Button label="Message" @click="() => toast.message('Hello there')" />
          <Button label="Info" @click="() => toast.info('File uploaded')" />
          <Button label="Success" @click="() => toast.success('Workspace created')" />
          <Button label="Warning" @click="() => toast.warning('You have unsaved changes')" />
          <Button label="Error" @click="() => toast.error('Failed to save changes')" />
          <Button label="Loading" @click="() => toast.loading('Syncing data…')" />
        </div>
      </Variant>

      <Variant title="Update in place (loading → success)">
        <Button label="Start async task" @click="updateInPlace" />
      </Variant>

      <Variant title="Promise">
        <Button label="promise toast" @click="promiseToast" />
      </Variant>

      <Variant title="Custom component">
        <Button label="Custom toast" @click="customToast" />
      </Variant>

      <Variant title="Action button">
        <Button label="Action toast" @click="actionToast" />
      </Variant>
    </Story>
  </FrappeUIProvider>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { Button, FrappeUIProvider, toast } from 'frappe-ui'

function updateInPlace() {
  const id = toast.loading('Saving…')
  setTimeout(() => {
    toast.success('Saved successfully', { id })
  }, 1500)
}

function promiseToast() {
  toast.promise(
    new Promise<string>((resolve) => setTimeout(() => resolve('done'), 1500)),
    {
      loading: 'Saving changes…',
      success: 'Changes saved',
      error: 'Failed to save changes',
    },
  )
}

function customToast() {
  const CustomContent = h(
    'div',
    { class: 'flex items-center gap-2 text-sm' },
    [
      h('span', { class: 'lucide-sparkles size-4 text-ink-amber-2' }),
      h('span', 'Custom component inside a toast'),
    ],
  )
  toast.custom(() => CustomContent)
}

function actionToast() {
  toast.success('Post archived', {
    action: {
      label: 'Undo',
      onClick: () => toast.info('Archive undone'),
    },
  })
}
</script>
