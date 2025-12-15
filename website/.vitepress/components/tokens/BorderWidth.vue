<script setup lang="ts">
type BorderWidthToken = {
  name: string
  value: string
}

const props = defineProps<{
  data: BorderWidthToken[]
}>()
</script>

<template>
  <div class="grid grid-cols-6 gap-4">
    <div
      v-for="border in data"
      :key="border.name"
      class="grid gap-2"
    >
      <div
        class="p-10 border border-outline-gray-3"
        :style="{
          borderWidth: border.value,
        }"
      />

      <span>
        {{ border.name === 'DEFAULT' ? 'border' : border.name }}
      </span>

      <span class="text-sm text-ink-gray-3">
        {{ border.value }}
      </span>
    </div>
  </div>
</template>
