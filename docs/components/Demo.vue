<script setup lang="ts">
import { ref } from "vue";
import Tabs from "./Tabs.vue";
import LucidePreview from "~icons/lucide/square-mouse-pointer";
import LucideCode from "~icons/lucide/code";

interface ComponentPreviewProps {
  name: string;
  title?: string;
  description?: string;
}

const props = defineProps<ComponentPreviewProps>();
const state = ref(0);

const tabs = [
  { label: "Preview", icon: LucidePreview },
  { label: "Code", icon: LucideCode },
];
</script>

<template>
  <div class="grid gap-5">
    <div v-if="props.title" class="font-medium">{{ props.title }}</div>
    <div v-if="props.description" class="text-sm text-muted">
      {{ props.description }}
    </div>
    <Tabs :tabs="tabs" v-model="state">
      <template #tab-panel="{ tab }">
        <div v-if='tab.label === "Preview"' class="vp-raw mt-5">
          <slot />
        </div>
        <slot v-else name="code" />
      </template>
    </Tabs>
  </div>
</template>
