<script setup>
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      class="grid gap-2"
      v-for="item in data"
      :key="item.name"
    >
      <div
        class="rounded bg-surface-gray-2 w-fit"
        :style="{ padding: item.value }"
      >
        <div
          class="bg-surface-gray-4 rounded"
          style="width: 5rem; height: 5rem"
        >
        </div>
      </div>
      <span>
        {{ item.name }}
      </span>
      <span class="text-sm text-ink-gray-3"> {{ item.value }}</span>
    </div>
  </div>
</template>
