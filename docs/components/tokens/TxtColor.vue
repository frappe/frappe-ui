<script setup>
defineProps({
  data: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="grid grid-cols-4 gap-4">
    <template v-for="color in data" :key="color.name">
      <h2 :id="color.name" v-if="!color.value" class="capitalize col-span-full">
        {{ color.name }}
      </h2>

      <div v-else class="grid gap-2">
        <span :style='{ color: color.value, fontSize: "50px" }'>
          Aa
        </span>
        <span>{{ color.name }}</span>
        <span class="text-sm text-ink-gray-5">{{ color.value }}</span>
      </div>
    </template>
  </div>
</template>
