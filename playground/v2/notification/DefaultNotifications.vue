<script setup lang="ts">
// Figma: espresso-2.0 › notification › type=default (23884:1570) — the
// 400 × 40 bar on elevation-1, 10px radius, md shadow, pl 12: a 16px
// alert glyph · 6px · the 14 medium gray-800 line, and on the right
// either a 24px ghost close (14px ×, pr 8), a ghost sm "Update" (pr 6), or
// both 4px apart with a 28px close (16px ×). Two columns of four, as the
// file lays them out.
import { Button } from '../../../src'
import { useDismiss } from './dismiss'

const TEXT = 'Update available. Get new features!'

type Variant = {
  id: string
  prefix?: boolean
  close?: 24 | 28
  action?: boolean
}
const COLUMNS: Variant[][] = [
  [
    { id: 'plain' },
    { id: 'close', close: 24 },
    { id: 'icon', prefix: true },
    { id: 'icon-close', prefix: true, close: 24 },
  ],
  [
    { id: 'action', action: true },
    { id: 'action-close', action: true, close: 28 },
    { id: 'icon-action', prefix: true, action: true },
    { id: 'icon-action-close', prefix: true, action: true, close: 28 },
  ],
]

const { dismiss, hiddenClass } = useDismiss()
</script>

<template>
  <div class="flex gap-6">
    <div v-for="(column, c) in COLUMNS" :key="c" class="flex flex-col gap-4">
      <div
        v-for="v in column"
        :key="v.id"
        :data-notif="`default/${v.id}`"
        role="status"
        class="flex h-10 w-[400px] items-center rounded-5 bg-surface-elevation-1 pl-3 shadow-md transition-opacity duration-200"
        :class="[
          hiddenClass(v.id),
          v.action ? 'pr-1.5' : v.close ? 'pr-2' : 'pr-3',
        ]"
      >
        <span
          v-if="v.prefix"
          class="lucide-circle-alert mr-1.5 size-4 shrink-0 text-ink-gray-8"
        />
        <span
          class="min-w-0 flex-1 truncate text-base-medium leading-4 text-ink-gray-8"
        >
          {{ TEXT }}
        </span>
        <span v-if="v.action || v.close" class="ml-2 flex shrink-0 gap-1">
          <Button
            v-if="v.action"
            variant="ghost"
            size="sm"
            class="!text-ink-gray-7"
          >
            Update
          </Button>
          <Button
            v-if="v.close"
            variant="ghost"
            :size="v.close === 28 ? 'sm' : 'xs'"
            label="Dismiss"
            @click="dismiss(v.id)"
          >
            <template #icon>
              <span
                class="lucide-x text-ink-gray-7"
                :class="v.close === 28 ? 'size-4' : 'size-3.5'"
              />
            </template>
          </Button>
        </span>
      </div>
    </div>
  </div>
</template>
