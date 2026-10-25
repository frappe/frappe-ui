<script setup lang="ts">
import { Button, dialog, toast } from 'frappe-ui'
</script>

<template>
  <!-- This docs site wraps every page in <FrappeUIProvider>, as your app root
       would. Wrapping this preview again would mount a second toast host and
       show every toast twice. -->
  <div class="flex gap-2">
    <Button label="Show toast" @click="toast.success('Saved')" />
    <Button
      label="Show dialog"
      @click="dialog.confirm({ title: 'Delete this?', theme: 'red' })"
    />
  </div>
</template>
