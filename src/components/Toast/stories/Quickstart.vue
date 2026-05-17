<script setup lang="ts">
import { Button, toast } from 'frappe-ui'
</script>

<template>
  <Button label="Show toast" @click="toast.success('Workspace created')" />
</template>
