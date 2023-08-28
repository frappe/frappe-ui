<script setup lang="ts">
import Tooltip from './Tooltip.vue'
import Button from './Button.vue'
</script>
<template>
  <Story :layout="{ type: 'grid' }">
    <Tooltip text="This action cannot be undone">
      <Button theme="red">Delete data</Button>
    </Tooltip>
  </Story>
</template>
