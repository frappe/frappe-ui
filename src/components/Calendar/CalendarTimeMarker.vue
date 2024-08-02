<template>
  <div
    class="absolute top-20 z-50 w-full pl-2"
    :style="setCurrentTime"
    v-if="new Date(date).toDateString() === new Date().toDateString()"
  >
    <div class="current-time relative h-0.5 bg-red-600" />
  </div>
</template>
<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  date: {
    type: String,
    required: true,
  },
  redundantCellHeight: {
    type: Number,
    default: 0,
  },
})

const config = inject('config')
const hourHeight = config.hourHeight
const minuteHeight = hourHeight / 60

const setCurrentTime = computed(() => {
  let d = new Date()
  let hour = d.getHours()
  let minutes = d.getMinutes()
  let top =
    (hour * 60 + minutes) * minuteHeight + props.redundantCellHeight + 'px'
  return { top }
})
</script>
<style scoped>
.current-time::before {
  content: '';
  display: block;
  width: 12px;
  height: 12px;
  background-color: red;
  border-radius: 50%;
  position: absolute;
  left: -8px;
  top: -5px;
}
</style>
