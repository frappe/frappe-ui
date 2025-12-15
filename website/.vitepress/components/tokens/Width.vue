<script setup lang="ts">
type WidthToken = {
  name: string
  value: string
}

const props = defineProps<{
  data: WidthToken[]
}>()
</script>

<template>
  <div class="grid gap-4 overflow-auto">
    <div
      v-for="w in data"
      :key="w.name"
      class="grid gap-2"
    >
      <div
        class="bg-surface-gray-2 rounded p-3"
      >
        <div
          class="h-20 rounded"
          :style="{
            width: w.value,
            background: 'rgb(113 113 122 / 0.5)',
          }"
        />
      </div>

      <div class="flex justify-between text-sm">
        <span>
          {{ w.name === 'DEFAULT' ? 'w' : w.name }}
        </span>
        <span class="text-ink-gray-3">
          {{ w.value }}
        </span>
      </div>
    </div>
  </div>
</template>
