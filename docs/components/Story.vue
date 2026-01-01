<script setup lang="ts">
import { Button } from "frappe-ui";
import LucideBox from "~icons/lucide/box";

interface Props {
  title?: string;
  previewCss?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Default",
});
</script>

<template>
  <section class="flex flex-col gap-3 h-fit">
    <Button class="w-fit capitalize" size="sm">
      <template #prefix>
        <LucideBox class="size-4" />
      </template>
      {{ title }}
    </Button>

    <div
      class="border border-outline-gray-2 p-5 rounded overflow-auto scrollbar"
      :class="props.previewCss"
    >
      <slot />
    </div>
  </section>
</template>
