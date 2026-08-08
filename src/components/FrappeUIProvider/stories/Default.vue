<script setup lang="ts">
import { Button, FrappeUIProvider, dialog, toast } from 'frappe-ui'
</script>

<template>
  <!-- One provider, mounted once, is enough for both imperative helpers
       anywhere inside it. -->
  <FrappeUIProvider>
    <div class="flex gap-2">
      <Button
        label="Show toast"
        @click="toast.success('Saved')"
      />
      <Button
        label="Show dialog"
        @click="dialog.confirm({ title: 'Delete this?', theme: 'red' })"
      />
    </div>
  </FrappeUIProvider>
</template>
