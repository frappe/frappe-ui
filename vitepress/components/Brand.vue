<script setup lang="ts">
// The site's logo + name, linking home. Read from themeConfig, so any consumer
// gets it for free; renders nothing when neither is configured.
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { theme } = useData()
const name = computed(() => theme.value.name ?? '')
const logo = computed(() => theme.value.logo ?? '')
</script>

<template>
  <a
    v-if="logo || name"
    :href="withBase('/')"
    class="flex items-center gap-1.5 min-w-0"
  >
    <img v-if="logo" :src="withBase(logo)" class="w-6 shrink-0" :alt="name" />
    <span
      v-if="name"
      class="text-lg-bold text-ink-gray-8 truncate tracking-[-0.01em]"
    >
      {{ name }}
    </span>
  </a>
</template>
