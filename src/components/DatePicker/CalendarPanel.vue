<template>
  <div class="select-none text-base text-ink-gray-9">
    <div
      v-if="centerHeader"
      class="flex items-center justify-between p-2 pb-0 gap-1"
    >
      <Button
        :class="{ invisible: hidePrev }"
        label="previous"
        variant="ghost"
        icon="lucide-chevron-left"
        @click="emit('prev')"
      />
      <span class="text-sm font-medium text-ink-gray-7">
        <span v-if="view === 'date'">
          {{ months[currentMonth] }} {{ currentYear }}
        </span>
        <span v-else-if="view === 'month'">{{ currentYear }}</span>
        <span v-else>{{ yearRangeStart }} - {{ yearRangeStart + 11 }}</span>
      </span>
      <Button
        :class="{ invisible: hideNext }"
        label="next"
        variant="ghost"
        icon="lucide-chevron-right"
        @click="emit('next')"
      />
    </div>
    <div v-else class="flex items-center justify-between p-2 pb-0 gap-1">
      <Button
        variant="ghost"
        size="sm"
        class="text-sm font-medium text-ink-gray-7"
        label="cycle-calendar-view"
        @click="emit('cycleView')"
      >
        <span v-if="view === 'date'">
          {{ months[currentMonth] }} {{ currentYear }}
        </span>
        <span v-else-if="view === 'month'">{{ currentYear }}</span>
        <span v-else>{{ yearRangeStart }} - {{ yearRangeStart + 11 }}</span>
      </Button>
      <div class="flex items-center">
        <Button
          v-if="!hidePrev"
          label="previous"
          variant="ghost"
          icon="lucide-chevron-left"
          @click="emit('prev')"
        />
        <Button
          v-if="todayLabel && !hideToday"
          :label="todayLabel"
          variant="ghost"
          class="text-xs"
          @click="emit('today')"
        />
        <Button
          v-if="!hideNext"
          label="next"
          variant="ghost"
          icon="lucide-chevron-right"
          @click="emit('next')"
        />
      </div>
    </div>
    <div class="p-2">
      <div
        v-if="view === 'date'"
        role="grid"
        aria-label="Calendar dates"
        @mouseleave="emit('hoverCell', null)"
      >
        <div
          class="flex items-center text-xs font-medium uppercase text-ink-gray-4 mb-1 gap-0.5"
        >
          <div
            v-for="(d, di) in WEEKDAYS"
            :key="di"
            class="flex size-7 items-center justify-center"
          >
            {{ d }}
          </div>
        </div>
        <div class="flex flex-col gap-0.5">
          <div
            v-for="(week, wi) in weeks"
            :key="wi"
            class="flex gap-0.5"
            role="row"
          >
            <template v-for="cell in week" :key="cell.key">
              <div
                v-if="hideOutOfMonth && !cell.inMonth"
                class="size-7"
                aria-hidden="true"
              />
              <button
                v-else
                type="button"
                class="flex size-7 items-center justify-center text-sm transition-colors duration-100 focus:outline-none focus:ring-2 focus:ring-outline-gray-2"
                :class="cellClass(cell)"
                role="gridcell"
                :aria-selected="ariaSelected(cell)"
                :aria-disabled="cell.isUnavailable ? 'true' : undefined"
                :aria-label="ariaLabel(cell)"
                :disabled="cell.isUnavailable"
                @mouseenter="emit('hoverCell', cell.date)"
                @click="!cell.isUnavailable && emit('selectDate', cell.date)"
              >
                {{ cell.date.date() }}
              </button>
            </template>
          </div>
        </div>
      </div>
      <div
        v-else-if="view === 'month'"
        class="grid grid-cols-3 gap-1"
        role="grid"
        aria-label="Select month"
      >
        <button
          v-for="(m, i) in months"
          type="button"
          :key="m"
          class="py-2 text-sm rounded cursor-pointer text-center hover:bg-surface-gray-2 focus:outline-none focus:ring-2 focus:ring-brand-6"
          :class="{
            'bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6':
              i === currentMonth,
          }"
          :aria-selected="i === currentMonth ? 'true' : 'false'"
          @click="emit('selectMonth', i)"
        >
          {{ m.slice(0, 3) }}
        </button>
      </div>
      <div
        v-else
        class="grid grid-cols-3 gap-1"
        role="grid"
        aria-label="Select year"
      >
        <button
          v-for="y in yearRange"
          type="button"
          :key="y"
          class="py-2 text-sm rounded cursor-pointer text-center hover:bg-surface-gray-2 focus:outline-none focus:ring-2 focus:ring-brand-6"
          :class="{
            'bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6':
              y === currentYear,
          }"
          :aria-selected="y === currentYear ? 'true' : 'false'"
          @click="emit('selectYear', y)"
        >
          {{ y }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Dayjs } from 'dayjs/esm'
