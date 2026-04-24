<script setup lang="ts">
import { ref } from 'vue'
import { Combobox } from 'frappe-ui'

const value = ref<string>('')

const emojis = [
  {
    group: 'Smileys',
    options: [
      { label: 'Grinning', value: 'grinning', icon: '😀' },
      { label: 'Laughing', value: 'laughing', icon: '😂' },
      { label: 'Heart Eyes', value: 'heart-eyes', icon: '😍' },
      { label: 'Thinking', value: 'thinking', icon: '🤔' },
      { label: 'Mind Blown', value: 'mind-blown', icon: '🤯' },
    ],
  },
  {
    group: 'Gestures',
    options: [
      { label: 'Thumbs Up', value: 'thumbs-up', icon: '👍' },
      { label: 'Clap', value: 'clap', icon: '👏' },
      { label: 'Party', value: 'party', icon: '🎉' },
      { label: 'Rocket', value: 'rocket', icon: '🚀' },
      { label: 'Fire', value: 'fire', icon: '🔥' },
    ],
  },
  {
    group: 'Objects',
    options: [
      { label: 'Sparkles', value: 'sparkles', icon: '✨' },
      { label: 'Bulb', value: 'bulb', icon: '💡' },
      { label: 'Warning', value: 'warning', icon: '⚠️' },
      { label: 'Check', value: 'check', icon: '✅' },
      { label: 'Cross', value: 'cross', icon: '❌' },
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
      <span class="lucide-smile size-4 text-ink-gray-6" />
    </template>
  </Combobox>
</template>
