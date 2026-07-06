<script setup>
import { computed, reactive, ref } from 'vue'
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  MobileNav,
  MobileNavItem,
  MobileShell,
  PageHeaderMobile,
  TabButtons,
  Textarea,
} from 'frappe-ui'
import { List, ListCell, ListRow } from 'frappe-ui/list'

const tab = ref('tasks')

const statuses = ['Backlog', 'Todo', 'In Progress', 'Done', 'Canceled']
const statusIcon = {
  Backlog: 'lucide-circle-dashed',
  Todo: 'lucide-circle',
  'In Progress': 'lucide-circle-dot',
  Done: 'lucide-circle-check',
  Canceled: 'lucide-circle-x',
}

// Priority signal icons, colored by severity (matches the desktop recipe):
// more bars = higher priority, hot for High down to muted for Low.
const priorityIcon = {
  High: 'lucide-signal-high',
  Medium: 'lucide-signal-medium',
  Low: 'lucide-signal-low',
}
const priorityColor = {
  High: 'text-ink-red-7',
  Medium: 'text-ink-amber-7',
  Low: 'text-ink-gray-5',
}

// Labels render as neutral gray-outline badges with a single colored dot, so
// the meta row stays quiet but each label is still recognizable.
const labelTheme = {
  Bug: 'red',
  Feature: 'blue',
  Improvement: 'green',
  Design: 'violet',
  Research: 'amber',
  Backend: 'gray',
  Frontend: 'gray',
  Docs: 'gray',
  Chore: 'gray',
}
const themeDot = {
  red: 'bg-surface-red-6',
  blue: 'bg-surface-blue-6',
  green: 'bg-surface-green-6',
  amber: 'bg-surface-amber-6',
  violet: 'bg-surface-violet-6',
  gray: 'bg-surface-gray-6',
}
const labelDotClass = (label) => themeDot[labelTheme[label]]

const me = 'Rhea Kapoor'
const people = [
  { name: 'Rhea Kapoor', image: 'https://i.pravatar.cc/150?img=1' },
  {
    name: 'Evan You',
    image: 'https://avatars.githubusercontent.com/u/499550?v=4',
  },
  { name: 'Priya Nair', image: 'https://i.pravatar.cc/150?img=5' },
  { name: 'Sam Rivera', image: 'https://i.pravatar.cc/150?img=12' },
  { name: 'Ana Costa', image: 'https://i.pravatar.cc/150?img=20' },
  { name: 'Maya Iyer', image: 'https://i.pravatar.cc/150?img=27' },
]
const imageOf = (name) => people.find((p) => p.name === name)?.image

const projectIcon = {
  'Website Redesign': 'lucide-globe',
  'Mobile App': 'lucide-smartphone',
  'Design System': 'lucide-shapes',
  'Q3 Launch': 'lucide-rocket',
}

