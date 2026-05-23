<script setup>
import { Button } from 'frappe-ui'
</script>

<template>
  <div class="flex w-full max-w-[352px] items-center gap-2 p-3">
    <Button
      variant="ghost"
      icon-left="lucide-chevron-down"
      class="-ml-2 font-medium"
    >
      Contacts
    </Button>
    <div class="flex-1" />
    <Button icon-left="lucide-plus">Add contact</Button>
  </div>
</template>
