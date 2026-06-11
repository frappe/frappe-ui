<script setup>
import { Button } from 'frappe-ui'
</script>

<template>
  <div
    class="inline-flex items-center gap-3.5 rounded-6 bg-surface-base p-1.5 shadow-[0px_0px_1.5px_rgba(0,0,0,0.16),0px_2px_5px_rgba(0,0,0,0.14)]"
  >
    <Button variant="ghost" icon-left="lucide-x">2 selected</Button>
    <div class="h-5 w-px bg-outline-gray-1" />
    <div class="flex items-center gap-1">
      <Button variant="ghost" icon-left="lucide-download">Download</Button>
      <Button variant="ghost" icon-left="lucide-corner-up-right">Move</Button>
      <Button variant="ghost" icon-left="lucide-share-2">Share</Button>
      <Button variant="ghost" theme="red" icon-left="lucide-trash-2">
        Delete
      </Button>
    </div>
  </div>
</template>
