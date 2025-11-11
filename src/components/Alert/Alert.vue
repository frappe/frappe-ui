<script setup lang="ts">
import { computed } from "vue";

import type { AlertProps } from "./types";

import LucideX from "~icons/lucide/x";
import LucideInfo from "~icons/lucide/info";
import LucideCircleX from "~icons/lucide/circle-x";
import LucideCheck from "~icons/lucide/circle-check";
import LucideWarning from "~icons/lucide/triangle-alert";

import Button from "../Button/Button.vue";

const visible = defineModel({ default: true });

const classes = computed(() => {
  const css = {
    warning: "bg-surface-amber-2",
    info: "bg-surface-blue-2",
    error: "bg-surface-red-2",
    success: "bg-surface-green-2",
  };
  return props.theme ? css[props.theme] : "bg-surface-gray-2";
});

const icon = computed(() => {
  const data = {
    warning: { component: LucideWarning, css: "text-ink-amber-3" },
    info: { component: LucideInfo, css: "text-ink-blue-3" },
    error: { component: LucideCircleX, css: "text-ink-red-3" },
    success: { component: LucideCheck, css: "text-ink-green-3" },
  };
  return props.theme ? data[props.theme] : null;
});

const props = withDefaults(defineProps<AlertProps>(), { dismissable: true });
</script>

<template>
  <div
    v-if="visible"
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

      <slot name="description">
        <p v-if="props.description" class="text-ink-gray-6 prose-sm">
          {{ props.description }}
        </p>
      </slot>
    </div>

    <Button
      v-if="props.dismissable"
      variant="ghost"
      @click="visible = false"
    >
      <LucideX class="size-4 ml-auto flex-shrink-0" />
    </Button>
  </div>
</template>
