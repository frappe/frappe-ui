<script setup>
import { ref } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

const text = ref('The quick brown fox jumps over the lazy dog')
import TextArea from '@/srcomponents/Textarea/Textarea.vue'
</script>

<template>
  <div class="grid gap-4">
		<TextArea v-model="text" class="w-full" />

    <div
      v-for="item in data"
      :key="item.name"
      class="rounded border border-outline-gray-3 p-4"
    >
      <div class="text-xs opacity-60 mb-1">
        {{ item.name }}
      </div>

      <div
        class="truncate"
        :style="
          {
            fontSize: item.value[0],
            lineHeight: item.value[1]?.lineHeight,
            letterSpacing: item.value[1]?.letterSpacing,
            fontWeight: item.value[1]?.fontWeight,
          }
        "
      >
				 {{ text }}
      </div>

      <div class="mt-2 text-xs opacity-60">
        {{ item.value[0] }}
        · lh {{ item.value[1]?.lineHeight }}
        · ls {{ item.value[1]?.letterSpacing }}
        · fw {{ item.value[1]?.fontWeight }}
      </div>
    </div>
  </div>
</template>
