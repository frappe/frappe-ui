<template>
  <div class="flex justify-between gap-2">
    <slot>
      <slot name="left">
        <TabButtons
          v-model="pageLengthCount"
          :buttons="pageLengthOptions.map((o) => ({ label: o, value: o }))"
        />
      </slot>
      <slot name="right">
        <div class="flex items-center">
          <Button
            v-if="showLoadMore"
            label="Load More"
            @click="emit('loadMore')"
          />
          <div v-if="showLoadMore" class="mx-3 h-[80%] border-l" />
          <div class="flex items-center gap-1 text-base text-gray-600">
            <div>{{ options.rowCount || '0' }}</div>
            <div>of</div>
            <div>{{ options.totalCount || '0' }}</div>
          </div>
        </div>
      </slot>
    </slot>
  </div>
</template>
<script setup>
import TabButtons from '../TabButtons.vue'
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 20,
  },
  options: {
    type: Object,
    default: () => ({
      rowCount: 0,
      totalCount: 0,
      pageLengthOptions: [20, 50, 100],
    }),
  },
})

const emit = defineEmits(['update:modelValue', 'loadMore'])

const pageLengthCount = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const pageLengthOptions = ref(props.options.pageLengthOptions || [20, 50, 100])

const showLoadMore = computed(() => {
  return (
    props.options.rowCount &&
    props.options.totalCount &&
    props.options.rowCount < props.options.totalCount
  )
})
</script>
