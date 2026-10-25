<script setup lang="ts">
import { Avatar, Button } from 'frappe-ui'
</script>

<template>
  <div class="flex w-full max-w-md items-center gap-4">
    <!-- A size-* class goes past the largest size step. -->
    <Avatar
      image="https://i.pravatar.cc/160?u=jane@example.com"
      label="Jane Cooper"
      class="size-16"
    />
    <div class="flex flex-1 flex-col gap-1">
      <span class="text-xl font-semibold text-ink-gray-9">Jane Cooper</span>
      <span class="text-base text-ink-gray-6"
        >Product designer · Bengaluru</span
      >
    </div>
    <Button label="Message" icon-left="lucide-message-circle" />
  </div>
</template>
