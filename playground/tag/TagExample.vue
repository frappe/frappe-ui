<script setup lang="ts">
// One of the Tag page's variants (TagPage.vue): the file's usage tags (node
// 30344:6263) in that variant, with the rest of the component's properties
// (node 25406:19493) — Size, Theme, Prefix, Dismissible, Disabled — under
// the page's outline while this variant is the one in view. Hover, active
// and focus happen on the tags themselves (Tab reaches them; Backspace
// removes a focused one).
import { computed, inject, ref, watch } from 'vue'
import { Button, Select, Switch, TabButtons } from '../../src'
import Tag from './Tag.vue'
import type { TagSize, TagTheme, TagVariant } from './Tag.vue'
import { PATTERNS_ACTIVE } from '../patternsRail'

const props = defineProps<{ variant: TagVariant }>()
// the controls show under the outline while this variant is in view
const active = inject(PATTERNS_ACTIVE, ref(''))
const inView = computed(() => active.value === props.variant)

const size = ref<TagSize>('sm')
type ThemeChoice = TagTheme | 'mixed'
const theme = ref<ThemeChoice>('mixed')
const prefix = ref(false)
const dismissible = ref(true)
const disabled = ref(false)

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
  <div>
    <!-- one box, tall enough for the tags at lg and the Reset under them, so
         nothing below moves; the tags wrap in a column of 320, the width the
         file's usage gives them -->
    <div class="flex h-[160px] w-[320px] flex-col items-center gap-4">
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

    <!-- the controls, under the page's outline while this variant is in view -->
    <Teleport v-if="inView" defer to="#patterns-rail">
      <div class="mt-10 text-base-medium text-ink-gray-8">Options</div>
      <div class="mt-3 flex flex-col gap-1">
        <div class="flex h-7 items-center justify-between">
          <span class="text-base text-ink-gray-7">Size</span>
          <TabButtons
            v-model="size"
            :options="sizeTabs"
            size="sm"
            aria-label="Size"
            class="w-[116px] [&>div]:w-full [&_button]:flex-1 [&_button]:basis-0 [&_button>span]:w-full"
          />
        </div>
        <div class="flex h-7 items-center justify-between">
          <span class="text-base text-ink-gray-7">Theme</span>
          <Select
            v-model="theme"
            :options="themes"
            size="sm"
            variant="subtle"
            class="w-[116px]"
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
    </Teleport>
  </div>
</template>
