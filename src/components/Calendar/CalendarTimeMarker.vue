<template>
  <div
    class="absolute top-20 z-10 w-full px-px"
    :style="setCurrentTime"
    v-if="new Date(date).toDateString() === new Date().toDateString()"
  >
    <Tooltip :text="dayjs().format('ddd, MMM D, YYYY h:mm a')">
      <div class="current-time relative h-0.5 bg-[#E03636] rounded" />
    </Tooltip>
  </div>
</template>
<script setup>
import Tooltip from '../Tooltip/Tooltip.vue'
import { dayjs } from '../../utils/dayjs'
import { computed, inject } from 'vue'

const props = defineProps({
  date: {
    type: [String, Date],
    required: true,
  },
})

const config = inject('config')
const hourHeight = config.hourHeight
const minuteHeight = hourHeight / 60

const setCurrentTime = computed(() => {
  let d = new Date()
  let hour = d.getHours()
  let minutes = d.getMinutes()
  let top = (hour * 60 + minutes) * minuteHeight + 'px'
  return { top }
})
</script>
<style scoped>
.current-time::before {
  content: '';
  display: block;
  width: 2px;
  height: 12px;
  border-radius: 8px;
  background-color: #e03636;
  position: absolute;
  left: 0;
  top: -5px;
}
</style>
