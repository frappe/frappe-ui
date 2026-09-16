<template>
  <div
    class="absolute top-20 w-full px-px"
    :style="setCurrentTime"
    v-if="parseDate(date) === parseDate(now)"
  >
    <Tooltip :text="dayjs(now).format('ddd, MMM D, YYYY h:mm a')">
      <!-- A step lighter than the palette's full red, and from the palette
           rather than a hex of its own: a line across every day, all day, is
           the one red thing on the grid, and at full strength it was the first
           thing on the page. It follows the theme with the rest. -->
      <div class="current-time relative h-0.5 bg-surface-red-6 rounded-4" />
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
/* A dot at the line's head, centred on it, rather than a tick across it: the
   line says when, and the dot says where it starts — a point, which is what
   "now" is. Pulled half its width left so it sits on the day's rule, the way the
   line runs from it. */
.current-time::before {
  content: '';
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background-color: var(--surface-red-6);
  position: absolute;
  left: -4px;
  top: -3px;
}
</style>
