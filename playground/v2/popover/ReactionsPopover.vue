<script setup lang="ts">
// Figma: espresso-2.0 › Popover › picker › grid md (31731:20231). Meeting
// reactions, 205px, 16px radius, p 10, lg shadow: 32px round gray-2 emoji
// buttons, 5 across and 6px apart · 16px · a subtle md "Raise hand".
// Each click emits `react` (pair it with FlyingReactions to send it up the
// stage); Raise hand toggles, emitting `raiseHand` with the new state.
import { Button } from '../../../src'

const REACTIONS = [
  { emoji: '👍', label: 'Thumbs up' },
  { emoji: '👎', label: 'Thumbs down' },
  { emoji: '💖', label: 'Sparkling heart' },
  { emoji: '🎉', label: 'Party popper' },
  { emoji: '😂', label: 'Tears of joy' },
  { emoji: '👏', label: 'Clapping hands' },
  { emoji: '🤔', label: 'Thinking' },
  { emoji: '😮', label: 'Surprised' },
  { emoji: '😢', label: 'Crying' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '🤝', label: 'Handshake' },
  { emoji: '✨', label: 'Sparkles' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '💯', label: 'Hundred points' },
  { emoji: '🙏', label: 'Folded hands' },
]

const raised = defineModel<boolean>('raised', { default: false })

const emit = defineEmits<{
  react: [emoji: string]
  raiseHand: [raised: boolean]
}>()

function toggleHand() {
  raised.value = !raised.value
  emit('raiseHand', raised.value)
}
</script>

<template>
  <div
    class="flex w-[205px] flex-col gap-4 rounded-7 bg-surface-elevation-2 p-2.5 shadow-lg"
    role="dialog"
    aria-label="Reactions"
  >
    <div class="grid grid-cols-[repeat(5,32px)] justify-between gap-y-1.5">
      <button
        v-for="r in REACTIONS"
        :key="r.emoji"
        type="button"
        :aria-label="`React with ${r.label}`"
        :title="r.label"
        class="flex size-8 items-center justify-center rounded-full bg-surface-gray-2 text-lg leading-none transition-[background-color,transform] duration-150 hover:bg-surface-gray-3 active:scale-90 dark:bg-surface-gray-3 dark:hover:bg-surface-gray-4"
        @click="emit('react', r.emoji)"
      >
        {{ r.emoji }}
      </button>
    </div>
    <Button
      variant="subtle"
      size="md"
      class="w-full font-medium dark:!bg-surface-gray-3"
      :aria-pressed="raised"
      @click="toggleHand"
    >
      <template v-if="raised" #prefix>
        <span class="text-base leading-none">✋</span>
      </template>
      {{ raised ? 'Lower hand' : 'Raise hand' }}
    </Button>
  </div>
</template>
