<script setup lang="ts">
import { Progress } from 'frappe-ui'
</script>

<template>
  <Progress :value="50" size="sm" label="Progress - sm" />
  <Progress :value="50" size="md" label="Progress - md" />
  <Progress :value="50" size="lg" label="Progress - lg" />
  <Progress :value="50" size="xl" label="Progress - xl" />
</template>
