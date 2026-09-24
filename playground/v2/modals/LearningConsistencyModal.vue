<script setup lang="ts">
// Figma: espresso-2.0 › References › modal (34953:131529). Streak hero, the
// current week as pills, a stats strip, and a monthly tracker grid with a
// legend. Content spacing (from Figma positions): title → flame 36,
// hero → week 20, week → stats 30, stats → tracker 24.
import { computed, ref, watch } from 'vue'
import { Badge, Button, Divider, TabButtons, Tooltip } from '../../../src'
import EspressoModal from './EspressoModal.vue'
import StreakDayIcon, { type DayStatus } from './streak/StreakDayIcon.vue'
import StreakHero from './streak/StreakHero.vue'

interface TrackedDay {
  date: Date
  status: DayStatus
}

const props = withDefaults(
  defineProps<{
    streak?: number
    longestStreak?: number
    lessonsCompleted?: number
    /** Longest run inside the shown month, for the badge. */
    monthLongest?: number
    week?: { day: string; status: DayStatus }[]
    /** Status per day of August 2025, in order; the rest are future days. */
    august?: DayStatus[]
    today?: Date
  }>(),
  {
    streak: 18,
    longestStreak: 3,
    lessonsCompleted: 131,
    monthLongest: 4,
    week: () => [
      { day: 'S', status: 'achieved' },
      { day: 'M', status: 'missed' },
      { day: 'T', status: 'achieved' },
      { day: 'W', status: 'achieved' },
      { day: 'T', status: 'achieved' },
      { day: 'F', status: 'empty' },
      { day: 'S', status: 'empty' },
    ],
    // prettier-ignore
    august: () => [
      'missed', 'missed', 'achieved', 'achieved', 'achieved', 'achieved',
      'missed', 'missed', 'missed', 'achieved', 'achieved', 'achieved',
      'achieved', 'achieved', 'missed', 'achieved', 'missed', 'achieved',
      'achieved', 'holiday', 'achieved', 'holiday', 'achieved', 'achieved',
      'achieved', 'missed', 'achieved', 'achieved', 'achieved',
    ],
    today: () => new Date(2025, 7, 29),
  },
)

const open = defineModel<boolean>('open', { default: false })

const view = ref<'daily' | 'weekly'>('daily')
const monthOffset = ref(0)

watch(open, (isOpen) => {
  if (isOpen) {
    view.value = 'daily'
    monthOffset.value = 0
  }
})

// Tracking starts in the month of `today`, so there's nothing before it.
const month = computed(
  () =>
    new Date(
      props.today.getFullYear(),
      props.today.getMonth() + monthOffset.value,
      1,
    ),
)

const monthLabel = computed(() =>
  month.value.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
)

const days = computed<TrackedDay[]>(() => {
  const { value: first } = month
  const count = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  return Array.from({ length: count }, (_, i) => ({
    date: new Date(first.getFullYear(), first.getMonth(), i + 1),
    status: (monthOffset.value === 0 && props.august[i]) || 'empty',
  }))
})

// A week counts as achieved once four of its days are.
const weeks = computed<TrackedDay[]>(() => {
  const out: TrackedDay[] = []
  for (let i = 0; i < days.value.length; i += 7) {
    const slice = days.value.slice(i, i + 7)
    const done = slice.filter((d) => d.status === 'achieved').length
    const started = slice.some((d) => d.status !== 'empty')
    out.push({
      date: slice[0].date,
      status: !started ? 'empty' : done >= 4 ? 'achieved' : 'missed',
    })
  }
  return out
})

const cells = computed(() => (view.value === 'daily' ? days.value : weeks.value))

// Figma fills the last row out with empty rings, so the grid stays square.
const padding = computed(() => (12 - (cells.value.length % 12)) % 12)

function isToday(date: Date) {
  return view.value === 'daily' && date.toDateString() === props.today.toDateString()
}

function tooltip(date: Date) {
  const day = date.toLocaleDateString('en-GB', { day: '2-digit' })
  const rest = date.toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  })
  const label = `${day} ${rest.replace(' ', ', ')}`
  return view.value === 'weekly' ? `Week of ${label}` : label
}

const stats = computed(() => [
  { label: 'Current Streak', value: `${props.streak} days` },
  { label: 'Longest Streak', value: `${props.longestStreak} days` },
  { label: 'Lesson Completed', value: String(props.lessonsCompleted) },
])

const legend: { status: DayStatus; label: string }[] = [
  { status: 'achieved', label: 'Achieved' },
  { status: 'missed', label: 'Missed' },
  { status: 'holiday', label: 'Holiday' },
]
</script>

