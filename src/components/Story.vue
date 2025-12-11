<script setup lang="ts">
import { computed, useSlots } from "vue";
import LucideBox from "~icons/lucide/box";
import Button from "./Button/Button.vue";

const slots = useSlots();

const defaultSlot = slots.default?.();

interface Props {
  title?: string;
  previewCss?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Default",
});

// console.log(defaultSlot[0].props)
// {{ defaultSlot[0]?.type?.props }}
</script>

<template>
  <section class="flex flex-col gap-3">
    <Button class="w-fit capitalize" size="sm">
      <template #prefix>
        <LucideBox class="size-4" />
      </template>
      {{ title }}
    </Button>

    <div
      class="border border-outline-gray-2 p-5 rounded"
      :class="props.previewCss"
    >
      <slot></slot>
    </div>
  </section>
</template>