const tasks = reactive([
  {
    id: 245,
    title: 'Fix layout shift on the pricing page',
    project: 'Website Redesign',
    status: 'In Progress',
    priority: 'High',
    labels: ['Bug', 'Frontend'],
    assignee: 'Priya Nair',
    due: 'Today',
    description:
      'The hero image loads without reserved space, so the whole page jumps once it decodes. Set explicit dimensions and measure CLS before and after.',
    comments: [],
  },
  {
    id: 231,
    title: 'Fix validation errors in the checkout flow',
    project: 'Website Redesign',
    status: 'In Progress',
    priority: 'High',
    labels: ['Bug', 'Frontend'],
    assignee: 'Rhea Kapoor',
    due: 'Today',
    description:
      'The payment step accepts an empty billing address and then fails at the gateway with a generic error. Validate required fields inline, surface gateway errors next to the affected field, and keep the entered card details on retry.',
    comments: [
      {
        author: 'Evan You',
        time: '2h ago',
        text: 'Reproduced it — the address form skips validation when you pay with a saved card. That path is probably the real bug.',
      },
      {
        author: 'Rhea Kapoor',
        time: '1h ago',
        text: 'Agreed. Fixing the saved-card path first, then adding inline errors for the rest of the form.',
      },
    ],
  },
  {
    id: 244,
    title: 'Fix push notifications not arriving on iOS 17',
    project: 'Mobile App',
    status: 'In Progress',
    priority: 'High',
    labels: ['Bug', 'Backend'],
    assignee: 'Sam Rivera',
    due: 'Tomorrow',
    description:
      'A chunk of iOS 17 devices stopped receiving pushes after the last release. Suspect the APNs token refresh — add logging around registration and compare against Android.',
    comments: [
      {
        author: 'Sam Rivera',
        time: '5h ago',
        text: 'Tokens look stale for users who upgraded in place. Testing a forced re-registration on launch.',
      },
    ],
  },
  {
    id: 236,
    title: 'Migrate components to design tokens',
    project: 'Design System',
    status: 'In Progress',
    priority: 'Medium',
    labels: ['Improvement', 'Frontend'],
    assignee: 'Maya Iyer',
    due: 'Jul 8',
    description:
      'Replace the remaining hardcoded colors and spacing with semantic tokens so theming works in one place. Start with the form controls.',
    comments: [],
  },
  {
    id: 235,
    title: 'Review the onboarding flow prototype',
    project: 'Mobile App',
    status: 'Todo',
    priority: 'High',
    labels: ['Design'],
    assignee: 'Rhea Kapoor',
    due: 'Jul 7',
    description:
      'Second iteration is up. Focus on the empty states and the progress indicator — both changed since the last review.',
    comments: [
      {
        author: 'Ana Costa',
        time: '1d ago',
        text: 'Prototype link is in the project description. The step counter is the part I am least sure about.',
      },
    ],
  },
  {
    id: 237,
    title: 'Build offline mode for the task list',
    project: 'Mobile App',
    status: 'Todo',
    priority: 'High',
    labels: ['Feature'],
    assignee: 'Priya Nair',
    due: 'Jul 13',
    description:
      'Cache the task list locally and queue edits made while offline, then reconcile on reconnect. Show a clear indicator when changes are pending sync.',
    comments: [],
  },
  {
    id: 228,
    title: 'Migrate marketing pages to the new CMS',
    project: 'Website Redesign',
    status: 'Todo',
    priority: 'Medium',
    labels: ['Feature', 'Backend'],
    assignee: 'Priya Nair',
    due: 'Jul 8',
    description:
      'Move the pricing, about, and careers pages off the legacy templates. Content is already exported — wire up the new layouts and set redirects for the old URLs.',
    comments: [],
  },
  {
    id: 239,
    title: 'Prepare the press kit',
    project: 'Q3 Launch',
    status: 'Todo',
    priority: 'High',
    labels: ['Docs', 'Design'],
    assignee: 'Ana Costa',
    due: 'Jul 10',
    description:
      'Assemble the fact sheet, founder bios, logo pack, and three product screenshots into a single downloadable kit for press.',
    comments: [],
  },
  {
    id: 216,
    title: 'Set up analytics events for the signup funnel',
    project: 'Website Redesign',
    status: 'Backlog',
    priority: 'Medium',
    labels: ['Backend'],
    assignee: 'Sam Rivera',
    due: '',
    description:
      'Instrument each step of the signup funnel so we can see where people drop off. Match the event names to the existing dashboard schema.',
    comments: [],
  },
  {
    id: 226,
    title: 'Draft the launch announcement email',
    project: 'Q3 Launch',
    status: 'Backlog',
    priority: 'Low',
    labels: ['Docs'],
    assignee: 'Rhea Kapoor',
    due: 'Jul 15',
    description:
      'First draft of the announcement for the existing-customer list: what changed, what it costs, and one clear call to action. Marketing reviews it on the 16th.',
    comments: [],
  },
  {
    id: 208,
    title: 'Ship empty-state illustrations',
    project: 'Design System',
    status: 'Done',
    priority: 'High',
    labels: ['Design'],
    assignee: 'Rhea Kapoor',
    due: 'Jul 1',
    description:
      'Final set of six empty-state illustrations, exported for both themes and wired into the component library.',
    comments: [
      {
        author: 'Priya Nair',
        time: '3d ago',
        text: 'These look great in the app. Nice work!',
      },
    ],
  },
  {
    id: 201,
    title: 'Beta program wrap-up report',
    project: 'Q3 Launch',
    status: 'Done',
    priority: 'High',
    labels: ['Docs'],
    assignee: 'Rhea Kapoor',
    due: 'Jun 25',
    description:
      'What we learned from the eight-week beta: top requests, the bugs we fixed, and the three things we deliberately deferred.',
    comments: [],
  },
])

