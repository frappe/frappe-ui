<script setup>
import { computed, reactive, ref } from 'vue'
import {
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Combobox,
  DatePicker,
  dayjs,
  DesktopShell,
  Divider,
  Dropdown,
  MultiSelect,
  PageHeader,
  ScrollArea,
  Select,
  Sidebar,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  TabButtons,
  Textarea,
  Tooltip,
} from 'frappe-ui'
import { List, ListCell, ListRow } from 'frappe-ui/list'

const statuses = ['Backlog', 'Todo', 'In Progress', 'Done', 'Canceled']
const statusIcon = {
  Backlog: 'lucide-circle-dashed',
  Todo: 'lucide-circle',
  'In Progress': 'lucide-circle-dot',
  Done: 'lucide-circle-check',
  Canceled: 'lucide-circle-x',
}
const priorities = ['High', 'Medium', 'Low']
// Linear-style signal icons: more bars = higher priority. The bar count already
// encodes severity; color reinforces it — hot for High, warm for Medium, muted
// for Low so low-priority rows recede.
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
const priorityRank = { High: 0, Medium: 1, Low: 2 }

// Linear-style labels. The theme only tints the badge — the label text
// carries the meaning, so the palette can stay small.
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
// Labels render as neutral gray-outline badges so the column stays quiet; the
// only color is a small dot that keeps each label recognizable at a glance.
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

const projects = [
  { name: 'Website Redesign', icon: 'lucide-globe' },
  { name: 'Mobile App', icon: 'lucide-smartphone' },
  { name: 'Design System', icon: 'lucide-shapes' },
  { name: 'Q3 Launch', icon: 'lucide-rocket' },
]

