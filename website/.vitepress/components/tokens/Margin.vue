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
        class="rounded border border-outline-gray-3 w-fit"
      >
        <div
          class="bg-surface-gray-2 rounded"
          :style='{ width: "5rem", height: "5rem", margin: item.value }'
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
