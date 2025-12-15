<script setup>
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="grid grid-cols-6 gap-4">
    <div
      class="grid gap-2"
      v-for="color in data"
      :key="color.name"
    >
      <div
        class="rounded border-2 flex items-end p-10"
        :style="{ borderColor: color.value }"
      >
      </div>
      <span>
        {{ color.name }}
      </span>
      <span class="text-sm text-ink-gray-3"> {{ color.value }}</span>
    </div>
  </div>
</template>