const tasks = reactive([
  // Website Redesign
  {
    id: 245,
    title: 'Fix layout shift on the pricing page',
    project: 'Website Redesign',
    status: 'In Progress',
    priority: 'High',
    labels: ['Bug', 'Frontend'],
    assignees: ['Priya Nair'],
    owner: 'Rhea Kapoor',
    due: '2026-07-06',
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
    assignees: ['Rhea Kapoor', 'Evan You'],
    owner: 'Evan You',
    due: '2026-07-06',
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
    id: 228,
    title: 'Migrate marketing pages to the new CMS',
    project: 'Website Redesign',
    status: 'In Progress',
    priority: 'Medium',
    labels: ['Feature', 'Backend'],
    assignees: ['Priya Nair'],
    owner: 'Rhea Kapoor',
    due: '2026-07-08',
    description:
      'Move the pricing, about, and careers pages off the legacy templates. Content is already exported — wire up the new layouts and set redirects for the old URLs.',
    comments: [],
  },
  {
    id: 242,
    title: 'Rebuild the top navigation as a sticky header',
    project: 'Website Redesign',
    status: 'Todo',
    priority: 'Medium',
    labels: ['Feature', 'Frontend'],
    assignees: ['Sam Rivera'],
    owner: 'Rhea Kapoor',
    due: '2026-07-11',
    description:
      'The nav should stay pinned on scroll and collapse into a compact bar past the fold. Keep the mega-menu behavior on desktop and the drawer on mobile.',
    comments: [],
  },
  {
    id: 238,
    title: 'Add dark mode to the marketing site',
    project: 'Website Redesign',
    status: 'Todo',
    priority: 'High',
    labels: ['Feature', 'Design'],
    assignees: ['Evan You'],
    owner: 'Ana Costa',
    due: '2026-07-14',
    description:
      'Respect the OS preference by default and add a manual toggle in the footer. Audit the illustrations for both themes before shipping.',
    comments: [],
  },
  {
    id: 221,
    title: 'Consolidate duplicate utility classes',
    project: 'Website Redesign',
    status: 'Backlog',
    priority: 'Low',
    labels: ['Chore', 'Frontend'],
    assignees: ['Maya Iyer'],
    owner: 'Sam Rivera',
    due: '',
    description:
      'The stylesheet has grown three near-identical spacing helpers. Collapse them to the token scale and delete the dead rules.',
    comments: [],
  },
  {
    id: 216,
    title: 'Set up analytics events for the signup funnel',
    project: 'Website Redesign',
    status: 'Backlog',
    priority: 'Medium',
    labels: ['Backend'],
    assignees: ['Sam Rivera'],
    owner: 'Rhea Kapoor',
    due: '',
    description:
      'Instrument each step of the signup funnel so we can see where people drop off. Match the event names to the existing dashboard schema.',
    comments: [],
  },
  {
    id: 199,
    title: 'Launch the redesigned homepage',
    project: 'Website Redesign',
    status: 'Done',
    priority: 'High',
    labels: ['Feature'],
    assignees: ['Rhea Kapoor'],
    owner: 'Rhea Kapoor',
    due: '2026-06-28',
    description:
      'Final cutover from the old homepage. Redirects verified, Lighthouse scores green, and the old template archived.',
    comments: [],
  },
  {
    id: 203,
    title: 'Prototype animated page transitions',
    project: 'Website Redesign',
    status: 'Canceled',
    priority: 'Low',
    labels: ['Research'],
    assignees: ['Evan You'],
    owner: 'Evan You',
    due: '',
    description:
      'Dropped in favor of shipping the redesign sooner — revisit after launch.',
    comments: [],
  },

  // Mobile App
  {
    id: 244,
    title: 'Fix push notifications not arriving on iOS 17',
    project: 'Mobile App',
    status: 'In Progress',
    priority: 'High',
    labels: ['Bug', 'Backend'],
    assignees: ['Sam Rivera'],
    owner: 'Rhea Kapoor',
    due: '2026-07-07',
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
    id: 241,
    title: 'Add biometric login',
    project: 'Mobile App',
    status: 'In Progress',
    priority: 'Medium',
    labels: ['Feature'],
    assignees: ['Evan You'],
    owner: 'Priya Nair',
    due: '2026-07-09',
    description:
      'Let people unlock the app with Face ID / fingerprint after the first password login. Fall back to the passcode when biometrics fail twice.',
    comments: [],
  },
  {
    id: 235,
    title: 'Review the onboarding flow prototype',
    project: 'Mobile App',
    status: 'Todo',
    priority: 'High',
    labels: ['Design'],
    assignees: ['Rhea Kapoor'],
    owner: 'Ana Costa',
    due: '2026-07-07',
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
    assignees: ['Priya Nair'],
    owner: 'Rhea Kapoor',
    due: '2026-07-13',
    description:
      'Cache the task list locally and queue edits made while offline, then reconcile on reconnect. Show a clear indicator when changes are pending sync.',
    comments: [],
  },
  {
    id: 233,
    title: 'Set up crash reporting for the beta build',
    project: 'Mobile App',
    status: 'Todo',
    priority: 'Medium',
    labels: ['Improvement'],
    assignees: ['Sam Rivera'],
    owner: 'Rhea Kapoor',
    due: '2026-07-10',
    description:
      'Beta testers are reporting crashes we cannot reproduce. Add a crash reporter to the beta build and symbolicate stack traces in CI so reports arrive readable.',
    comments: [],
  },
  {
    id: 230,
    title: 'Reduce app cold-start time',
    project: 'Mobile App',
    status: 'Backlog',
    priority: 'Medium',
    labels: ['Improvement'],
    assignees: ['Sam Rivera'],
    owner: 'Rhea Kapoor',
    due: '',
    description:
      'Cold start is over two seconds on mid-range Android devices. Profile the launch path and defer anything that is not needed for the first screen.',
    comments: [],
  },
  {
    id: 224,
    title: 'Localize the app into Spanish and German',
    project: 'Mobile App',
    status: 'Backlog',
    priority: 'Low',
    labels: ['Feature'],
    assignees: ['Ana Costa'],
    owner: 'Maya Iyer',
    due: '',
    description:
      'Extract the remaining hardcoded strings, wire up the translation files, and check the layouts for text that overflows once translated.',
    comments: [],
  },
  {
    id: 210,
    title: 'Ship the redesigned tab bar',
    project: 'Mobile App',
    status: 'Done',
    priority: 'High',
    labels: ['Design'],
    assignees: ['Maya Iyer'],
    owner: 'Rhea Kapoor',
    due: '2026-06-30',
    description:
      'New five-tab layout with the create action promoted to the center. Rolled out to 100% after a clean week on the beta channel.',
    comments: [],
  },

  // Design System
  {
    id: 236,
    title: 'Migrate components to design tokens',
    project: 'Design System',
    status: 'In Progress',
    priority: 'High',
    labels: ['Improvement', 'Frontend'],
    assignees: ['Maya Iyer'],
    owner: 'Rhea Kapoor',
    due: '2026-07-08',
    description:
      'Replace the remaining hardcoded colors and spacing with semantic tokens so theming works in one place. Start with the form controls.',
    comments: [],
  },
  {
    id: 229,
    title: 'Document the Button component API',
    project: 'Design System',
    status: 'Todo',
    priority: 'Medium',
    labels: ['Docs'],
    assignees: ['Priya Nair'],
    owner: 'Rhea Kapoor',
    due: '2026-07-12',
    description:
      'Write the props table, list every variant and size, and add copy-paste examples for the common cases. Link it from the component page.',
    comments: [],
  },
  {
    id: 222,
    title: 'Add a DatePicker component',
    project: 'Design System',
    status: 'Todo',
    priority: 'High',
    labels: ['Feature', 'Frontend'],
    assignees: ['Evan You'],
    owner: 'Maya Iyer',
    due: '2026-07-16',
    description:
      'A keyboard-accessible date picker with range support and a text input fallback. Match the existing popover and token conventions.',
    comments: [],
  },
  {
    id: 219,
    title: 'Explore a two-tone illustration style',
    project: 'Design System',
    status: 'Backlog',
    priority: 'Low',
    labels: ['Design', 'Research'],
    assignees: ['Maya Iyer'],
    owner: 'Priya Nair',
    due: '',
    description:
      'A lighter, more geometric direction that scales down cleanly to 16px marks. Timebox to a week of exploration.',
    comments: [],
  },
  {
    id: 214,
    title: 'Audit spacing token usage across marketing pages',
    project: 'Design System',
    status: 'Backlog',
    priority: 'Medium',
    labels: ['Chore'],
    assignees: [],
    owner: 'Sam Rivera',
    due: '',
    description:
      'Marketing pages have drifted from the spacing scale. List the offending pages and the one-off values they use.',
    comments: [],
  },
  {
    id: 212,
    title: 'Audit color contrast for accessibility',
    project: 'Design System',
    status: 'Backlog',
    priority: 'Low',
    labels: ['Research', 'Design'],
    assignees: ['Ana Costa'],
    owner: 'Priya Nair',
    due: '',
    description:
      'Check text and interactive colors against WCAG AA in both themes. Flag the tokens that fail and propose adjusted values.',
    comments: [],
  },
  {
    id: 208,
    title: 'Ship empty-state illustrations',
    project: 'Design System',
    status: 'Done',
    priority: 'High',
    labels: ['Design'],
    assignees: ['Rhea Kapoor'],
    owner: 'Rhea Kapoor',
    due: '2026-07-01',
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
    id: 205,
    title: 'Publish the icon library v2',
    project: 'Design System',
    status: 'Done',
    priority: 'Medium',
    labels: ['Design'],
    assignees: ['Maya Iyer'],
    owner: 'Rhea Kapoor',
    due: '2026-06-27',
    description:
      'Redrawn on a consistent 24px grid with a lighter stroke. Published to the package and the Figma library in sync.',
    comments: [],
  },

  // Q3 Launch
  {
    id: 243,
    title: 'Finalize pricing and packaging',
    project: 'Q3 Launch',
    status: 'In Progress',
    priority: 'High',
    labels: ['Research'],
    assignees: ['Rhea Kapoor'],
    owner: 'Rhea Kapoor',
    due: '2026-07-06',
    description:
      'Lock the three tiers and what goes in each. Pull the willingness-to-pay numbers from the last survey and get sign-off from sales.',
    comments: [],
  },
  {
    id: 240,
    title: 'Prepare QA checklist for the release candidate',
    project: 'Q3 Launch',
    status: 'In Progress',
    priority: 'High',
    labels: ['Chore'],
    assignees: ['Ana Costa'],
    owner: 'Rhea Kapoor',
    due: '2026-07-05',
    description:
      'Collect the regression scenarios from the last two releases into a single checklist, ordered by risk. Everything above the line must pass before we cut the release candidate.',
    comments: [],
  },
  {
    id: 239,
    title: 'Prepare the press kit',
    project: 'Q3 Launch',
    status: 'Todo',
    priority: 'High',
    labels: ['Docs', 'Design'],
    assignees: ['Ana Costa'],
    owner: 'Rhea Kapoor',
    due: '2026-07-10',
    description:
      'Assemble the fact sheet, founder bios, logo pack, and three product screenshots into a single downloadable kit for press.',
    comments: [],
  },
  {
    id: 234,
    title: 'Set up the launch landing page',
    project: 'Q3 Launch',
    status: 'Todo',
    priority: 'Medium',
    labels: ['Feature', 'Frontend'],
    assignees: ['Priya Nair'],
    owner: 'Rhea Kapoor',
    due: '2026-07-13',
    description:
      'A single page with the announcement, a demo video, and an email capture. Wire the form to the marketing list and add the launch-day banner.',
    comments: [],
  },
  {
    id: 226,
    title: 'Draft the launch announcement email',
    project: 'Q3 Launch',
    status: 'Todo',
    priority: 'Low',
    labels: ['Docs'],
    assignees: ['Rhea Kapoor'],
    owner: 'Rhea Kapoor',
    due: '2026-07-15',
    description:
      'First draft of the announcement for the existing-customer list: what changed, what it costs, and one clear call to action. Marketing reviews it on the 16th.',
    comments: [],
  },
  {
    id: 227,
    title: 'Draft the launch-day runbook',
    project: 'Q3 Launch',
    status: 'Backlog',
    priority: 'Medium',
    labels: ['Docs', 'Chore'],
    assignees: ['Sam Rivera'],
    owner: 'Rhea Kapoor',
    due: '',
    description:
      'Step-by-step timeline for launch day: who flips which switch, in what order, and the rollback plan if something goes sideways.',
    comments: [],
  },
  {
    id: 218,
    title: 'Line up customer testimonials',
    project: 'Q3 Launch',
    status: 'Backlog',
    priority: 'Low',
    labels: ['Research'],
    assignees: ['Ana Costa'],
    owner: 'Ana Costa',
    due: '',
    description:
      'Reach out to five beta customers for a short quote and a logo release. Two confirmed so far.',
    comments: [],
  },
  {
    id: 201,
    title: 'Beta program wrap-up report',
    project: 'Q3 Launch',
    status: 'Done',
    priority: 'High',
    labels: ['Docs'],
    assignees: ['Rhea Kapoor'],
    owner: 'Rhea Kapoor',
    due: '2026-06-25',
    description:
      'What we learned from the eight-week beta: top requests, the bugs we fixed, and the three things we deliberately deferred.',
    comments: [],
  },
])

