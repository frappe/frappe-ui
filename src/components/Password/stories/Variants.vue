<script setup lang="ts">
import { Password } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-3 items-start w-full max-w-sm">
    <Password variant="subtle" placeholder="Subtle" />
    <Password variant="outline" placeholder="Outline" />
    <Password variant="ghost" placeholder="Ghost" />
  </div>
</template>
