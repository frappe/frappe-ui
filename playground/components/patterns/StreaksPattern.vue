<script setup lang="ts">
import { ref } from 'vue'
import { Avatar, Progress } from '../../../src'
import { ListView } from '../../../experimental/ListView'
import { faceFor } from './designAssets'
import { espressoListView } from './listViewClasses'

type Streak = {
  id: number
  person: string
  progress: number
  streak: string
  chapter: string
  started: string
}

// Laid out the way Tasks is: the one column that names the row takes the
// width, the rest sit together on the right. Sized a step above what they
// strictly hold — packed to the content they read as cramped.
const columns = [
  { label: 'Name', key: 'person', width: '1fr' },
  { label: 'Course progress', key: 'progress', width: '168px' },
  { label: 'Longest streak', key: 'streak', width: '136px' },
  { label: 'Chapter', key: 'chapter', width: '104px' },
  { label: 'Start date', key: 'started', width: '136px' },
]

const streaks: Streak[] = [
  {
    id: 1,
    person: 'James fenimore',
    progress: 20,
    streak: '62 days',
    chapter: '7/9',
    started: 'Jul 10',
  },
  {
    id: 2,
    person: 'Praveen Raj',
    progress: 57,
    streak: '57 days',
    chapter: '6/9',
    started: 'Jun 15',
  },
  {
    id: 3,
    person: 'Maria Gonzalez',
    progress: 34,
    streak: '52 days',
    chapter: '4/9',
    started: 'Jun 6',
  },
  {
    id: 4,
    person: 'Li Wei',
    progress: 72,
    streak: '49 days',
    chapter: '3/9',
    started: 'May 25',
  },
  {
    id: 5,
    person: 'Aisha Khan',
    progress: 45,
    streak: '43 days',
    chapter: '3/9',
    started: 'May 24',
  },
  {
    id: 6,
    person: 'Carlos Ramirez',
    progress: 88,
    streak: '38 days',
    chapter: '2/9',
    started: 'Apr 10',
  },
  {
    id: 7,
    person: 'Sophia Lee',
    progress: 63,
    streak: '27 days',
    chapter: '1/9',
    started: 'Apr 10',
  },
  {
    id: 8,
    person: 'Noah Bergman',
    progress: 31,
    streak: '24 days',
    chapter: '1/9',
    started: 'Apr 4',
  },
  {
    id: 9,
    person: 'Ingrid Olsen',
    progress: 96,
    streak: '19 days',
    chapter: '8/9',
    started: 'Mar 28',
  },
  {
    id: 10,
    person: 'Tomás Ferreira',
    progress: 12,
    streak: '11 days',
    chapter: '1/9',
    started: 'Mar 21',
  },
]

// `name` mirrors the id: ListView looks up a selected row's neighbours by
// `name`, so the person's name lives on `person` instead.
const rows = streaks.map((streak) => ({ ...streak, name: streak.id }))

const opened = ref<string | null>(null)
</script>

<template>
  <div class="w-[1180px] max-w-full overflow-x-auto">
    <!-- No checkbox column: the design doesn't draw one. -->
    <ListView
      :class="`!w-full ${espressoListView}`"
      :columns="columns"
      :rows="rows"
      row-key="id"
      :options="{
        selectable: false,
        showTooltip: false,
        rowHeight: 40,
        onRowClick: (row: Streak) => (opened = row.person),
      }"
    >
      <template #cell="{ item, row, column }">
        <span class="flex min-w-0 items-center gap-2">
          <Avatar
            v-if="column.key === 'person'"
            size="sm"
            :image="faceFor((row as Streak).person)"
            :label="(row as Streak).person"
          />

          <!-- The bar is a fixed width so the percentages line up down the
               column; `sm` is the design's 2px track. -->
          <template v-else-if="column.key === 'progress'">
            <Progress :value="(row as Streak).progress" size="sm" class="!w-[88px] shrink-0" />
            <span class="text-base text-ink-gray-5">
              {{ (row as Streak).progress }}%
            </span>
          </template>

          <span v-else-if="column.key === 'streak'" aria-hidden="true">🔥</span>

          <span
            v-if="column.key !== 'progress'"
            class="truncate"
            :class="
              column.key === 'person'
                ? 'text-base-medium text-ink-gray-8'
                : 'text-base text-ink-gray-6'
            "
          >
            {{ item }}
          </span>
        </span>
      </template>
    </ListView>
  </div>
</template>
