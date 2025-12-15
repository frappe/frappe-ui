<script setup lang="ts">
type HeightToken = {
  name: string
  value: string
}

const props = defineProps<{
  data: HeightToken[]
}>()
</script>

<template>
  <div class="grid gap-4">
    <div
      v-for="h in data"
      :key="h.name"
      class="grid gap-2"
    >
      <div
        class="bg-surface-gray-2 rounded p-3 min-h-40 flex items-end"
      >
        <div
          class="w-20 rounded"
          :style="{
            height: h.value,
            background: 'rgb(113 113 122 / 0.5)',
          }"
        />
      </div>

      <div class="flex justify-between text-sm">
        <span>
          {{ h.name === 'DEFAULT' ? 'h' : h.name }}
        </span>
        <span class="text-ink-gray-3">
          {{ h.value }}
        </span>
      </div>
    </div>
  </div>
</template>
