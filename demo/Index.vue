<script setup>
import { demos } from './demos'
import { List, ListCell, ListRow } from 'frappe-ui/list'
</script>

<template>
  <div class="min-h-screen bg-surface-base p-6 text-ink-gray-9">
    <div class="mx-auto max-w-3xl">
      <h1 class="mb-1 text-lg font-semibold">frappe-ui demos</h1>
      <p class="mb-5 text-base text-ink-gray-5">
        One route per demo. Press a row to open it.
      </p>

      <List class="w-full" :row-height="60">
        <ListRow
          v-for="demo in demos"
          :key="demo.slug"
          :value="demo.slug"
          :to="`/${demo.slug}`"
        >
          <ListCell>
            <span
              class="flex size-8 items-center justify-center rounded-md bg-surface-gray-2 text-ink-gray-7"
            >
              <span :class="demo.icon" class="size-4" aria-hidden="true" />
            </span>
          </ListCell>
          <ListCell>
            <div class="min-w-0">
              <div class="truncate text-base text-ink-gray-8">{{ demo.title }}</div>
              <div class="mt-1 truncate text-sm text-ink-gray-5">
                {{ demo.description }}
              </div>
            </div>
          </ListCell>
          <ListCell class="justify-end">
            <span class="lucide-chevron-right size-4 text-ink-gray-4" aria-hidden="true" />
          </ListCell>
        </ListRow>
      </List>
    </div>
  </div>
</template>
