<script setup lang="ts">
import { ref } from 'vue'
import { Combobox } from 'frappe-ui'
import LucideSmile from '~icons/lucide/smile'

type Emoji = { label: string; value: string; emoji: string }

const value = ref<string>('')

const emojis: { group: string; options: Emoji[] }[] = [
  {
    group: 'Smileys',
    options: [
      { label: 'Grinning', value: 'grinning', emoji: '😀' },
      { label: 'Laughing', value: 'laughing', emoji: '😂' },
      { label: 'Heart Eyes', value: 'heart-eyes', emoji: '😍' },
      { label: 'Thinking', value: 'thinking', emoji: '🤔' },
      { label: 'Mind Blown', value: 'mind-blown', emoji: '🤯' },
    ],
  },
  {
    group: 'Gestures',
    options: [
      { label: 'Thumbs Up', value: 'thumbs-up', emoji: '👍' },
      { label: 'Clap', value: 'clap', emoji: '👏' },
      { label: 'Party', value: 'party', emoji: '🎉' },
      { label: 'Rocket', value: 'rocket', emoji: '🚀' },
      { label: 'Fire', value: 'fire', emoji: '🔥' },
    ],
  },
  {
    group: 'Objects',
    options: [
      { label: 'Sparkles', value: 'sparkles', emoji: '✨' },
      { label: 'Bulb', value: 'bulb', emoji: '💡' },
      { label: 'Warning', value: 'warning', emoji: '⚠️' },
      { label: 'Check', value: 'check', emoji: '✅' },
      { label: 'Cross', value: 'cross', emoji: '❌' },
    ],
  },
]
</script>

<template>
  <Combobox
    v-model="value"
    trigger="button"
    :options="emojis"
    placeholder="Pick a reaction"
  >
    <template #prefix>
      <LucideSmile class="size-4 text-ink-gray-6" />
    </template>

    <template #item-prefix="{ item }">
      <span
        class="leading-none inline-flex items-center justify-center size-4"
        >{{ (item as Emoji).emoji }}</span
      >
    </template>
  </Combobox>
</template>