import { Button } from '../Button'
import { months } from './utils'
import type { DatePickerViewMode as ViewMode } from './types'

export interface CalendarPanelCell {
  date: Dayjs
  key: string
  inMonth: boolean
  isToday: boolean
  isSelected: boolean
  isUnavailable: boolean
  isRangeStart?: boolean
  isRangeEnd?: boolean
  inRange?: boolean
}

interface Props {
  view: ViewMode
  currentYear: number
  currentMonth: number
  yearRangeStart: number
  yearRange: number[]
  weeks: CalendarPanelCell[][]
  /** Label for the optional Today/Now action button between prev/next. Empty/undefined hides it. */
  todayLabel?: string
  /** Hide the prev nav button — used in dual-pane right side. */
  hidePrev?: boolean
  /** Hide the next nav button — used in dual-pane left side. */
  hideNext?: boolean
  /** Hide the Today/Now button — used in dual-pane to avoid duplicates. */
  hideToday?: boolean
  /** Render out-of-month cells as empty placeholders — used in dual-pane to avoid showing the same date in both panes. */
  hideOutOfMonth?: boolean
  /**
   * Render a slim header with prev/next flanking a centered, non-clickable
   * month label. Used in dual-pane so the two panels read as
   * `< First Month | Second Month >`.
   */
  centerHeader?: boolean
}

withDefaults(defineProps<Props>(), {
  todayLabel: '',
  hidePrev: false,
  hideNext: false,
  hideToday: false,
  hideOutOfMonth: false,
  centerHeader: false,
})

const emit = defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
  (e: 'today'): void
  (e: 'cycleView'): void
  (e: 'selectMonth', i: number): void
  (e: 'selectYear', y: number): void
  (e: 'selectDate', d: Dayjs): void
  (e: 'hoverCell', d: Dayjs | null): void
}>()

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function ariaSelected(cell: CalendarPanelCell): 'true' | 'false' {
  return cell.isSelected || cell.isRangeStart || cell.isRangeEnd
    ? 'true'
    : 'false'
}

function ariaLabel(cell: CalendarPanelCell): string {
  return cell.date.format('YYYY-MM-DD') + (cell.isToday ? ' (Today)' : '')
}

function cellClass(cell: CalendarPanelCell): Array<string | false> {
  const inMonthCls = cell.inMonth ? 'text-ink-gray-8' : 'text-ink-gray-3'
  const todayCls = cell.isToday ? 'font-semibold text-ink-gray-9' : ''

  if (cell.isUnavailable) {
    return [inMonthCls, todayCls, 'rounded opacity-30 cursor-not-allowed']
  }

  if (cell.isRangeStart || cell.isRangeEnd) {
    return [
      inMonthCls,
      todayCls,
      'rounded bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6 cursor-pointer',
    ]
  }

  if (cell.inRange) {
    return [
      inMonthCls,
      todayCls,
      'rounded bg-surface-gray-3 hover:bg-surface-gray-3 cursor-pointer',
    ]
  }

  if (cell.isSelected) {
    return [
      inMonthCls,
      todayCls,
      'rounded bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6 cursor-pointer',
    ]
  }

  return [inMonthCls, todayCls, 'rounded hover:bg-surface-gray-2 cursor-pointer']
}
</script>
