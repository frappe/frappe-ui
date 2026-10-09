<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  nextTick,
  ref,
  shallowRef,
  watch,
} from 'vue'
import type { Component } from 'vue'
import { HoverCard } from 'frappe-ui'
import type { SidebarItem } from './sidebarList'
import { useSidebarStories } from './sidebarStories'

// One card for the whole sidebar. Rows call `show` / `hide`; the card is
// anchored to an invisible box that jumps to the hovered row, and the card
// slides after it instead of closing and reopening.
const OPEN_DELAY = 300
const CLOSE_DELAY = 150
const SLIDE = 'transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1)'

const loadStory = useSidebarStories()
const stories = new Map<string, Component>()

const open = ref(false)
const following = ref(false)
const active = shallowRef<SidebarItem | null>(null)
const anchor = ref({ top: 0, height: 0 })
const card = ref<HTMLElement | null>(null)
let timer: ReturnType<typeof setTimeout> | undefined

// Async, so a story's chunk is only fetched once its row is first hovered.
// Cached per story, so returning to a row renders it at once.
function getStory(item: SidebarItem | null) {
  const id = item?.preview?.story
  if (!id) return null
  if (stories.has(id)) return stories.get(id)!
  const loader = loadStory(id)
  if (!loader) return null
  loader()
  const story = defineAsyncComponent(loader)
  stories.set(id, story)
  return story
}

const story = computed(() => getStory(active.value))

const countLabel = computed(() => {
  const count = active.value?.preview?.count
  if (!count) return ''
  return `${count} ${count === 1 ? 'example' : 'examples'}`
})

function show(item: SidebarItem, row: HTMLElement) {
  clearTimeout(timer)
  if (!item.preview) return hide()
  anchor.value = { top: row.offsetTop, height: row.offsetHeight }
  active.value = item
  getStory(item)
  // Already open means already placed: from here on, ease the moves so the
  // card slides to the new row. Its first placement stays a plain fade-in.
  if (!open.value) {
    timer = setTimeout(() => setOpen(true), OPEN_DELAY)
    return
  }
  following.value = true
  // Floating UI doesn't notice an anchor moving inside a scroll container,
  // but it repositions on any scroll of the anchor's ancestors.
  nextTick(() => window.dispatchEvent(new Event('scroll')))
}

function hide() {
  clearTimeout(timer)
  timer = setTimeout(() => setOpen(false), CLOSE_DELAY)
}

function setOpen(value: boolean) {
  open.value = value
  if (!value) following.value = false
}

// Reka places the card with a transform on its popper wrapper, outside this
// component, so the slide is set on that element directly.
watch(following, (isFollowing) => {
  const wrapper = card.value?.closest<HTMLElement>(
    '[data-reka-popper-content-wrapper]',
  )
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (wrapper)
    wrapper.style.transition = isFollowing && !reduceMotion ? SLIDE : ''
})

defineExpose({ show, hide })
</script>

<template>
  <HoverCard
    :open="open"
    side="right"
    align="start"
    :offset="12"
    @update:open="setOpen"
  >
    <template #trigger>
      <span
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0"
        :style="{ top: `${anchor.top}px`, height: `${anchor.height}px` }"
      />
    </template>

    <div
      v-if="active?.preview"
      ref="card"
      data-sidebar-preview
      class="sidebar-preview w-[360px]"
    >
      <!-- The story renders live at the docs column's width (720px) and is
           scaled to half, so it reads as a thumbnail. `safe center` centres
           small stories but pins layouts larger than the frame to its top-left
           instead of clipping both edges. Self-layout stories (charts) take
           the full width from the top, as they do on their page. `inert`
           keeps it from taking focus or clicks; it's a picture of the
           component, not a demo. -->
      <div
        v-if="story"
        inert
        aria-hidden="true"
        class="relative h-[204px] overflow-hidden border-b border-outline-gray-1 bg-surface-gray-1"
      >
        <div
          v-if="active.preview.selfLayout"
          class="absolute left-0 top-0 w-[720px] origin-top-left scale-50 p-4"
        >
          <component :is="story" :key="active.link" />
        </div>
        <div
          v-else
          class="absolute left-0 top-0 flex h-[408px] w-[720px] origin-top-left scale-50 p-8"
          style="align-items: safe center; justify-content: safe center"
        >
          <component :is="story" :key="active.link" />
        </div>
      </div>

      <div class="flex flex-col gap-1.5 p-3">
        <p class="text-sm text-ink-gray-5">
          {{ active.text }}
          <template v-if="countLabel">
            <span class="text-ink-gray-4">/</span> {{ countLabel }}
          </template>
        </p>
        <p
          v-if="active.preview.description"
          class="line-clamp-3 text-p-sm text-ink-gray-7"
        >
          {{ active.preview.description }}
        </p>
      </div>
    </div>
  </HoverCard>
</template>

<style>
/* Unscoped: the card is teleported, and the close fade targets HoverCard's
   content element, which sits outside this component. */
.sidebar-preview {
  animation: sidebar-preview-in 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* Reka keeps the card mounted until an animation on its content element
   ends, so this fade runs before it's removed. */
[data-slot='content'][data-state='closed']:has([data-sidebar-preview]) {
  animation: sidebar-preview-out 120ms ease-in forwards;
}

@keyframes sidebar-preview-in {
  from {
    opacity: 0;
    transform: translateY(4px) scale(0.98);
  }
}

@keyframes sidebar-preview-out {
  to {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sidebar-preview,
  [data-slot='content'][data-state]:has([data-sidebar-preview]) {
    animation: none;
  }
}
</style>
