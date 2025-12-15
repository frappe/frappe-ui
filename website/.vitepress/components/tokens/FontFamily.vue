
<script setup>
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="grid gap-4">
    <div
      v-for="item in data"
      :key="item.name"
      class="rounded-lg border border-outline-gray-2 p-4"
    >
      <div class="mb-2 text-sm font-medium text-ink-gray-3">
        font-{{ item.name }}
      </div>

      <div
        class="truncate text-base"
        :style="{ fontFamily: item.value.join(', ') }"
      >
        The quick brown fox jumps over the lazy dog
      </div>

      <div class="mt-2 text-xs truncate">
        {{ item.value.join(', ') }}
      </div>
    </div>
  </div>
</template>
