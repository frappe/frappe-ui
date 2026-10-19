<script setup lang="ts">
import { Avatar, AvatarBadge } from 'frappe-ui'
</script>

<template>
  <div class="flex items-center gap-3">
    <Avatar
      image="https://i.pravatar.cc/80?u=jane@example.com"
      label="Jane Cooper"
      size="3xl"
    >
      <template #indicator>
        <AvatarBadge class="bg-surface-blue-6">
          <span class="lucide-check size-2" aria-hidden="true" />
          <span class="sr-only">Verified</span>
        </AvatarBadge>
      </template>
    </Avatar>
    <div class="flex flex-col gap-0.5">
      <span class="text-base font-medium text-ink-gray-9">Jane Cooper</span>
      <span class="text-sm text-ink-gray-5">Verified account</span>
    </div>
  </div>
</template>
