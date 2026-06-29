<script setup lang="ts">
import { Avatar, HoverCard } from 'frappe-ui'
</script>

<template>
  <HoverCard>
    <template #trigger>
      <a href="#" class="text-ink-gray-9 underline underline-offset-2">
        @jane
      </a>
    </template>
    <template #default>
      <div class="flex w-64 gap-3 p-3">
        <Avatar
          label="Jane Doe"
          image="https://avatars.githubusercontent.com/u/499550?v=4"
          size="2xl"
        />
        <div>
          <p class="text-p-base font-medium text-ink-gray-9">Jane Doe</p>
          <p class="mt-1 text-p-sm text-ink-gray-6">
            Designer. Likes hover cards.
          </p>
        </div>
      </div>
    </template>
  </HoverCard>
</template>