// The sidebar switches between the "My tasks" view and one project's tasks.
// It opens on a project so the single-project layout (no project column) is
// what you see first.
const MY_TASKS = 'My tasks'
const activeView = ref('Website Redesign')
function openView(view) {
  activeView.value = view
  selectedTaskId.value = null
}

const openCount = (project) =>
  tasks.filter(
    (t) => t.project === project && !['Done', 'Canceled'].includes(t.status),
  ).length

// Filter bar state. `listTab` scopes to me; the rest are optional attribute
// filters that stack on top ('' means "no filter").
const listTab = ref('All')
const filters = reactive({
  status: '',
  priority: '',
  assignee: '',
  label: '',
})
const activeFilterCount = computed(
  () => ['status', 'priority', 'assignee', 'label'].filter((k) => filters[k]).length,
)
function clearFilters() {
  filters.status = filters.priority = filters.assignee = filters.label = ''
}

const labels = [...new Set(tasks.flatMap((t) => t.labels))].sort()
// First option doubles as the reset: its value is '' and its label reads like
// the field name, so the trigger shows "Priority" until you pick a value.
const statusFilterOptions = [
  { label: 'Status', value: '' },
  ...statuses.map((s) => ({ label: s, value: s })),
]
const priorityFilterOptions = [
  { label: 'Priority', value: '' },
  ...priorities.map((p) => ({ label: p, value: p })),
]
const assigneeFilterOptions = [
  { label: 'Assignee', value: '' },
  ...people.map((p) => ({ label: p.name, value: p.name })),
]
const labelFilterOptions = [
  { label: 'Label', value: '' },
  ...labels.map((l) => ({ label: l, value: l })),
]

