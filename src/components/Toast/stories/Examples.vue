<template>
  <FrappeUIProvider>
    <Story title="Toast Examples" :layout="{ width: 420 }">
      <Variant title="Info / Success / Warning / Error">
        <div class="flex flex-wrap gap-2">
          <Button label="Info" @click="showInfo" />
          <Button label="Success" @click="showSuccess" />
          <Button label="Warning" @click="showWarning" />
          <Button label="Error" @click="showError" />
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

function showInfo() {
  resetToasts()
  toast.info('Saved successfully')
}

function showSuccess() {
  resetToasts()
  toast.success('Workspace created')
}

function showWarning() {
  resetToasts()
  toast.warning('You have unsaved changes')
}

function showError() {
  resetToasts()
  toast.error('Failed to save changes')
}
</script>
