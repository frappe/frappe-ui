<script setup lang="ts">
// Figma: espresso-2.0 › References › modal (34953:131620). Streak hero and
// this week as date chips; the run of streak days ending today sits on an
// orange-50 → orange-300 bar. Spacing (from Figma positions): title → flame
// 36, hero → strip 30, strip → card edge ~41.
import { computed } from 'vue'
import EspressoModal from './EspressoModal.vue'
import StreakHero from './streak/StreakHero.vue'

const props = withDefaults(
  defineProps<{
    streak?: number
    /** Any date in the week to show; that day is today. */
    today?: Date
  }>(),
  { streak: 18, today: () => new Date(2025, 2, 14) },
)

const open = defineModel<boolean>('open', { default: false })

const LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

// Monday-first week containing `today`.
const week = computed(() => {
  const start = new Date(props.today)
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7))
  return LETTERS.map((letter, i) => {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    return { letter, date, isToday: i === (props.today.getDay() + 6) % 7 }
  })
})

const todayIndex = computed(() => week.value.findIndex((d) => d.isToday))

// The bar covers the streak days in this week, ending at today.
const barStart = computed(() =>
  Math.max(0, todayIndex.value - (props.streak - 1)),
)

// Columns are 24px on a 40px step; the bar overhangs each end by 1px.
const barStyle = computed(() => ({
  left: `${barStart.value * 40 - 1}px`,
  width: `${(todayIndex.value - barStart.value) * 40 + 26}px`,
}))
</script>

<template>
  <EspressoModal v-model:open="open" title="Streak" variant="form">
    <div class="flex flex-col items-center pb-[21px]">
      <StreakHero class="mt-4" :days="streak" />

      <div class="relative mt-[30px] flex gap-4">
        <div
          v-if="streak > 0"
          class="absolute -top-px h-[26px] rounded-full bg-gradient-to-r from-surface-orange-1 to-surface-orange-4"
          :style="barStyle"
        />
        <div
          v-for="day in week"
          :key="day.date.toISOString()"
          class="relative flex w-6 flex-col items-center gap-2"
        >
          <span
            class="flex size-6 items-center justify-center rounded-full text-base"
            :class="
              day.isToday
                ? 'bg-surface-orange-8 text-ink-base'
                : 'text-ink-gray-7'
            "
            :aria-current="day.isToday ? 'date' : undefined"
          >
            {{ day.date.getDate() }}
          </span>
          <span class="text-base-medium text-ink-gray-4">{{ day.letter }}</span>
        </div>
      </div>
    </div>
  </EspressoModal>
</template>
