<script setup lang="ts">
// Figma: espresso-2.0 › List › Task (30989:24065), first five rows. A 740px
// column of task "cells", ruled between:
//   row    p 12, 14px checkbox · 8px · body · 16px ⋯; 16px-radius
//          surface-gray-1 hover, the rules around it dropping away
//   body   14 medium gray-800 title (struck through once done) · 4px ·
//          14/21 gray-700 description · 8px · 16px calendar + 14/21 due date,
//          coloured by when it's due (done: gray-500, today: red, soon: amber,
//          later: green)
import { ref } from 'vue'
import { Button, Checkbox, Dropdown } from '../../../src'

type Due = 'today' | 'soon' | 'later'

interface Task {
  id: number
  title: string
  description: string
  due: string
  when: Due
  done: boolean
}

const tasks = ref<Task[]>([
  {
    id: 1,
    title: 'Set up user surveys',
    description:
      'Seek out popular task applications designed to boost your creative potential.',
    due: 'Apr 8',
    when: 'later',
    done: true,
  },
  {
    id: 2,
    title: 'Analyze competitors',
    description:
      'Seek out popular task applications designed to boost your creative potential.',
    due: 'Apr 14',
    when: 'later',
    done: true,
  },
  {
    id: 3,
    title: 'Competitive Analysis',
    description:
      'Study existing apps like Todoist, Microsoft To-Do, and Google Tasks.',
    due: 'Today 3:00PM',
    when: 'today',
    done: false,
  },
  {
    id: 4,
    title: 'Conduct a comprehensive review of rival products and their approaches.',
    description:
      'Explore popular task management apps like Todoist, Microsoft To-Do, and Google Task to ignite your creativity and streamline your workflow.',
    due: 'Tomorrow',
    when: 'soon',
    done: false,
  },
  {
    id: 5,
    title: 'Holistic Competitor Insights.',
    description:
      'Discover the best task management tools to ignite your creativity.',
    due: 'Tomorrow',
    when: 'soon',
    done: false,
  },
])

const DUE_COLOR: Record<Due, string> = {
  today: 'text-ink-red-5',
  soon: 'text-ink-amber-6',
  later: 'text-ink-green-6',
}

function actions(task: Task) {
  return [
    {
      label: task.done ? 'Mark as not done' : 'Mark as done',
      icon: task.done ? 'lucide-circle' : 'lucide-circle-check',
      onClick: () => (task.done = !task.done),
    },
    {
      label: 'Duplicate',
      icon: 'lucide-copy',
      onClick: () => {
        const at = tasks.value.indexOf(task)
        tasks.value.splice(at + 1, 0, { ...task, id: Date.now(), done: false })
      },
    },
    {
      label: 'Delete',
      icon: 'lucide-trash-2',
      theme: 'red' as const,
      onClick: () => (tasks.value = tasks.value.filter((t) => t !== task)),
    },
  ]
}
</script>

<template>
  <ul class="w-[740px] max-w-full" aria-label="Tasks">
    <li
      v-for="task in tasks"
      :key="task.id"
      class="espresso-task-row relative flex gap-2 rounded-7 p-3 transition-colors hover:bg-surface-gray-1 dark:hover:bg-surface-gray-2"
    >
      <!-- checkbox, centred on the 16px title line -->
      <div class="flex h-4 shrink-0 items-center">
        <Checkbox
          v-model="task.done"
          size="sm"
          :aria-label="`${task.title} — ${task.done ? 'done' : 'to do'}`"
        />
      </div>

      <div class="flex min-w-0 flex-1 gap-2">
        <div class="flex min-w-0 flex-1 flex-col gap-1">
          <p
            class="truncate text-base-medium text-ink-gray-7 transition-colors"
            :class="{ 'line-through decoration-ink-gray-7': task.done }"
          >
            {{ task.title }}
          </p>
          <div class="flex flex-col gap-2">
            <p class="truncate text-p-base text-ink-gray-6">{{ task.description }}</p>
            <p
              class="flex items-center gap-2 text-p-base transition-colors"
              :class="task.done ? 'text-ink-gray-4' : DUE_COLOR[task.when]"
            >
              <span class="lucide-calendar size-4 shrink-0" />
              {{ task.due }}
            </p>
          </div>
        </div>

        <!-- ⋯, 16px -->
        <Dropdown :options="actions(task)" align="end">
          <Button
            variant="ghost"
            size="xs"
            class="-m-1 shrink-0"
            :label="`More actions for ${task.title}`"
          >
            <template #icon>
              <span class="lucide-ellipsis size-4 text-ink-gray-7" />
            </template>
          </Button>
        </Dropdown>
      </div>
    </li>
  </ul>
</template>

<style>
/* Rules are straight lines under each row (a border would follow the
   rounded corners). The hovered row reads as one rounded block: its rule
   and the one above it drop away. The last row has none. */
.espresso-task-row::after {
  @apply absolute inset-x-0 bottom-0 border-b border-outline-gray-1 transition-opacity content-[''] dark:border-outline-gray-2;
}
.espresso-task-row:last-child::after,
.espresso-task-row:hover::after,
.espresso-task-row:has(+ .espresso-task-row:hover)::after {
  @apply opacity-0;
}
</style>
