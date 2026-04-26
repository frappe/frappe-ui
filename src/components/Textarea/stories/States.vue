<script setup lang="ts">
import { Textarea } from 'frappe-ui'
</script>

<template>
  <Textarea label="Default" placeholder="Write something..." />
  <Textarea label="Required" required placeholder="Write something..." />
  <Textarea label="Disabled" disabled placeholder="Write something..." />
  <Textarea label="With error" error="Bio cannot be empty." placeholder="Write something..." />
</template>
