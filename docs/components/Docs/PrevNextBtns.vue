<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vitepress";
import LucideLeft from "~icons/lucide/arrow-left";
import LucideRight from "~icons/lucide/arrow-right";
import sidebarConfig from "../../.vitepress/sidebar";

const route = useRoute();

const linkInfos = sidebarConfig.reduce((acc, cur) => {
  cur.items ? acc.push(...cur.items) : acc.push(cur);
	return acc
}, []);

const prevLink = computed(() => {
  const index = linkInfos.findIndex((x) => x.link === route.path);

  if (index === 0) {
    return null;
  }

  return linkInfos[index - 1];
});

const nextLink = computed(() => {
  const index = linkInfos.findIndex((x) => x.link === route.path);

  if (index === linkInfos.length - 1) {
    return null;
  }

  return linkInfos[index + 1];
});
</script>

<template>
  <div class="flex justify-between gap-5 mt-10">
    <a
			v-if="prevLink"
      class="flex items-center gap-2 bg-surface-gray-3 p-3 rounded"
      :href="prevLink?.link"
    >
      <LucideLeft class="size-4" /> {{ prevLink?.text }}
    </a>

    <a
			v-if="nextLink"
      class="flex items-center gap-2 bg-surface-gray-3 p-3 rounded"
      :href="nextLink?.link"
    >
      {{ nextLink?.text }} <LucideRight class="size-4" />
    </a>
  </div>
</template>
