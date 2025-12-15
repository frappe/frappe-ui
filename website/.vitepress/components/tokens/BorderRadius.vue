<script setup lang="ts">
type BorderRadiusToken = {
  name: string
  value: string
}

const props = defineProps<{
  data: BorderRadiusToken[]
}>()
</script>

<template>
  <div class="grid grid-cols-6 gap-4">
    <div
      v-for="radius in data"
      :key="radius.name"
      class="grid gap-2"
    >
      <div
        class="border p-10"
        :style="{
          borderRadius: radius.value,
          background: 'rgb(113 113 122 / 0.5)',
        }"
      />

      <span>
        {{ radius.name === 'DEFAULT' ? 'rounded' : radius.name }}
      </span>

      <span class="text-sm text-ink-gray-3">
        {{ radius.value }}
      </span>
    </div>
  </div>
</template>
