<script setup lang="ts">
// Figma: espresso-2.0 › notification › type=compact (23884:1570) — 272 wide
// on elevation-1, 12px radius, md shadow, pt 14 · px 12 · pb 12: the 14
// medium gray-800 title, 4px over the 14/21 gray-600 paragraph, 18px over
// the buttons — md, so 32 tall with a medium label: a subtle "Update now"
// and an outline "Later", either stacked 4px apart across the width or
// side by side, half each.
import { Button } from '../../../src'

const TITLE = 'System Update Available'
const BODY =
  'A new update is available for the app. Update now to enjoy new features and improvements.'

const VARIANTS = [
  { id: 'stacked', stacked: true },
  { id: 'row', stacked: false },
]
</script>

<template>
  <div class="flex items-start gap-6">
    <div
      v-for="v in VARIANTS"
      :key="v.id"
      :data-notif="`compact/${v.id}`"
      role="status"
      class="flex w-[272px] flex-col rounded-6 bg-surface-elevation-1 px-3 pb-3 pt-3.5 shadow-md"
    >
      <p class="text-base-medium leading-4 text-ink-gray-8">{{ TITLE }}</p>
      <p class="mt-1 text-p-base text-ink-gray-6">{{ BODY }}</p>
      <div
        class="mt-[18px] flex gap-1"
        :class="v.stacked ? 'flex-col' : 'flex-row'"
      >
        <Button
          variant="subtle"
          size="md"
          class="!text-ink-gray-7"
          :class="v.stacked ? 'w-full' : 'flex-1'"
        >
          Update now
        </Button>
        <Button
          variant="outline"
          size="md"
          class="!bg-transparent !text-ink-gray-7"
          :class="v.stacked ? 'w-full' : 'flex-1'"
        >
          Later
        </Button>
      </div>
    </div>
  </div>
</template>
