<script setup lang="ts">
// Figma: espresso-2.0 › notification › type=avatar (23884:1570) — 344 wide
// on elevation-1, 12px radius, md shadow, p 12, four ways:
//   unread   a 16px avatar · 6px · the 14 medium gray-800 name with a blue
//            dot on the far right; 4px under, the 13/19.5 gray-600 line
//            and, 4px under that, the 12/19 gray-500 time
//   actions  a 32px avatar · 8px · name, line and time 2px apart, then 8px
//            to a subtle sm "Join" and an outline sm "Decline", 6px apart
//   close    the same without actions, a 24px ghost × 4px in from the
//            top-right corner
//   both     actions and the close together
import { Button } from '../../../src'
import janet from '../assets/popover/av-janet.png'
import { useDismiss } from './dismiss'

const NAME = 'Jane Johnson'
const LINE = 'Your task is due tomorrow'
const TIME = '28 min ago'

type Variant = {
  id: string
  small?: boolean
  dot?: boolean
  action?: boolean
  close?: boolean
}
const VARIANTS: Variant[] = [
  { id: 'unread', small: true, dot: true },
  { id: 'actions', action: true },
  { id: 'close', close: true },
  { id: 'actions-close', action: true, close: true },
]

const { dismiss, hiddenClass } = useDismiss()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      v-for="v in VARIANTS"
      :key="v.id"
      :data-notif="`avatar/${v.id}`"
      role="status"
      class="relative w-[344px] rounded-6 bg-surface-elevation-1 p-3 shadow-md transition-opacity duration-200"
      :class="hiddenClass(v.id)"
    >
      <!-- unread: the small avatar sits on the name's line -->
      <div v-if="v.small" class="flex flex-col gap-1">
        <p class="flex items-center gap-1.5">
          <img
            :src="janet"
            alt=""
            class="size-4 shrink-0 rounded-full object-cover"
          />
          <span
            class="min-w-0 flex-1 truncate text-base-medium leading-4 text-ink-gray-8"
          >
            {{ NAME }}
          </span>
          <!-- icon/solid/dot-lg: a 5px dot in a 12px box -->
          <span
            v-if="v.dot"
            class="flex size-3 shrink-0 items-center justify-center"
            aria-label="Unread"
          >
            <span class="size-[5px] rounded-full bg-[--ink-blue-7]" />
          </span>
        </p>
        <div class="flex flex-col gap-1">
          <p class="text-p-sm text-ink-gray-6">{{ LINE }}</p>
          <p class="text-p-xs text-ink-gray-5">{{ TIME }}</p>
        </div>
      </div>

      <!-- the rest: the 32px avatar beside the body -->
      <div v-else class="flex gap-2">
        <img
          :src="janet"
          alt=""
          class="size-8 shrink-0 rounded-full object-cover"
        />
        <div class="flex min-w-0 flex-1 flex-col gap-0.5">
          <p class="truncate text-base-medium leading-4 text-ink-gray-8">
            {{ NAME }}
          </p>
          <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-0.5">
              <p class="text-p-sm text-ink-gray-6">{{ LINE }}</p>
              <p class="text-p-xs text-ink-gray-5">{{ TIME }}</p>
            </div>
            <div v-if="v.action" class="flex gap-1.5">
              <Button variant="subtle" size="sm" class="!text-ink-gray-7">
                Join
              </Button>
              <Button
                variant="outline"
                size="sm"
                class="!bg-transparent !text-ink-gray-7"
              >
                Decline
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Button
        v-if="v.close"
        variant="ghost"
        size="xs"
        label="Dismiss"
        class="absolute right-1 top-1"
        @click="dismiss(v.id)"
      >
        <template #icon>
          <span class="lucide-x size-3.5 text-ink-gray-8" />
        </template>
      </Button>
    </div>
  </div>
</template>
