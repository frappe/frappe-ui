<script setup lang="ts">
import { Progress } from 'frappe-ui'
</script>

<template>
  <div class="grid w-full max-w-[400px] gap-5">
    <Progress :value="50" size="sm" label="sm" />
    <Progress :value="50" size="md" label="md" />
    <Progress :value="50" size="lg" label="lg" />
    <Progress :value="50" size="xl" label="xl" />
  </div>
</template>
