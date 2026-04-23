<script setup lang="ts">
import { computed, ref } from 'vue'
import { Combobox } from 'frappe-ui'

type Emoji = { label: string; value: string; emoji: string; keywords: string }

const value = ref<string>('')

const emojis: { group: string; options: Emoji[] }[] = [
  {
    group: 'Smileys',
    options: [
      { label: 'Grinning', value: 'grinning', emoji: '😀', keywords: 'smile happy' },
      { label: 'Laughing', value: 'laughing', emoji: '😂', keywords: 'cry tears' },
      { label: 'Heart Eyes', value: 'heart-eyes', emoji: '😍', keywords: 'love' },
      { label: 'Thinking', value: 'thinking', emoji: '🤔', keywords: 'think hmm' },
      { label: 'Mind Blown', value: 'mind-blown', emoji: '🤯', keywords: 'wow shock' },
    ],
  },
  {
    group: 'Gestures',
    options: [
      { label: 'Thumbs Up', value: 'thumbs-up', emoji: '👍', keywords: 'like good yes' },
      { label: 'Clap', value: 'clap', emoji: '👏', keywords: 'applause' },
      { label: 'Party', value: 'party', emoji: '🎉', keywords: 'celebrate party' },
      { label: 'Rocket', value: 'rocket', emoji: '🚀', keywords: 'launch ship' },
      { label: 'Fire', value: 'fire', emoji: '🔥', keywords: 'lit hot' },
    ],
  },
  {
    group: 'Objects',
    options: [
      { label: 'Sparkles', value: 'sparkles', emoji: '✨', keywords: 'shine magic' },
      { label: 'Bulb', value: 'bulb', emoji: '💡', keywords: 'idea' },
      { label: 'Warning', value: 'warning', emoji: '⚠️', keywords: 'alert caution' },
      { label: 'Check', value: 'check', emoji: '✅', keywords: 'done yes' },
      { label: 'Cross', value: 'cross', emoji: '❌', keywords: 'no wrong' },
    ],
  },
]

const selected = computed(() => {
  for (const group of emojis) {
    const match = group.options.find((o) => o.value === value.value)
    if (match) return match
  }
  return null
})
</script>

<template>
  <div class="grid gap-3">
    <Combobox
      v-model="value"
      :options="emojis"
      placeholder="Search emoji…"
      size="md"
      open-on-focus
      class="w-72"
    >
      <template #trigger="{ displayValue }">
        <div class="flex min-w-0 flex-1 items-center gap-2">
          <span class="text-xl leading-none">
            {{ selected?.emoji ?? '😶' }}
          </span>
          <span
            :class="[
              'truncate',
              displayValue ? 'text-ink-gray-8' : 'text-ink-gray-4',
            ]"
          >
            {{ displayValue || 'Pick an emoji' }}
          </span>
        </div>
      </template>

      <template #item-prefix="{ item }">
        <span class="text-base leading-none">{{ (item as Emoji).emoji }}</span>
      </template>
    </Combobox>
  </div>
</template>
