<script setup lang="ts">
// Figma: espresso-2.0 › notification › type=banner (23884:1570) — 344 wide
// on elevation-1, 12px radius, md shadow, p 12: a 16px alert glyph · 8px ·
// the 14 medium gray-800 title, 4px over the 14/21 gray-600 paragraph;
// with actions, 12px more to a subtle sm "Update now" and an outline sm
// "Later", 6px apart. A close is a 24px ghost × sitting 4px in from the
// top-right corner. Two columns of four: without actions, then with.
import { Button } from '../../../src'
import { useDismiss } from './dismiss'

const TITLE = 'Update available. Get new features!'
const BODY =
  'A new update is available for the app. Update now to enjoy new features and improvements.'

type Variant = {
  id: string
  prefix?: boolean
  close?: boolean
  action?: boolean
}
const combos = (action: boolean): Variant[] =>
  [
    { id: 'plain' },
    { id: 'close', close: true },
    { id: 'icon', prefix: true },
    { id: 'icon-close', prefix: true, close: true },
  ].map((v) => ({
    ...v,
    id: action ? `action-${v.id}` : v.id,
    action,
  }))
const COLUMNS = [combos(false), combos(true)]

const { dismiss, hiddenClass } = useDismiss()
</script>

<template>
  <div class="flex gap-6">
    <div v-for="(column, c) in COLUMNS" :key="c" class="flex flex-col gap-4">
      <div
        v-for="v in column"
        :key="v.id"
        :data-notif="`banner/${v.id}`"
        role="status"
        class="relative flex w-[344px] flex-col gap-1 rounded-6 bg-surface-elevation-1 p-3 shadow-md transition-opacity duration-200"
        :class="hiddenClass(v.id)"
      >
        <p class="flex items-center gap-2">
          <span
            v-if="v.prefix"
            class="lucide-circle-alert size-4 shrink-0 text-ink-gray-8"
          />
          <span
            class="min-w-0 flex-1 truncate text-base-medium leading-4 text-ink-gray-8"
          >
            {{ TITLE }}
          </span>
        </p>
        <p class="text-p-base text-ink-gray-6">{{ BODY }}</p>
        <div v-if="v.action" class="mt-2 flex gap-1.5">
          <Button variant="subtle" size="sm" class="!text-ink-gray-7">
            Update now
          </Button>
          <Button
            variant="outline"
            size="sm"
            class="!bg-transparent !text-ink-gray-7"
          >
            Later
          </Button>
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
  </div>
</template>