const filterTab = ref('Open')
const visibleTasks = computed(() => {
  if (filterTab.value === 'Open') {
    return tasks.filter((t) => !['Done', 'Canceled'].includes(t.status))
  }
  return tasks
})

// List ↔ detail are two "screens" of the same page; a real app would use
// two routes and pass the task id as a param.
const selectedTaskId = ref(null)
const selectedTask = computed(() =>
  tasks.find((t) => t.id === selectedTaskId.value),
)

function statusDropdownOptions(task) {
  return statuses.map((status) => ({
    label: status,
    icon: statusIcon[status],
    onClick: () => (task.status = status),
  }))
}

const newComment = ref('')
function addComment() {
  if (!newComment.value.trim()) return
  selectedTask.value.comments.push({
    author: me,
    time: 'Just now',
    text: newComment.value.trim(),
  })
  newComment.value = ''
}
</script>

<template>
  <MobileShell>
    <!-- Screen 1: task list -->
    <template v-if="!selectedTask">
      <PageHeaderMobile title="My tasks">
        <template #right>
          <Button variant="ghost" icon="lucide-plus" label="New task" />
        </template>
      </PageHeaderMobile>

      <div class="pb-6 pt-3">
        <div class="mb-3 px-4">
          <TabButtons
            v-model="filterTab"
            class="w-full"
            :options="[{ label: 'Open' }, { label: 'All' }]"
          />
        </div>

        <List class="list-gap-3 list-row-px-4">
          <ListRow
            v-for="task in visibleTasks"
            :key="task.id"
            class="py-2.5"
            @click="selectedTaskId = task.id"
          >
            <ListCell>
              <span
                :class="statusIcon[task.status]"
                class="size-4.5 text-ink-gray-6"
                :aria-label="task.status"
              />
            </ListCell>
            <ListCell>
              <div class="min-w-0 flex-1">
                <!-- The sized text lives in an inner span so it keeps its own
                     line-height. Putting `leading-none` on the same element as
                     `truncate` (overflow-hidden) would shear off descenders
                     like the tail of "g". -->
                <div
                  class="truncate leading-snug"
                  :class="
                    task.status === 'Done'
                      ? 'text-ink-gray-5'
                      : 'text-ink-gray-8'
                  "
                >
                  <span class="text-lg">{{ task.title }}</span>
                </div>
                <!-- Meta row mirrors the desktop columns: severity-colored
                     priority icon, a label tag, and the due date. -->
                <div
                  class="mt-1.5 flex min-w-0 items-center gap-2 text-md text-ink-gray-5"
                >
                  <span class="flex shrink-0 items-center">
                    <span
                      class="mr-1 size-4 shrink-0"
                      :class="[
                        priorityIcon[task.priority],
                        priorityColor[task.priority],
                      ]"
                      aria-hidden="true"
                    />
                    {{ task.priority }}
                  </span>
                  <Badge
                    v-if="task.labels.length"
                    variant="outline"
                    theme="gray"
                    class="shrink-0"
                    :label="task.labels[0]"
                  >
                    <template #prefix>
                      <span
                        class="size-1.5 rounded-full"
                        :class="labelDotClass(task.labels[0])"
                        aria-hidden="true"
                      />
                    </template>
                  </Badge>
                  <span v-if="task.due" class="truncate whitespace-nowrap">
                    {{ task.due }}
                  </span>
                </div>
              </div>
            </ListCell>
            <ListCell class="justify-end">
              <Avatar
                :image="imageOf(task.assignee)"
                :label="task.assignee"
                size="sm"
              />
            </ListCell>
          </ListRow>
        </List>
      </div>
    </template>

    <!-- Screen 2: task detail -->
    <template v-else>
      <PageHeaderMobile :title="`#${selectedTask.id}`">
        <template #left>
          <Button
            variant="ghost"
            icon="lucide-chevron-left"
            label="Back to tasks"
            @click="selectedTaskId = null"
          />
        </template>
      </PageHeaderMobile>

      <div class="px-4 pb-6 pt-4">
        <h1 class="text-xl-semibold text-ink-gray-8">
          {{ selectedTask.title }}
        </h1>
        <p class="mt-2 text-p-base text-ink-gray-7">
          {{ selectedTask.description }}
        </p>

        <!-- Meta chips: Gameplan's mobile task detail lays the same controls
             out as a wrapping row instead of a side panel. -->
        <div class="mt-6 flex flex-wrap items-center gap-2">
          <Dropdown :options="statusDropdownOptions(selectedTask)">
            <Button>
              <template #prefix>
                <span
                  :class="statusIcon[selectedTask.status]"
                  class="size-4 text-ink-gray-6"
                  aria-hidden="true"
                />
              </template>
              {{ selectedTask.status }}
            </Button>
          </Dropdown>
          <Button>
            <template #prefix>
              <span
                class="size-4"
                :class="[
                  priorityIcon[selectedTask.priority],
                  priorityColor[selectedTask.priority],
                ]"
                aria-hidden="true"
              />
            </template>
            {{ selectedTask.priority }}
          </Button>
          <Button v-if="selectedTask.due" icon-left="lucide-calendar">
            {{ selectedTask.due }}
          </Button>
          <Button :icon-left="projectIcon[selectedTask.project]">
            {{ selectedTask.project }}
          </Button>
          <Button>
            <template #prefix>
              <Avatar
                :image="imageOf(selectedTask.assignee)"
                :label="selectedTask.assignee"
                size="xs"
              />
            </template>
            {{ selectedTask.assignee }}
          </Button>
          <Badge
            v-for="label in selectedTask.labels"
            :key="label"
            variant="outline"
            theme="gray"
            size="lg"
            :label="label"
          >
            <template #prefix>
              <span
                class="size-1.5 rounded-full"
                :class="labelDotClass(label)"
                aria-hidden="true"
              />
            </template>
          </Badge>
        </div>

        <div class="mt-8 border-t pt-5">
          <h2 class="text-base-semibold text-ink-gray-8">
            Comments
            <span
              v-if="selectedTask.comments.length"
              class="ml-1 font-normal text-ink-gray-5"
            >
              {{ selectedTask.comments.length }}
            </span>
          </h2>

          <div class="mt-5 space-y-5">
            <div
              v-for="(comment, i) in selectedTask.comments"
              :key="i"
              class="flex gap-3"
            >
              <Avatar
                :image="imageOf(comment.author)"
                :label="comment.author"
                size="lg"
              />
              <div class="min-w-0 flex-1">
                <div class="flex items-baseline gap-2">
                  <span class="text-base-medium text-ink-gray-8">
                    {{ comment.author }}
                  </span>
                  <span class="text-sm text-ink-gray-5">
                    {{ comment.time }}
                  </span>
                </div>
                <p class="mt-1 text-p-base text-ink-gray-7">
                  {{ comment.text }}
                </p>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <Textarea
              v-model="newComment"
              placeholder="Add a comment"
              class="w-full"
            />
            <div class="mt-2 flex justify-end">
              <Button
                variant="solid"
                label="Comment"
                :disabled="!newComment.trim()"
                @click="addComment"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #nav>
      <MobileNav>
        <MobileNavItem
          label="Inbox"
          icon="lucide-inbox"
          :active="tab === 'inbox'"
          @click="tab = 'inbox'"
        />
        <MobileNavItem
          label="Tasks"
          icon="lucide-list-todo"
          :active="tab === 'tasks'"
          @click="tab = 'tasks'"
        />
        <MobileNavItem
          label="Projects"
          icon="lucide-folder-kanban"
          :active="tab === 'projects'"
          @click="tab = 'projects'"
        />
        <MobileNavItem label="You" :active="tab === 'you'" @click="tab = 'you'">
          <template #default="{ active }">
            <Avatar
              image="https://i.pravatar.cc/150?img=1"
              label="Rhea Kapoor"
              size="md"
              :class="active ? 'ring-2 ring-outline-gray-4' : ''"
            />
          </template>
        </MobileNavItem>
      </MobileNav>
    </template>
  </MobileShell>
</template>
