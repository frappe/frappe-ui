<script setup lang="ts">
import { HoverCard } from 'frappe-ui'
</script>

<template>
  <p class="max-w-sm text-p-base text-ink-gray-8">
    Before you start, read the
    <HoverCard side="top" arrow>
      <template #trigger>
        <a href="#" class="text-ink-blue-link underline underline-offset-2">
          release checklist
        </a>
      </template>
      <template #default>
        <div class="w-72 p-3">
          <p class="text-sm text-ink-gray-5">wiki.example.com</p>
          <p class="mt-1 text-base-medium text-ink-gray-8">Release checklist</p>
          <p class="mt-1 text-p-sm text-ink-gray-6">
            The steps to follow before every release: tests, changelog, version
            bump and the announcement.
          </p>
        </div>
      </template>
    </HoverCard>
    and assign yourself a step.
  </p>
</template>
