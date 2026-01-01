<script setup lang="ts">
import LucideUser from "~icons/lucide/user";

const classNames = [
  "shadow-none",
  "shadow-sm",
  "shadow-md",
  "shadow-lg",
  "shadow-xl",
  "shadow-2xl",
];
</script>

<template>
  <div class="grid grid-cols-3 gap-6 mt-10">
    <div v-for="item in classNames" class="grid gap-3">
      <span>
        Shadow : {{ item.split("-")[1] }}
      </span>

      <div
        :class="item"
        class="rounded border grid gap-3 p-3 bg-surface-cards"
      >
        <span class="flex items-center gap-3 border-b pb-3">
          <div class="bg-surface-gray-2 p-2 w-fit rounded-full">
            <LucideUser class="size-4" />
          </div>
          Some Name
        </span>

        <div class="text-sm text-ink-gray-5 grid gap-2">
          <span class="h-3 rounded-sm bg-surface-gray-2 w-1/2"> </span>
          <span class="h-5 rounded-sm bg-surface-gray-3 w-full"> </span>
        </div>

        <div class="flex gap-2 items-center">
          <span class="mr-auto text-ink-gray-4">8 items</span>
          <span >@</span>
        </div>
      </div>
    </div>
  </div>
</template>
