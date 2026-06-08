<script setup lang="ts">
import { ref } from 'vue'
import { Rating } from 'frappe-ui'

const mood = ref(3)
const moods = ['😞', '🙁', '😐', '🙂', '😊']

const score = ref(2)
const scores = ['💩', '👎', '👌', '👍', '🔥']
</script>

<template>
  <div class="flex flex-col gap-4 items-center">
    <Rating v-model="mood" label="How was your day?" size="lg">
      <template #icon="{ index, value, previewValue }">
        <span
          class="text-4xl leading-none transition-transform"
          :class="
            index === (previewValue ?? value) ? 'scale-110' : 'opacity-40'
          "
        >
          {{ moods[index - 1] }}
        </span>
      </template>
    </Rating>
    <Rating v-model="score" label="Rate this meal" size="lg">
      <template #icon="{ index, value, previewValue }">
        <span
          class="text-4xl leading-none"
          :class="
            index === (previewValue ?? value) ? '' : 'grayscale opacity-50'
          "
        >
          {{ scores[index - 1] }}
        </span>
      </template>
    </Rating>
  </div>
</template>