<template>
  <EspressoModal
    v-model:open="open"
    title="Learning consistency"
    variant="form"
    close-placement="inline"
  >
    <div class="flex flex-col">
      <StreakHero class="mt-4" :days="streak" lead-weight="medium" />

      <!-- week pills: 26 × 50, 14px apart -->
      <div class="mt-5 flex justify-center gap-3.5">
        <div
          v-for="(day, i) in week"
          :key="i"
          class="flex w-[26px] flex-col items-center gap-1 rounded-full pb-1"
          :class="
            day.status === 'achieved' ? 'bg-surface-cyan-2' : 'bg-surface-gray-2'
          "
        >
          <StreakDayIcon :status="day.status" :size="26" strong filled />
          <span
            class="text-base-medium"
            :class="
              day.status === 'achieved' ? 'text-ink-gray-6' : 'text-ink-gray-4'
            "
          >
            {{ day.day }}
          </span>
        </div>
      </div>

      <!-- stats strip: surface-gray-2, 8px radius, dividers 34px -->
      <div
        class="mt-[30px] flex items-center rounded-4 bg-surface-gray-2 py-2 pl-2.5 pr-2"
      >
        <template v-for="(stat, i) in stats" :key="stat.label">
          <Divider
            v-if="i > 0"
            class="mx-[15px] !h-[34px] shrink-0"
            orientation="vertical"
          />
          <div class="flex flex-auto flex-col gap-1">
            <p class="whitespace-nowrap text-base text-ink-gray-6">
              {{ stat.label }}
            </p>
            <p class="text-lg-semibold text-ink-gray-9">{{ stat.value }}</p>
          </div>
        </template>
      </div>

      <!-- monthly tracker -->
      <div class="mt-6 flex flex-col gap-[19px]">
        <div class="flex items-center justify-between">
          <h4 class="text-lg-semibold text-ink-gray-9">Monthly Tracker</h4>
          <Badge theme="green" variant="subtle" size="lg">
            <!-- icon/solid/fire, from the Figma badge (2x viewBox) -->
            <template #prefix>
              <svg
                viewBox="16 12 24 24"
                fill="currentColor"
                class="size-3"
                aria-hidden="true"
              >
                <path
                  d="M27.7034 14.0005C31.489 16.3696 30.5857 21.8104 30.5764 21.8657C31.7328 21.0008 32.6502 19.8555 33.2405 18.5376C34.804 19.9678 36.5667 24.3419 36.2971 27.5591C36.2412 28.9146 35.8111 30.2295 35.0549 31.356C34.2988 32.4822 33.2451 33.3768 32.012 33.9419V33.9263C31.9493 32.6609 31.5584 31.4332 30.8792 30.3638C30.2 29.2945 29.2554 28.4194 28.137 27.8247C28.0717 28.3601 27.9001 28.8776 27.6331 29.3462C27.3657 29.815 27.0062 30.2261 26.5784 30.5552C26.0734 30.9844 25.6588 31.5107 25.3596 32.1021C25.0604 32.6934 24.8829 33.3394 24.8362 34.0005C23.5293 33.3403 22.4324 32.3268 21.6702 31.0767C20.9083 29.8267 20.5101 28.3881 20.5217 26.9243C20.4896 23.4995 23.5472 20.2866 25.1721 18.8579C25.9117 18.2719 26.5191 17.5364 26.9553 16.6997C27.3916 15.8627 27.6466 14.9427 27.7034 14.0005Z"
                />
              </svg>
            </template>
            {{ monthLongest }} Longest streak
          </Badge>
        </div>

        <div class="flex items-center justify-between">
          <TabButtons
            v-model="view"
            variant="subtle"
            size="sm"
            :options="[
              { label: 'Daily', value: 'daily' },
              { label: 'Weekly', value: 'weekly' },
            ]"
          />
          <div class="flex items-center gap-2.5">
            <span class="text-base text-ink-gray-9">{{ monthLabel }}</span>
            <div class="flex">
              <Button
                variant="ghost"
                size="sm"
                label="Previous month"
                :disabled="monthOffset <= 0"
                @click="monthOffset--"
              >
                <template #icon>
                  <span class="lucide-chevron-left size-4" />
                </template>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                label="Next month"
                @click="monthOffset++"
              >
                <template #icon>
                  <span class="lucide-chevron-right size-4" />
                </template>
              </Button>
            </div>
          </div>
        </div>

        <!-- 12 columns of 24px cells: 10px across, 12px down -->
        <div class="grid grid-cols-12 gap-x-2.5 gap-y-3">
          <Tooltip
            v-for="cell in cells"
            :key="cell.date.toISOString()"
            :text="tooltip(cell.date)"
          >
            <span class="relative flex justify-center">
              <StreakDayIcon :status="cell.status" />
              <!-- today: 6 × 4 amber caret, 4px under the cell -->
              <span
                v-if="isToday(cell.date)"
                class="absolute -bottom-2 h-1 w-1.5 bg-surface-amber-6 [clip-path:polygon(50%_0,100%_100%,0_100%)]"
              />
            </span>
          </Tooltip>
          <StreakDayIcon
            v-for="n in padding"
            :key="`pad-${n}`"
            class="justify-self-center"
            status="empty"
          />
        </div>
      </div>

      <!-- divider 28px under the grid, legend 14px under the divider -->
      <Divider class="mt-7" />
      <div class="mt-3.5">
        <div class="flex items-center gap-2.5">
          <div
            v-for="item in legend"
            :key="item.status"
            class="flex items-center gap-1.5"
          >
            <StreakDayIcon :status="item.status" />
            <span class="text-base text-ink-gray-9">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </EspressoModal>
</template>
