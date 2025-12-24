<script setup>
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="grid grid-cols-3 gap-5">
    <template v-for="color in data" :key="color.name">
      <h2 v-if="!color.value" class="capitalize col-span-full">
        {{ color.name }}
      </h2>

      <div class="grid gap-2" v-else>
        <div
          v-if="color.value"
          class="rounded shadow-lg border p-8"
          :style="{ backgroundColor: color.value }"
        >
        </div>
        <span class="whitespace-nowrap">
          {{ color.name }}
        </span>
        <span class="text-sm text-ink-gray-3"> {{ color.value }}</span>
      </div>
    </template>
  </div>
</template>