const sortBy = ref('priority')
const sortLabels = { priority: 'Priority', due: 'Due date', title: 'Title' }
const sortLabel = computed(() => sortLabels[sortBy.value])
const sortDropdownOptions = Object.entries(sortLabels).map(([value, label]) => ({
  label,
  onClick: () => (sortBy.value = value),
}))

const visibleTasks = computed(() => {
  let scoped =
    activeView.value === MY_TASKS
      ? tasks.filter((t) => t.assignees.includes(me) || t.owner === me)
      : tasks.filter((t) => t.project === activeView.value)
  if (listTab.value === 'Assigned to me') {
    scoped = scoped.filter((t) => t.assignees.includes(me))
  } else if (listTab.value === 'Created by me') {
    scoped = scoped.filter((t) => t.owner === me)
  }
  if (filters.status) scoped = scoped.filter((t) => t.status === filters.status)
  if (filters.priority)
    scoped = scoped.filter((t) => t.priority === filters.priority)
  if (filters.assignee)
    scoped = scoped.filter((t) => t.assignees.includes(filters.assignee))
  if (filters.label)
    scoped = scoped.filter((t) => t.labels.includes(filters.label))
  return scoped
})

function sortTasks(list) {
  const arr = [...list]
  if (sortBy.value === 'priority') {
    arr.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority])
  } else if (sortBy.value === 'due') {
    // Undated tasks sort last.
    arr.sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999'))
  } else if (sortBy.value === 'title') {
    arr.sort((a, b) => a.title.localeCompare(b.title))
  }
  return arr
}

