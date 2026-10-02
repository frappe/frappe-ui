<script setup lang="ts">
// Figma: espresso-2.0 › References › modal 600 (34961:139270) — "popup",
// New task. Title + description, then a row of subtle sm property chips
// (8px apart), each a frappe-ui Dropdown; full-width solid md Create.
import { computed, reactive, watch } from 'vue'
import { Avatar, Button, Dropdown, Textarea, TextInput } from '../../../src'
import frankGill from '../assets/600/task-assignee-avatar.png'
import EspressoModal from './EspressoModal.vue'
import ModalField from './ModalField.vue'

type Status = 'backlog' | 'todo' | 'in-progress' | 'done'
type Priority = 'low' | 'medium' | 'high' | 'urgent'

export interface NewTask {
  title: string
  description: string
  status: Status
  assignee: string | null
  due: Date
  tags: string[]
  priority: Priority
}

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{ create: [task: NewTask] }>()

const STATUS: Record<Status, { label: string; icon: string }> = {
  backlog: { label: 'Backlog', icon: 'lucide-circle-dashed' },
  todo: { label: 'To-do', icon: 'lucide-circle' },
  'in-progress': { label: 'In progress', icon: 'lucide-circle-dot' },
  done: { label: 'Done', icon: 'lucide-circle-check' },
}

const PRIORITY: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

const people = [
  { name: 'Frank Gill', image: frankGill },
  { name: 'Olivia Garcia' },
  { name: 'Liam Green' },
]

const TAGS = ['Design', 'Web', 'Branding', 'Launch', 'Research']

const today = new Date(2025, 2, 26)
const addDays = (n: number) =>
  new Date(today.getFullYear(), today.getMonth(), today.getDate() + n)

const blank = (): NewTask => ({
  title: '',
  description: '',
  status: 'todo',
  assignee: 'Frank Gill',
  due: addDays(1),
  tags: TAGS.slice(0, 4),
  priority: 'high',
})

const task = reactive(blank())

watch(open, (isOpen) => {
  if (!isOpen) Object.assign(task, blank())
})

const assignee = computed(() => people.find((p) => p.name === task.assignee))

const dueLabel = computed(() =>
  task.due.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
)

const statusOptions = computed(() =>
  (Object.keys(STATUS) as Status[]).map((s) => ({
    label: STATUS[s].label,
    icon: STATUS[s].icon,
    selected: task.status === s,
    onClick: () => (task.status = s),
  })),
)

const assigneeOptions = computed(() =>
  people.map((p) => ({
    label: p.name,
    selected: task.assignee === p.name,
    onClick: () => (task.assignee = p.name),
  })),
)

const dueOptions = computed(() =>
  [
    { label: 'Today', days: 0 },
    { label: 'Tomorrow', days: 1 },
    { label: 'In a week', days: 7 },
  ].map(({ label, days }) => ({
    label,
    icon: 'lucide-calendar',
    onClick: () => (task.due = addDays(days)),
  })),
)

const tagOptions = computed(() =>
  TAGS.map((tag) => ({
    label: tag,
    switch: true as const,
    switchValue: task.tags.includes(tag),
    onClick: (on: boolean) => {
      task.tags = on
        ? [...task.tags, tag]
        : task.tags.filter((t) => t !== tag)
    },
  })),
)

const priorityOptions = computed(() =>
  (Object.keys(PRIORITY) as Priority[]).map((p) => ({
    label: PRIORITY[p],
    selected: task.priority === p,
    onClick: () => (task.priority = p),
  })),
)

function create(close: () => void) {
  if (!task.title.trim()) return
  emit('create', { ...task, tags: [...task.tags] })
  close()
}
</script>

<template>
  <EspressoModal
    v-model:open="open"
    title="New task"
    variant="form"
    width="600"
  >
    <div class="flex flex-col gap-5">
      <ModalField label="Title">
        <TextInput
          v-model="task.title"
          size="md"
          variant="outline"
          placeholder="Landing page - Hash"
        />
      </ModalField>

      <ModalField label="Description">
        <Textarea
          v-model="task.description"
          size="md"
          variant="outline"
          :rows="3"
          placeholder="Hash is a global branding and digital design agency building products, services, and eCommerce experiences that turn cultural values into company value."
        />
      </ModalField>

      <!-- property chips: subtle sm, 8px apart -->
      <div class="flex flex-wrap items-center gap-2">
        <Dropdown :options="statusOptions">
          <Button variant="subtle" size="sm">
            <template #prefix>
              <span
                :class="[STATUS[task.status].icon, 'size-4 text-ink-gray-7']"
              />
            </template>
            {{ STATUS[task.status].label }}
          </Button>
        </Dropdown>

        <Dropdown :options="assigneeOptions">
          <Button variant="subtle" size="sm" class="!text-ink-gray-5">
            <template #prefix>
              <Avatar
                size="sm"
                shape="circle"
                :image="assignee?.image"
                :label="assignee?.name ?? 'Unassigned'"
              />
            </template>
            {{ assignee?.name ?? 'Assignee' }}
          </Button>
        </Dropdown>

        <Dropdown :options="dueOptions">
          <Button variant="subtle" size="sm">
            <template #prefix>
              <span class="lucide-calendar-clock size-4 text-ink-gray-7" />
            </template>
            {{ dueLabel }}
            <template #suffix>
              <span class="lucide-chevron-down size-4 text-ink-gray-7" />
            </template>
          </Button>
        </Dropdown>

        <Dropdown :options="tagOptions">
          <Button variant="subtle" size="sm">
            <template #prefix>
              <span class="lucide-tag size-4 text-ink-gray-7" />
            </template>
            {{ task.tags.length }} {{ task.tags.length === 1 ? 'tag' : 'tags' }}
          </Button>
        </Dropdown>

        <Dropdown :options="priorityOptions">
          <Button variant="subtle" size="sm">
            <template #prefix>
              <span class="lucide-circle-alert size-4 text-ink-gray-7" />
            </template>
            {{ PRIORITY[task.priority] }}
          </Button>
        </Dropdown>
      </div>
    </div>

    <template #footer="{ close }">
      <Button
        class="w-full"
        variant="solid"
        size="md"
        :disabled="!task.title.trim()"
        @click="create(close)"
      >
        Create
      </Button>
    </template>
  </EspressoModal>
</template>
