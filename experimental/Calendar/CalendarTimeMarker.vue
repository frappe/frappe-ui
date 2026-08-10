<template>
  <div
    class="absolute top-20 w-full px-px"
    :style="setCurrentTime"
    v-if="parseDate(date) === parseDate(now)"
  >
    <Tooltip :text="dayjs(now).format('ddd, MMM D, YYYY h:mm a')">
      <div class="current-time relative h-0.5 bg-[#E03636] rounded-4" />
    </Tooltip>
  </div>
</template>
<script setup lang="ts">
import Tooltip from '#components/Tooltip/Tooltip.vue'
import { dayjs } from '#utils/dayjs'
import { computed, inject } from 'vue'
import { CALENDAR_CONFIG_KEY } from './types'
import { useNow } from './composables/useNow'
import { parseDate } from './calendarUtils'

const props = defineProps<{
  date: string | Date
}>()

const config = inject(CALENDAR_CONFIG_KEY)
if (!config) {
  throw new Error('CalendarTimeMarker must be rendered inside Calendar.')
}
const hourHeight = config.hourHeight
const minuteHeight = hourHeight / 60

const now = useNow()

const setCurrentTime = computed(() => {
  let hour = now.value.getHours()
  let minutes = now.value.getMinutes()
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
