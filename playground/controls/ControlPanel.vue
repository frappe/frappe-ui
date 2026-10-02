<template>
  <!-- Floating preview panel: a titled card of stacked control rows. The
       sliders button folds it down to its title. -->
  <section
    class="flex w-[22rem] max-w-full flex-col overflow-hidden rounded-[20px] border border-outline-gray-1 bg-surface-elevation-2 p-3 shadow-lg"
    :aria-label="title"
  >
    <div class="flex h-10 shrink-0 items-center justify-between pl-2 pr-1">
      <h2 class="text-xl-semibold text-ink-gray-9">{{ title }}</h2>
      <Button
        variant="ghost"
        size="sm"
        :aria-label="open ? 'Hide controls' : 'Show controls'"
        :aria-expanded="open"
        @click="open = !open"
      >
        <template #icon>
          <span class="lucide-sliders-horizontal size-5 text-ink-gray-6" />
        </template>
      </Button>
    </div>
    <div
      v-show="open"
      class="-mx-3 -mb-3 mt-1 flex min-h-0 flex-col gap-2 overflow-y-auto px-3 pb-3"
    >
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '../../src'

defineProps<{ title: string }>()

defineSlots<{ default?: () => any }>()

const open = ref(true)
</script>
