<script setup lang="ts">
import { ref } from 'vue'
import { Slider } from 'frappe-ui'

const brightness = ref([60])
const saved = ref<number | null>(null)
const saves = ref(0)

// Runs once when the drag ends, not on every step.
function save([value]: number[]) {
  saved.value = value
  saves.value++
}
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-2">
    <Slider
      v-model="brightness"
      label="Screen brightness"
      @value-commit="save"
    />
    <p class="text-p-sm text-ink-gray-5">
      Showing {{ brightness[0] }}.
      <template v-if="saved !== null">
        Saved {{ saved }} ({{ saves }} {{ saves === 1 ? 'save' : 'saves' }}).
      </template>
      <template v-else>Not saved yet.</template>
    </p>
  </div>
</template>
