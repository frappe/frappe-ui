<script setup>
import { Alert, Button } from 'frappe-ui'
</script>

<template>
  <Alert
    title="Your trial ends soon!"
    variant="outline"
    description="Upgrade to keep enjoying features and future technical support."
  >
    <template #icon>
      <span class="lucide-badge-info size-4" />
    </template>

    <template #footer>
      <Button class="col-span-full" variant="solid"> Update now </Button>
    </template>
  </Alert>
</template>
