
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
      class="rounded border p-4"
      :style="{
        letterSpacing: item.value,
        fontSize: '16px',
      }"
    >
      <div class="text-xs opacity-60 mb-2">
        tracking-{{ item.name }} ({{ item.value }})
      </div>
      <div>
        The quick brown fox jumps over the lazy dog
      </div>
    </div>
  </div>
</template>
