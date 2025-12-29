<script setup lang="ts">
import LucideShield from "~icons/lucide/shield-alert";
import Button from "@/srcomponents/Button/Button.vue";

type BorderRadiusToken = {
  name: string;
  value: string;
};

const props = defineProps<{
  data: BorderRadiusToken[];
}>();

const data = props.data.slice(0, props.data.length - 1);
</script>

<template>
  <div class="grid grid-cols-3 gap-5 my-10">
    <div
      v-for="radius in data"
      :key="radius.name"
      class="grid gap-3"
    >
      <div class="text-sm justify-between flex">
        <span class="font-medium">
          {{ radius.name }}
        </span>
        <span class="ml-1 text-xs text-ink-gray-4">
          {{ radius.value }}
        </span>
      </div>

      <!-- card -->
      <div
        class="
          border grid gap-3
          border-outline-gray-2
          bg-surface-cards
          p-4
        "
        :style="{ borderRadius: radius.value }"
      >
        <div class="flex items-center gap-3 borer-b">
          <div
            class="size-8 grid place-items-center bg-surface-gray-2"
            :style="{ borderRadius: radius.value }"
          >
            <span class="text-xs font-medium">U</span>
          </div>
          <span class="font-medium whitespace-nowrap">Some Name</span>
        </div>

        <div class="text-sm text-ink-gray-5 grid gap-2">
          <span class="h-3 rounded-sm bg-surface-gray-2 w-1/2"> </span>
          <span class="h-5 rounded-sm bg-surface-gray-3 w-full"> </span>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-xs text-ink-gray-4">
            8 items
          </span>

          <button
            class="px-3 py-1 text-xs border bg-surface-white"
            :style="{ borderRadius: radius.value }"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>

  <p>Rounded-full looks good only for buttons or avatars</p>

  <div class="flex items-center gap-3">
    <Button variant="solid" class="!rounded-full px-5" size="lg">
      Button
    </Button>

    <Button size="lg" class="!rounded-full" theme="red">
      <template #icon>
        <LucideShield class="size-5" />
      </template>
    </Button>
  </div>
</template>
