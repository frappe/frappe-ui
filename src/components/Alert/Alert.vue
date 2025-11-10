<script setup lang="ts">
import { computed } from "vue";

import type { AlertProps } from "./types";

import LucideX from "~icons/lucide/x";
import LucideInfo from "~icons/lucide/info";
import LucideCircleX from "~icons/lucide/circle-x";
import LucideCheck from "~icons/lucide/circle-check";
import LucideWarning from "~icons/lucide/triangle-alert";

const classes = computed(() => {
  const css = {
    warning: "bg-surface-amber-2",
    info: "bg-surface-blue-2",
    error: "bg-surface-red-2",
    success: "bg-surface-green-2",
  };
  return props.type ? css[props.type] : "bg-surface-gray-2";
});

const icon = computed(() => {
  const data = {
    warning: { component: LucideWarning, css: "text-ink-amber-3" },
    info: { component: LucideInfo, css: "text-ink-blue-3" },
    error: { component: LucideCircleX, css: "text-ink-red-3" },
    success: { component: LucideCheck, css: "text-ink-green-3" },
  };
  return props.type ? data[props.type] : null;
});

const props = withDefaults(defineProps<AlertProps>(), {});
</script>

<template>
  <div
    role="alert"
    :class="classes"
    class="flex gap-3 rounded-md px-4 py-3.5 text-base"
  >
    <slot name="icon">
      <component
        :is="icon.component"
        class="size-4 flex-shrink-0"
        v-if="icon"
        :class="icon.css"
      />
    </slot>

    <div class="grid gap-2">
      <span class="text-ink-gray-9"> {{ props.title }} </span>
      <p v-if="props.desc" class="text-ink-gray-6">{{ props.desc }}</p>
    </div>

    <LucideX v-if="props.closeIcon" class="size-4 ml-auto flex-shrink-0" />
  </div>
</template>
