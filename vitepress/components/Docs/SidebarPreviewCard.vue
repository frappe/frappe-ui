<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { HoverCard } from 'frappe-ui'
import type { SidebarItem } from './sidebarList'
import { useSidebarStories } from './sidebarStories'

const props = defineProps<{ item: SidebarItem }>()

const loadStory = useSidebarStories()

// Async, so a story's chunk is only fetched once its card first opens.
const story = computed(() => {
  const id = props.item.preview?.story
  const loader = id ? loadStory(id) : undefined
  return loader ? defineAsyncComponent(loader) : null
})

const countLabel = computed(() => {
  const count = props.item.preview?.count
  if (!count) return ''
  return `${count} ${count === 1 ? 'example' : 'examples'}`
})
</script>

<template>
  <HoverCard
    v-if="item.preview"
    side="right"
    align="start"
    :offset="12"
    :hover-delay="400"
    :leave-delay="100"
  >
    <template #trigger>
      <slot />
    </template>

    <div class="w-[360px]">
      <!-- The story renders live at the docs column's width (720px) and is
           scaled to half, so it reads as a thumbnail. `safe center` centres
           small stories but pins layouts larger than the frame to its top-left
           instead of clipping both edges. `inert` keeps it from taking
           focus or clicks; it's a picture of the component, not a demo. -->
      <div
        v-if="story"
        inert
        aria-hidden="true"
        class="relative h-[204px] overflow-hidden border-b border-outline-gray-1 bg-surface-gray-1"
      >
        <div
          class="absolute left-0 top-0 flex h-[408px] w-[720px] origin-top-left scale-50 p-8"
          style="align-items: safe center; justify-content: safe center"
        >
          <component :is="story" />
        </div>
      </div>

      <div class="flex flex-col gap-1.5 p-3">
        <p class="text-sm text-ink-gray-5">
          {{ item.text }}
          <template v-if="countLabel">
            <span class="text-ink-gray-4">/</span> {{ countLabel }}
          </template>
        </p>
        <p
          v-if="item.preview.description"
          class="line-clamp-3 text-p-sm text-ink-gray-7"
        >
          {{ item.preview.description }}
        </p>
      </div>
    </div>
  </HoverCard>

  <slot v-else />
</template>
