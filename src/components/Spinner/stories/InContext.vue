<script setup lang="ts">
import { Button } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <Button theme="gray" variant="solid" :loading="true" loading-text="Saving" />
    <Button theme="red" variant="subtle" :loading="true" loading-text="Deleting" />
    <Button theme="gray" variant="ghost" :loading="true" loading-text="Loading" />
    <Button theme="gray" variant="subtle" :loading="true" loading-text="Get app" />
  </div>
</template>
