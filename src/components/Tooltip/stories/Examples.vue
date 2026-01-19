<script setup lang="ts">
import { Button, Tooltip } from 'frappe-ui'
</script>

<template>
  <Tooltip text="This action cannot be undone" :hover-delay="1" placement="top">
    <Button theme="red">Delete</Button>
  </Tooltip>
</template>
