<script setup lang="ts">
import { ref } from 'vue'
import { Slider } from 'frappe-ui'

const value = ref([50])
const commits = ref<number[][]>([])

function onValueCommit(committed: number[]) {
  commits.value = [...commits.value, committed]
}
</script>

<!--
  `value-commit` fires once at the end of a drag, not on every step.
  Drag the slider thumb and release to log committed values below.
-->

<template>
  <div class="flex flex-col gap-3">
    <Slider
      v-model="value"
      label="Drag and release to commit"
      @value-commit="onValueCommit"
    />
    <p class="text-p-sm text-ink-gray-6">
      Commits: {{ commits.length ? commits.map((c) => c.join(',')).join(' · ') : '—' }}
    </p>
  </div>
</template>
