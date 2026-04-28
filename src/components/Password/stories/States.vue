<script setup lang="ts">
import { Password } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-4 items-start w-full max-w-sm">
    <Password label="Default" placeholder="Enter password" />
    <Password label="Required" required placeholder="Enter password" />
    <Password label="Disabled" disabled placeholder="Enter password" />
    <Password
      label="With error"
      error="Password is too short."
      placeholder="Enter password"
    />
  </div>
</template>
