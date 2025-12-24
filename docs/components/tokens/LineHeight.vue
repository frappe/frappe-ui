<script setup>
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="grid gap-3">
    <div
      v-for="item in data"
      :key="item.name"
      class="rounded border border-outline-gray-2 p-3"
    >
      <div class="text-xs opacity-60 mb-1">
        leading-{{ item.name }}
      </div>

      <div
        class="text-base my-2"
        :style="{ lineHeight: item.value }"
      >
        The quick brown fox jumps over the lazy dog.  
        The quick brown fox jumps over the lazy dog.
        The quick brown fox jumps over the lazy dog.
      </div>

      <div class="mt-1 text-xs opacity-50">
        {{ item.value }}
      </div>
    </div>
  </div>
</template>