// Which attribute the list is grouped by. Each field defines its own section
// order and how a task maps to a section key; a task lands in one section
// (its primary assignee / first label) so counts stay honest.
const groupBy = ref('status')
const groupByLabels = {
  status: 'Status',
  priority: 'Priority',
  assignee: 'Assignee',
  project: 'Project',
  label: 'Label',
}
const groupByLabel = computed(() => groupByLabels[groupBy.value])
const groupByDropdownOptions = Object.entries(groupByLabels).map(
  ([value, label]) => ({ label, onClick: () => (groupBy.value = value) }),
)

function groupOrder(field) {
  if (field === 'priority') return priorities
  if (field === 'project') return projects.map((p) => p.name)
  if (field === 'assignee') return [...people.map((p) => p.name), 'No assignee']
  if (field === 'label') return [...labels, 'No label']
  return ['In Progress', 'Todo', 'Backlog', 'Done', 'Canceled']
}
function groupKeyOf(task, field) {
  if (field === 'priority') return task.priority
  if (field === 'project') return task.project
  if (field === 'assignee') return task.assignees[0] || 'No assignee'
  if (field === 'label') return task.labels[0] || 'No label'
  return task.status
}

// Sections are open by default; only finished status columns start collapsed.
// `openState` records explicit user toggles and overrides that default.
const openState = reactive({})
function defaultOpen(key) {
  return !(groupBy.value === 'status' && ['Done', 'Canceled'].includes(key))
}
function groupOpen(key) {
  return key in openState ? openState[key] : defaultOpen(key)
}
function toggleGroup(key) {
  openState[key] = !groupOpen(key)
}

const groupedTasks = computed(() => {
  const field = groupBy.value
  return groupOrder(field)
    .map((key) => ({
      key,
      tasks: sortTasks(
        visibleTasks.value.filter((t) => groupKeyOf(t, field) === key),
      ),
    }))
    .filter((group) => group.tasks.length)
})

// List ↔ detail are two "screens" of the same page; a real app would use
// two routes and pass the task id as a param.
const selectedTaskId = ref(null)
const selectedTask = computed(() =>
  tasks.find((t) => t.id === selectedTaskId.value),
)

const statusSelectOptions = statuses.map((s) => ({ label: s, value: s }))
const prioritySelectOptions = priorities.map((p) => ({ label: p, value: p }))
const assigneeOptions = people.map((p) => ({
  label: p.name,
  value: p.name,
}))
// Combobox picks up `icon` for both the option rows and the button trigger.
const projectOptions = projects.map((p) => ({
  label: p.name,
  value: p.name,
  icon: p.icon,
}))

// Tasks store due dates as YYYY-MM-DD (what DatePicker's v-model speaks);
// the list renders them in the short display form.
const formatDue = (due) => (due ? dayjs(due).format('MMM D') : '')

// What the tags column shows, kept within a badge budget so nothing clips
// mid-word: the "My tasks" view spends one slot on the project (the useful
// cross-project context) and one on a label; a project view shows two labels.
// Anything past the budget collapses into a "+N" chip.
function taskTags(task) {
  const inMyTasks = activeView.value === MY_TASKS
  const labelBudget = inMyTasks ? 1 : 2
  const shown = task.labels.slice(0, labelBudget)
  return {
    project: inMyTasks ? task.project : null,
    labels: shown,
    extra: task.labels.length - shown.length,
  }
}

