<script setup lang="ts">
import { ref } from 'vue'
import { DateTimePicker } from 'frappe-ui'
import { dayjs } from '../../../utils/dayjs'

// 1. Meeting — can't schedule in the past, default to the next 30-min slot
const now = dayjs()
const nextSlot = now
  .minute(now.minute() < 30 ? 30 : 60)
  .second(0)
  .format('YYYY-MM-DD HH:mm:ss')
const meeting = ref(nextSlot)
const minMeetingTime = now.format('YYYY-MM-DD HH:mm:ss')

// 2. Server maintenance window — must be at least 24h out, max 60 days
const maintenance = ref('')
const tomorrow = dayjs()
  .add(1, 'day')
  .startOf('day')
  .format('YYYY-MM-DD HH:mm:ss')
const sixtyDaysOut = dayjs()
  .add(60, 'day')
  .endOf('day')
  .format('YYYY-MM-DD HH:mm:ss')

// 3. Fun — schedule the great launch (with a "Pick a dramatic moment" preset)
const launch = ref('')

function nextFridayMidnight() {
  const today = dayjs()
  const diff = (5 - today.day() + 7) % 7 || 7
  return today.add(diff, 'day').hour(0).minute(0).second(0)
}

const rowCls =
  'w-full rounded px-2 py-1.5 text-left text-base hover:bg-surface-gray-2'
</script>

<template>
  <div class="grid w-full max-w-sm gap-6 py-10">
    <!-- 1. Meeting scheduler -->
    <DateTimePicker
      v-model="meeting"
      label="Meeting time"
      placeholder="When should we meet?"
      :min="minMeetingTime"
      format="ddd, MMM D · h:mm A"
    >
      <template #prefix>
        <span class="lucide-calendar-clock size-4 text-ink-gray-5" />
      </template>
    </DateTimePicker>

    <!-- 2. Maintenance window -->
    <DateTimePicker
      v-model="maintenance"
      label="Maintenance window"
      description="Must be scheduled at least 24 hours in advance."
      placeholder="Pick a low-traffic time"
      :min="tomorrow"
      :max="sixtyDaysOut"
    >
      <template #prefix>
        <span class="lucide-server size-4 text-ink-gray-5" />
      </template>
    </DateTimePicker>

    <!-- 3. Fun: dramatic launch moment -->
    <DateTimePicker
      v-model="launch"
      label="Launch moment"
      placeholder="When do we light the candle?"
      format="MMMM D, YYYY [at] h:mm A"
      variant="outline"
    >
      <template #prefix>
        <span class="lucide-rocket size-4 text-ink-gray-5" />
      </template>
      <template #actions="{ setDate, close }">
        <button
          type="button"
          :class="rowCls"
          @click="
            () => {
              setDate(dayjs().add(1, 'day').hour(12).minute(0))
              close()
            }
          "
        >
          High noon
        </button>
        <button
          type="button"
          :class="rowCls"
          @click="
            () => {
              setDate(nextFridayMidnight())
              close()
            }
          "
        >
          Midnight Friday
        </button>
        <button
          type="button"
          :class="rowCls"
          @click="
            () => {
              setDate(dayjs().add(1, 'day').hour(6).minute(15))
              close()
            }
          "
        >
          Sunrise
        </button>
      </template>
    </DateTimePicker>
  </div>
</template>
