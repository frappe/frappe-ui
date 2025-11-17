<script setup lang="ts">
import { computed } from 'vue'

import type { AlertProps } from "./types";

import LucideX from "~icons/lucide/x";
import LucideInfo from "~icons/lucide/info";
import LucideCircleX from "~icons/lucide/circle-x";
import LucideCheck from "~icons/lucide/circle-check";
import LucideWarning from "~icons/lucide/triangle-alert";

const visible = defineModel({ default: true });

const classes = computed(() => {
  const subtleBgs = {
    yellow: "bg-surface-amber-2",
    blue: "bg-surface-blue-2",
    red: "bg-surface-red-2",
    green: "bg-surface-green-2",
  };

  if (props.variant == "outline") return "border border-outline-gray-3";

  return props.theme ? subtleBgs[props.theme] : "bg-surface-gray-2";
});

const icon = computed(() => {
  const data = {
    yellow: { component: LucideWarning, css: 'text-ink-amber-3' },
    blue: { component: LucideInfo, css: 'text-ink-blue-3' },
    red: { component: LucideCircleX, css: 'text-ink-red-3' },
    green: { component: LucideCheck, css: 'text-ink-green-3' },
  }
  return props.theme ? data[props.theme] : null
})

const props = withDefaults(defineProps<AlertProps>(), {
  variant: "subtle",
  dismissable: true,
});
</script>

<template>
  <div
    v-if="visible"
    role="alert"
    :class="classes"
    class="grid grid-cols-[auto_1fr_auto] gap-3 rounded-md px-4 py-3.5 text-base items-start"
  >
    <slot name="icon">
      <component
        :is="icon.component"
        class="size-4"
        v-if="icon"
        :class="icon.css"
      />
    </slot>

    <div class="grid gap-2" :class='{ "col-span-2": !$slots.icon && !icon }'>
      <span class="text-ink-gray-9"> {{ props.title }} </span>

      <slot name="description">
        <p v-if="props.description" class="text-ink-gray-6 prose-sm">
          {{ props.description }}
        </p>
      </slot>
    </div>

    <button v-if="props.dismissable" @click="visible = false">
      <LucideX class="size-4" />
    </button>
    <slot name="footer"> </slot>
  </div>
</template>
