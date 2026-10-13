<script setup lang="ts">
// The Tag page: a set of tags on the left — the file's usage tags (node
// 30344:6263) — and the Preview control on the right with the component's
// properties (node 25406:19493): Variant, Size, Theme, Prefix, Dismissible,
// Disabled. Hover, active and focus happen on the tags themselves (Tab
// reaches them; Backspace removes a focused one).
import { ref, watch } from 'vue'
import { Button, Select, Switch, TabButtons } from '../../src'
import Tag from './Tag.vue'
import type { TagSize, TagTheme, TagVariant } from './Tag.vue'

const q = new URLSearchParams(window.location.search)
const pick = <T extends string>(key: string, allowed: T[], fallback: T): T =>
  allowed.includes(q.get(key) as T) ? (q.get(key) as T) : fallback

const variant = ref<TagVariant>(
  pick('variant', ['solid', 'subtle', 'outline', 'ghost'], 'subtle'),
)
const size = ref<TagSize>(pick('size', ['sm', 'md', 'lg'], 'sm'))
type ThemeChoice = TagTheme | 'mixed'
const theme = ref<ThemeChoice>(
  pick(
    'theme',
    ['mixed', 'gray', 'amber', 'red', 'green', 'blue', 'violet'],
    'mixed',
  ),
)
const prefix = ref(q.has('prefix'))
const dismissible = ref(!q.has('plain'))
const disabled = ref(q.has('disabled'))

const variants = [
  { label: 'Solid', value: 'solid' },
  { label: 'Subtle', value: 'subtle' },
  { label: 'Outline', value: 'outline' },
  { label: 'Ghost', value: 'ghost' },
]
const sizeTabs = [
  { label: 'sm', value: 'sm' },
  { label: 'md', value: 'md' },
  { label: 'lg', value: 'lg' },
]
const themes = [
  // each tag in its own colour, as the file's usage shows them
  { label: 'Mixed', value: 'mixed' },
  { label: 'Gray', value: 'gray' },
  { label: 'Amber', value: 'amber' },
  { label: 'Red', value: 'red' },
  { label: 'Green', value: 'green' },
  { label: 'Blue', value: 'blue' },
  { label: 'Violet', value: 'violet' },
]

// the file's usage tags, each with its own colour for Mixed
const ALL: { label: string; theme: TagTheme }[] = [
  { label: 'Respond in 24h', theme: 'amber' },
  { label: 'Sales', theme: 'green' },
  { label: 'Partner', theme: 'amber' },
  { label: 'Due', theme: 'blue' },
  { label: 'Reply goal', theme: 'violet' },
  { label: 'Escalated', theme: 'red' },
  { label: 'Internal', theme: 'gray' },
]
const tags = ref([...ALL])
const remove = (label: string) =>
  (tags.value = tags.value.filter((t) => t.label !== label))
const restore = () => (tags.value = [...ALL])
// dismissing every tag and switching dismissible off would leave nothing
watch(dismissible, (on) => !on && restore())
</script>

<template>
  <div class="flex h-full items-center justify-center px-5 py-10">
    <div class="flex items-start gap-10">
      <!-- one box, so the controller never moves; the tags wrap in a column
           of 320, the width the file's usage gives them -->
      <div class="flex h-[300px] w-[560px] items-center justify-center">
        <div class="flex w-[320px] flex-col items-center gap-4">
          <div class="flex flex-wrap justify-center gap-1.5">
            <Tag
              v-for="t in tags"
              :key="t.label"
              :label="t.label"
              :size="size"
              :variant="variant"
              :theme="theme === 'mixed' ? t.theme : theme"
              :prefix-icon="prefix"
              :dismissible="dismissible"
              :disabled="disabled"
              @dismiss="remove(t.label)"
            />
          </div>
          <Button
            v-if="tags.length < ALL.length"
            variant="ghost"
            size="sm"
            label="Reset"
            @click="restore"
          />
        </div>
      </div>
      <!-- the controller, as the other pages' -->
      <div
        class="flex w-[274px] shrink-0 flex-col gap-3 rounded-7 border border-outline-gray-1 bg-surface-elevation-2 px-4 pb-[13px] pt-4"
      >
        <p class="text-lg-semibold leading-[1.15] text-ink-gray-9">
          Preview control
        </p>
        <div class="flex flex-col gap-3">
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Variant</span>
            <Select
              v-model="variant"
              :options="variants"
              size="sm"
              variant="subtle"
              class="w-[140px]"
              aria-label="Variant"
            />
          </div>
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Size</span>
            <TabButtons
              v-model="size"
              :options="sizeTabs"
              size="sm"
              aria-label="Size"
            />
          </div>
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Theme</span>
            <Select
              v-model="theme"
              :options="themes"
              size="sm"
              variant="subtle"
              class="w-[140px]"
              aria-label="Theme"
            />
          </div>
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Prefix</span>
            <Switch v-model="prefix" size="sm" aria-label="Prefix" />
          </div>
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Dismissible</span>
            <Switch v-model="dismissible" size="sm" aria-label="Dismissible" />
          </div>
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Disabled</span>
            <Switch v-model="disabled" size="sm" aria-label="Disabled" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
