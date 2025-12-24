<script setup>
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="grid gap-3">
    <div
      v-for="item in data"
      :key="item.name"
      class="rounded border border-outline-gray-2 p-4"
    >
      <div class="text-sm text-gray-500 mb-1">
        {{ item.name }} ({{ item.value }})
      </div>

      <div
        class="text-base"
        :style="{ fontWeight: item.value }"
      >
        The quick brown fox jumps over the lazy dog
      </div>
    </div>
  </div>
</template>
