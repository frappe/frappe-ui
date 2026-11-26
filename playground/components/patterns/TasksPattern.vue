<script setup lang="ts">
import { ref } from 'vue'
import { Avatar } from '../../../src'
import { ListView } from '../../../experimental/ListView'
import { faceFor, logos } from './designAssets'
import { espressoListView } from './listViewClasses'

type Progress = 'Overdue' | 'In progress' | 'Pending'

type Task = {
  id: number
  title: string
  progress: Progress
  assignee: string
  status: 'Low' | 'Medium' | 'High'
  organisation: string
  due: string
}

// The design paints a red cell on every third row regardless of what it says —
// an artefact of the sample data, not a rule. The rule that survives is the
// one the word carries: an overdue task is the red one.
const isLate = (progress: Progress) => progress === 'Overdue'

// 1180 = 16 (row padding) + 14 (checkbox) + 6 gaps of 16 + 1054 of columns.
// The five right-hand widths are the design's; the title takes the remainder.
const columns = [
  { label: 'Task title', key: 'title', width: '406px' },
  { label: 'Progress', key: 'progress', width: '104px' },
  { label: 'Assignee', key: 'assignee', width: '168px' },
  { label: 'Status', key: 'status', width: '104px' },
  { label: 'Organisation', key: 'organisation', width: '168px' },
  { label: 'Due', key: 'due', width: '104px' },
]

const tasks: Task[] = [
  {
    id: 1,
    title: 'Product marketing',
    progress: 'Overdue',
    assignee: 'Avinash Goel',
    status: 'Low',
    organisation: 'Dropbox',
    due: '3 Sept',
  },
  {
    id: 2,
    title: 'User experience design',
    progress: 'In progress',
    assignee: 'Sara Patel',
    status: 'Medium',
    organisation: 'Zapier',
    due: '10 Sept',
  },
  {
    id: 3,
    title: 'Data analysis',
    progress: 'Pending',
    assignee: 'Michael Johnson',
    status: 'High',
    organisation: 'Miro',
    due: '17 Sept',
  },
  {
    id: 4,
    title: 'Website redesign',
    progress: 'In progress',
    assignee: 'Emily Chen',
    status: 'High',
    organisation: 'Figma',
    due: '24 Sept',
  },
  {
    id: 5,
    title: 'SEO Optimization',
    progress: 'Pending',
    assignee: 'James Lee',
    status: 'Medium',
    organisation: 'Evergreen',
    due: '5 Oct',
  },
  {
    id: 6,
    title: 'Content strategy',
    progress: 'Overdue',
    assignee: 'Rachel Adams',
    status: 'Low',
    organisation: 'Github',
    due: '15 Oct',
  },
  {
    id: 7,
    title: 'A/B testing',
    progress: 'In progress',
    assignee: 'David Brown',
    status: 'High',
    organisation: 'Gumroad',
    due: '22 Oct',
  },
  {
    id: 8,
    title: 'Social media campaign',
    progress: 'Pending',
    assignee: 'Linda White',
    status: 'Medium',
    organisation: 'Attentive',
    due: '30 Oct',
  },
  {
    id: 9,
    title: 'Branding refresh',
    progress: 'Overdue',
    assignee: 'Chris Martin',
    status: 'Low',
    organisation: 'Cooper',
    due: '3 Nov',
  },
  {
    id: 10,
    title: 'Market research',
    progress: 'In progress',
    assignee: 'Olivia Green',
    status: 'High',
    organisation: 'Spotify',
    due: '10 Nov',
  },
]

// `name` mirrors the id: ListView looks up a selected row's neighbours by
// `name` when it decides the block's corners and the rule between rows.
const rows = tasks.map((task) => ({ ...task, name: task.id }))

const opened = ref<string | null>(null)
</script>

<template>
  <!--
    Same shell as Leads and Tickets — 1180px of table, 40px rows, a 32px label
    row with no fill and one outline-gray-1 rule. The one difference the design
    asks for is the row control: a circle instead of a square, because ticking
    a task reads as completing it. The header keeps its square select-all, as
    the design draws it.
  -->
  <div class="w-[1180px] max-w-full overflow-x-auto">
    <ListView
      :class="`w-[1180px] ${espressoListView} [&_.transition-all.flex-col_input]:!rounded-full`"
      :columns="columns"
      :rows="rows"
      row-key="id"
      :options="{
        selectable: true,
        showTooltip: false,
        rowHeight: 40,
        onRowClick: (row: Task) => (opened = row.title),
      }"
    >
      <template #cell="{ item, row, column }">
        <span class="flex min-w-0 items-center gap-2">
          <Avatar
            v-if="column.key === 'assignee'"
            size="sm"
            :image="faceFor((row as Task).assignee)"
            :label="(row as Task).assignee"
          />
          <Avatar
            v-else-if="column.key === 'organisation'"
            size="sm"
            shape="square"
            :image="logos[(row as Task).organisation]"
            :label="(row as Task).organisation"
          />

          <!-- The task's own name is the one medium, ink-gray-8 cell in a row;
               an overdue task is the one red one. -->
          <span
            class="truncate"
            :class="[
              column.key === 'title'
                ? 'text-base-medium text-ink-gray-8'
                : 'text-base',
              column.key === 'progress' && isLate((row as Task).progress)
                ? 'text-ink-red-5'
                : column.key === 'title'
                  ? ''
                  : 'text-ink-gray-6',
            ]"
          >
            {{ item }}
          </span>
        </span>
      </template>
    </ListView>
  </div>
</template>