// Linear-style single-row grid. Every trailing track is a *fixed* width so the
// title track (`minmax(0, 1fr)`) is the sole flexible one — it alone absorbs
// size differences (e.g. a row with two avatars) and every other column, id
// and tags included, lands at the same x on every row.
const taskColumns = [
  'auto', // status icon
  '2.5rem', // id
  'minmax(0, 1fr)', // title
  '14rem', // tags (labels, plus the project in "My tasks")
  '6.5rem', // due date
  '5.5rem', // priority
  '3.5rem', // assignees (fits a 2-avatar stack, right-aligned)
]

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
  <div class="h-screen w-full bg-surface-base text-ink-gray-9">
    <DesktopShell>
      <template #sidebar>
        <Sidebar width="14rem" class="border-r">
          <SidebarHeader
            title="Halcyon Studio"
            subtitle="Workspace"
            logo="https://api.dicebear.com/10.x/disco/svg?seed=Halcyon"
            :menu-items="[
              { label: 'Invite members', icon: 'lucide-user-plus' },
              { label: 'Workspace settings', icon: 'lucide-settings-2' },
              { label: 'Log out', icon: 'lucide-log-out' },
            ]"
          />

          <ScrollArea class="min-h-0 flex-1" viewport-class="px-2 pt-0.5 pb-10">
            <nav class="space-y-0.5">
              <SidebarItem>
                <template #prefix>
                  <span class="lucide-inbox size-4" aria-hidden="true" />
                </template>
                <span class="flex-1 truncate text-sm">Inbox</span>
                <template #suffix>
                  <span class="mr-1 text-xs text-ink-gray-5">4</span>
                </template>
              </SidebarItem>
              <SidebarItem
                :active="activeView === MY_TASKS"
                @click="openView(MY_TASKS)"
              >
                <template #prefix>
                  <span class="lucide-list-todo size-4" aria-hidden="true" />
                </template>
                <span class="flex-1 truncate text-sm">My tasks</span>
              </SidebarItem>
              <SidebarItem>
                <template #prefix>
                  <span class="lucide-search size-4" aria-hidden="true" />
                </template>
                <span class="flex-1 truncate text-sm">Search</span>
              </SidebarItem>
            </nav>

            <div class="mt-4 flex h-7 items-center justify-between">
              <SidebarLabel>Projects</SidebarLabel>
              <Button
                variant="ghost"
                size="sm"
                icon="lucide-plus text-ink-gray-5"
                label="New project"
              />
            </div>
            <nav class="mt-0.5 space-y-0.5">
              <SidebarItem
                v-for="project in projects"
                :key="project.name"
                :active="activeView === project.name"
                @click="openView(project.name)"
              >
                <template #prefix>
                  <span
                    :class="project.icon"
                    class="size-4"
                    aria-hidden="true"
                  />
                </template>
                <span class="flex-1 truncate text-sm">{{ project.name }}</span>
                <template #suffix>
                  <Badge
                    v-if="openCount(project.name)"
                    variant="ghost"
                    :label="String(openCount(project.name))"
                  />
                </template>
              </SidebarItem>
            </nav>
          </ScrollArea>
        </Sidebar>
      </template>

      <!-- Screen 1: task list -->
      <template v-if="!selectedTask">
        <PageHeader>
          <Breadcrumbs :items="[{ label: activeView }]" />
          <div class="flex items-center gap-2">
            <Button variant="solid" label="Add task" icon-left="lucide-plus" />
          </div>
        </PageHeader>

        <div class="w-full px-3 pb-10 sm:px-6">
          <!-- Filter bar: scope tabs, stackable attribute filters, and sort. -->
          <div class="flex flex-wrap items-center gap-2 pt-5">
            <TabButtons
              v-model="listTab"
              :options="[
                { label: 'All' },
                { label: 'Assigned to me' },
                { label: 'Created by me' },
              ]"
            />

            <Divider orientation="vertical" class="mx-1" flex-item />

            <Select
              v-model="filters.status"
              variant="ghost"
              :options="statusFilterOptions"
            >
              <template #item-prefix="{ item }">
                <span
                  v-if="item.value"
                  :class="statusIcon[item.value]"
                  class="size-4 text-ink-gray-6"
                  aria-hidden="true"
                />
              </template>
            </Select>

            <Select
              v-model="filters.priority"
              variant="ghost"
              :options="priorityFilterOptions"
            >
              <template #item-prefix="{ item }">
                <span
                  v-if="item.value"
                  class="size-4"
                  :class="[priorityIcon[item.value], priorityColor[item.value]]"
                  aria-hidden="true"
                />
              </template>
            </Select>

            <Select
              v-model="filters.assignee"
              variant="ghost"
              :options="assigneeFilterOptions"
            >
              <template #item-prefix="{ item }">
                <Avatar
                  v-if="item.value"
                  :image="imageOf(item.value)"
                  :label="item.label"
                  size="xs"
                />
              </template>
            </Select>

            <Select
              v-model="filters.label"
              variant="ghost"
              :options="labelFilterOptions"
            >
              <template #item-prefix="{ item }">
                <span
                  v-if="item.value"
                  class="size-2 rounded-full"
                  :class="labelDotClass(item.value)"
                  aria-hidden="true"
                />
              </template>
            </Select>

            <Button
              v-if="activeFilterCount"
              variant="ghost"
              label="Clear"
              icon-left="lucide-x"
              @click="clearFilters"
            />

            <div class="ml-auto flex items-center gap-2">
              <span class="text-sm text-ink-gray-5">
                {{ visibleTasks.length }} tasks
              </span>
              <Dropdown :options="groupByDropdownOptions" placement="right">
                <Button variant="ghost" icon-left="lucide-layers">
                  Group: {{ groupByLabel }}
                </Button>
              </Dropdown>
              <Dropdown :options="sortDropdownOptions" placement="right">
                <Button variant="ghost" icon-left="lucide-arrow-up-down">
                  {{ sortLabel }}
                </Button>
              </Dropdown>
            </div>
          </div>

          <div class="mt-4 space-y-4">
            <div v-for="group in groupedTasks" :key="group.key">
              <button
                class="group flex w-full items-baseline rounded-sm bg-surface-sidebar px-2.5 py-2 text-base transition hover:bg-surface-gray-2"
                @click="toggleGroup(group.key)"
              >
                <span class="font-medium text-ink-gray-8">
                  {{ group.key }}
                </span>
                <span class="ml-2 text-sm text-ink-gray-5">
                  {{ group.tasks.length }}
                </span>
                <span
                  class="ml-auto hidden text-sm text-ink-gray-5 group-hover:inline"
                >
                  {{ groupOpen(group.key) ? 'Collapse' : 'Expand' }}
                </span>
              </button>

              <List
                v-if="groupOpen(group.key)"
                class="mt-1"
                :columns="taskColumns"
              >
                <ListRow
                  v-for="task in group.tasks"
                  :key="task.id"
                  class="h-10"
                  @click="selectedTaskId = task.id"
                >
                  <ListCell>
                    <!-- Changing status shouldn't open the task: stop the
                         click before it reaches the row. -->
                    <span @click.stop>
                      <Tooltip text="Change status">
                        <Dropdown :options="statusDropdownOptions(task)">
                          <button
                            class="flex rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-outline-gray-3"
                          >
                            <span
                              :class="statusIcon[task.status]"
                              class="size-4 text-ink-gray-6"
                              :aria-label="task.status"
                            />
                          </button>
                        </Dropdown>
                      </Tooltip>
                    </span>
                  </ListCell>
                  <ListCell>
                    <span class="text-sm tabular-nums text-ink-gray-4">
                      {{ task.id }}
                    </span>
                  </ListCell>
                  <ListCell>
                    <span class="truncate text-base-medium text-ink-gray-8">
                      {{ task.title }}
                    </span>
                  </ListCell>
                  <ListCell class="gap-1.5 overflow-hidden">
                    <!-- The project is implied inside a project view; label it
                         only in the cross-project "My tasks" list. -->
                    <Badge
                      v-if="taskTags(task).project"
                      variant="outline"
                      theme="gray"
                      class="shrink-0"
                      :label="taskTags(task).project"
                    />
                    <Badge
                      v-for="label in taskTags(task).labels"
                      :key="label"
                      variant="outline"
                      theme="gray"
                      class="shrink-0"
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
                    <span
                      v-if="taskTags(task).extra"
                      class="shrink-0 text-xs text-ink-gray-4"
                    >
                      +{{ taskTags(task).extra }}
                    </span>
                  </ListCell>
                  <ListCell>
                    <span
                      v-if="task.due"
                      class="flex items-center whitespace-nowrap text-sm text-ink-gray-5"
                    >
                      <span
                        class="lucide-calendar mr-1.5 size-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      {{ formatDue(task.due) }}
                    </span>
                  </ListCell>
                  <ListCell>
                    <span
                      class="flex items-center whitespace-nowrap text-sm text-ink-gray-5"
                    >
                      <span
                        class="mr-1 size-4 shrink-0"
                        :class="[priorityIcon[task.priority], priorityColor[task.priority]]"
                        aria-hidden="true"
                      />
                      {{ task.priority }}
                    </span>
                  </ListCell>
                  <ListCell class="justify-end">
                    <Tooltip
                      v-if="task.assignees.length"
                      :text="task.assignees.join(', ')"
                    >
                      <div class="flex -space-x-1">
                        <Avatar
                          v-for="name in task.assignees"
                          :key="name"
                          :image="imageOf(name)"
                          :label="name"
                          size="sm"
                        />
                      </div>
                    </Tooltip>
                  </ListCell>
                </ListRow>
              </List>
            </div>
          </div>
        </div>
      </template>

      <!-- Screen 2: task detail -->
      <template v-else>
        <PageHeader>
          <Breadcrumbs
            :items="[
              { label: activeView, onClick: () => (selectedTaskId = null) },
              { label: selectedTask.title },
            ]"
          />
        </PageHeader>

        <div class="flex h-full flex-1">
          <ScrollArea class="min-h-0 w-full flex-1">
            <div class="p-6">
              <h1 class="text-2xl-semibold text-ink-gray-8">
                {{ selectedTask.title }}
              </h1>
              <p class="mt-3 text-p-base text-ink-gray-7">
                {{ selectedTask.description }}
              </p>

              <div class="mt-10 border-t pt-6">
                <h2 class="text-base-semibold text-ink-gray-8">
                  Comments
                  <span
                    v-if="selectedTask.comments.length"
                    class="ml-1 font-normal text-ink-gray-5"
                  >
                    {{ selectedTask.comments.length }}
                  </span>
                </h2>

                <div class="mt-5 space-y-6">
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

                <div class="mt-6 flex gap-3">
                  <Avatar :image="imageOf(me)" :label="me" size="lg" />
                  <div class="flex-1">
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
            </div>
          </ScrollArea>

          <!-- Meta panel: a two-column grid of label / control pairs. -->
          <div class="hidden w-[20rem] shrink-0 border-l sm:block">
            <div
              class="grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-y-6 p-6 text-base text-ink-gray-6"
            >
              <div>Status</div>
              <Select
                v-model="selectedTask.status"
                :options="statusSelectOptions"
              >
                <template #item-prefix="{ item }">
                  <span
                    :class="statusIcon[item.value]"
                    class="size-4 text-ink-gray-6"
                    aria-hidden="true"
                  />
                </template>
              </Select>

              <div>Assignee</div>
              <MultiSelect
                v-model="selectedTask.assignees"
                :options="assigneeOptions"
                placeholder="Assign users"
              >
                <template #item-prefix="{ item }">
                  <Avatar
                    :image="imageOf(item.value)"
                    :label="item.label"
                    size="xs"
                  />
                </template>
              </MultiSelect>

              <div>Priority</div>
              <Select
                v-model="selectedTask.priority"
                :options="prioritySelectOptions"
              >
                <template #item-prefix="{ item }">
                  <span
                    class="size-4"
                    :class="[priorityIcon[item.value], priorityColor[item.value]]"
                    aria-hidden="true"
                  />
                </template>
              </Select>

              <div>Due date</div>
              <DatePicker
                v-model="selectedTask.due"
                placeholder="Set due date"
                format="MMM D"
              >
                <template #prefix>
                  <span
                    class="lucide-calendar size-4 text-ink-gray-6"
                    aria-hidden="true"
                  />
                </template>
              </DatePicker>

              <div>Project</div>
              <Combobox
                v-model="selectedTask.project"
                trigger="button"
                :options="projectOptions"
                placeholder="Select project"
              />

              <div>Labels</div>
              <div class="flex flex-wrap gap-1.5">
                <Badge
                  v-for="label in selectedTask.labels"
                  :key="label"
                  variant="outline"
                  theme="gray"
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
            </div>
          </div>
        </div>
      </template>
    </DesktopShell>
  </div>
</template>
