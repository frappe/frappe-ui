<script setup lang="ts">
import { Progress } from 'frappe-ui'
</script>

<template>
  <Progress
    :value="30"
    label="Progress"
    :intervals="true"
    :interval-count="5"
  />
</template>
