<script setup lang="ts">
import { computed, ref } from "vue";

import { Avatar, Button, Dropdown } from "frappe-ui";
import LucideBell from "~icons/lucide/bell";
import LucideServer from "~icons/lucide/server";
import LucideLeft from "~icons/lucide/chevron-left";
import LucideRight from "~icons/lucide/chevron-right";
import LucideArchive from "~icons/lucide/archive-restore";

const data = ref([
  {
    label: "Server Down",
    txt: "Server #42 is secretly down.",
    icon: LucideServer,
    at: "2025-12-21T06:30:00Z",
    css: "text-ink-red-4",
  },
  {
    label: "Backup Completed",
    txt: "Scheduled backup has finished.",
    icon: LucideArchive,
    at: "2025-12-21T03:00:00Z",
    css: "text-ink-blue-3",
  },
  {
    id: "3",
    label: "New Message",
    txt: "Sid, Can you share the report?",
    at: "2025-12-20T09:15:00Z",
    img: "https://avatars.githubusercontent.com/u/59060246?v=4&size=64",
  },
  {
    label: "High CPU Usage",
    txt: "CPU usage crossed 92%",
    icon: LucideServer,
    at: "2025-12-21T05:45:00Z",
    css: "text-ink-red-4",
  },
  {
    label: "Deployment Success",
    txt: "v2.4.1 deployed to production.",
    icon: LucideArchive,
    at: "2025-12-20T22:00:00Z",
    css: "text-ink-green-3",
  },
  {
    label: "Mentioned You",
    txt: "Bob mentioned you in #infra.",
    at: "2025-12-19T14:30:00Z",
    img: "https://avatars.githubusercontent.com/u/34373719?v=4&size=64",
  },
]);

const curIndex = ref(0);

const nextItem = () => {
  curIndex.value++;
  if (curIndex.value >= data.value.length) {
    curIndex.value = 0;
  }
};

const prevItem = () => {
  curIndex.value--;
  if (curIndex.value < 0) {
    curIndex.value = data.value.length - 1;
  }
};

const items = computed(() =>
  data.value.slice(curIndex.value, curIndex.value + 3)
);
</script>

<template>
  <div class="bg-surface-cards border rounded-xl p-4 grid gap-5">
    <b class="inline-flex items-center gap-3">
      <LucideBell class="size-4" /> Notifications
    </b>

    <div
      v-for="x in items"
      :key="x.label"
      class="grid grid-cols-[auto_1fr] gap-3 animate-fade-in"
    >
      <Avatar
        v-if="x.img"
        :image="x.img"
        size="2xl"
        shape="square"
        class="ml-0.5"
      />

      <span
        v-else
        class="bg-surface-gray-2 rounded p-3 flex m-auto"
        :class="x.css"
      >
        <component :is="x.icon" class="size-5 shrink-0" />
      </span>

      <div>
        <div class="font-medium flex justify-between gap-7">
          {{ x.label }}
          <span class="text-sm text-ink-gray-5 ml-auto">
            {{ x.time }} ago
          </span>
        </div>
        <p class="text-sm text-ink-gray-5 leading-relaxed mt-1">{{ x.txt }}</p>
      </div>
    </div>

    <hr class="border-outline-gray-2 -mx-4 " />

    <div class="-my-2 -mx-2 flex gap-3">
      <Button class="mr-auto" @click="prevItem">
        <template #prefix>
          <LucideLeft class="size-4" />
        </template>
        Prev
      </Button>

      <Button class="ml-auto" @click="nextItem">
        <template #suffix>
          <LucideRight class="size-4" />
        </template>
        Next
      </Button>
    </div>
  </div>
</template>

<style>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}
</style>
