<script setup lang="ts">
import LucideUser from "~icons/lucide/user";
import LucideDollar from "~icons/lucide/circle-dollar-sign";
import LucideMail from "~icons/lucide/mail";
import LucideAt from "~icons/lucide/at-sign";

import { Button } from "frappe-ui";

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
  <div class="grid grid-cols-3 gap-6">
    <div v-for="item in classNames" class="grid gap-3">
      <span>
        Shadow : {{ item.split("-")[1] }}
      </span>

      <div
        :class="item"
        class="rounded border border-outline-gray-2 grid gap-3 p-3 bg-surface-cards"
      >
        <span class="flex items-center gap-3 border-b pb-3">
          <div class="bg-surface-gray-2 p-2 w-fit rounded-full">
            <LucideUser class="size-4" />
          </div>
          Some Name
        </span>

        <div class="flex gap-2">
          <LucideDollar class="size-4" />
          <span class="text-ink-gray-5"> $ 12,00,00,000 </span>
        </div>

        <div class="flex gap-2 border-b pb-3">
          <LucideMail class="size-4" />
          <span class="text-ink-gray-5"> mail@example.com </span>
        </div>

        <div class="flex gap-2 items-center -mt-1">
          <LucideAt class="size-4" />
          <span class="mr-auto text-ink-gray-4">8</span>

          <Button>Add</Button>
        </div>
      </div>
    </div>
  </div>
</template>
