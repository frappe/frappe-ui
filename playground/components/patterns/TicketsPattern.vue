<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Avatar, Badge, Rating } from '../../../src'
import { ListView } from '../../../experimental/ListView'
import { faceFor } from './designAssets'
import { espressoListView } from './listViewClasses'
import PriorityIcon from '../icons/PriorityIcon.vue'
import StatusDot from '../icons/StatusDot.vue'

type Status =
  | 'New'
  | 'Replied'
  | 'Resolved'
  | 'Closed'
  | 'In Progress'
  | 'Awaiting approval'
  | 'Awaiting customer'
  | 'Quotation sent'
  | 'Not Started'

type Priority = 'Low' | 'Medium' | 'High'

type Ticket = {
  id: string
  subject: string
  status: Status
  firstDue: string
  resolution: string
  priority: Priority
  type: string
  assignee: string
  team: string
  customer: string
  rating: number
}

// Column widths as the design draws them. ListView owns the checkbox column.
// Avatars and glyphs live in the `#cell` slot, since a cell slot replaces
// ListRowItem and `column.prefix` never renders.
const columns = [
  { label: 'ID', key: 'id', width: '88px' },
  { label: 'Ticket', key: 'subject', width: '316px' },
  // 176, not the design's 120: the dot, its gap and "Awaiting approval"
  // don't fit in 120, and a status that reads "Awaiting app…" says nothing.
  { label: 'Status', key: 'status', width: '176px' },
  { label: 'First due', key: 'firstDue', width: '104px' },
  { label: 'Resolution', key: 'resolution', width: '104px' },
  { label: 'Priority', key: 'priority', width: '104px' },
  { label: 'Type', key: 'type', width: '104px' },
  { label: 'Assignee', key: 'assignee', width: '120px' },
  { label: 'Team', key: 'team', width: '120px' },
  { label: 'Customer', key: 'customer', width: '136px' },
  { label: 'Rating', key: 'rating', width: '168px' },
]

// The theme variable each stage's dot takes its colour from.
const statusToken: Record<Status, string> = {
  New: '--surface-amber-6',
  Replied: '--surface-blue-6',
  Resolved: '--surface-green-6',
  Closed: '--surface-gray-6',
  'In Progress': '--surface-amber-6',
  'Awaiting approval': '--surface-blue-6',
  'Awaiting customer': '--surface-red-6',
  'Quotation sent': '--surface-violet-6',
  'Not Started': '--surface-amber-6',
}

// A due badge is amber while it runs, gray once met, red when missed; a
// resolution badge is violet while it runs.
function dueTheme(value: string) {
  if (value === 'Failed') return 'red'
  if (value === 'Fulfilled' || value === 'Pending') return 'gray'
  return 'amber'
}

function resolutionTheme(value: string) {
  return value === 'Fulfilled' ? 'gray' : 'violet'
}

// `name` mirrors the id on purpose. ListView decides a selected row's corners
// and the rule under it by looking up its neighbours' `name` in the selection
// — `rows[i + 1]?.name` — regardless of `row-key`. Without it every selected
// row reads as a block of one: fully rounded, with a rule between them.
const tickets: Ticket[] = [
  {
    id: '#06070',
    subject: 'Update website content for new products',
    status: 'New',
    firstDue: '22h 30m',
    resolution: '3d 2h',
    priority: 'Medium',
    type: 'Incident',
    assignee: 'Jay',
    team: 'Marketing',
    customer: 'Namma yathri',
    rating: 0,
  },
  {
    id: '#06069',
    subject: 'Prepare presentation for client pitch',
    status: 'Resolved',
    firstDue: 'Fulfilled',
    resolution: 'Fulfilled',
    priority: 'Medium',
    type: 'Incident',
    assignee: 'Sandeep',
    team: 'Creative',
    customer: 'Timeless',
    rating: 5,
  },
  {
    id: '#06065',
    subject: 'Analyze competitors’ marketing strategies',
    status: 'New',
    firstDue: '2h 30m',
    resolution: '3d 2h',
    priority: 'Low',
    type: 'Incident',
    assignee: 'Sandeep',
    team: 'Marketing',
    customer: 'Agency',
    rating: 0,
  },
  {
    id: '#06063',
    subject: 'Create marketing materials for the campaign',
    status: 'New',
    firstDue: '0h 35m',
    resolution: '2d 2h',
    priority: 'High',
    type: 'Incident',
    assignee: 'Jay',
    team: 'Marketing',
    customer: 'CRED',
    rating: 0,
  },
  {
    id: '#06059',
    subject: 'Create marketing materials for the campaign',
    status: 'Resolved',
    firstDue: 'Fulfilled',
    resolution: 'Fulfilled',
    priority: 'Low',
    type: 'Bug',
    assignee: 'Sandeep',
    team: 'Marketing',
    customer: 'TCS',
    rating: 4,
  },
  {
    id: '#06058',
    subject: 'Develop social media strategy for next quarter',
    status: 'Awaiting approval',
    firstDue: 'Failed',
    resolution: '3d 2h',
    priority: 'High',
    type: 'Bug',
    assignee: 'Gowtham',
    team: 'Marketing',
    customer: 'Pentagram',
    rating: 0,
  },
  {
    id: '#06056',
    subject: 'Develop social media strategy for next quarter',
    status: 'Awaiting approval',
    firstDue: 'Failed',
    resolution: '3d 2h',
    priority: 'Medium',
    type: 'Incident',
    assignee: 'Sandeep',
    team: 'Marketing',
    customer: 'Crew',
    rating: 0,
  },
  {
    id: '#06066',
    subject: 'Conduct user feedback sessions for product',
    status: 'Quotation sent',
    firstDue: 'Failed',
    resolution: '3d 2h',
    priority: 'Medium',
    type: 'Incident',
    assignee: 'Jay',
    team: 'Product',
    customer: 'InsightsCorp',
    rating: 0,
  },
  {
    id: '#06055',
    subject: 'Optimise website SEO for better visibility',
    status: 'Resolved',
    firstDue: 'Fulfilled',
    resolution: 'Fulfilled',
    priority: 'Low',
    type: 'Incident',
    assignee: 'Gowtham',
    team: 'Marketing',
    customer: 'WebSolutions',
    rating: 4,
  },
  {
    id: '#06054',
    subject: 'Update website content for new products',
    status: 'Closed',
    firstDue: 'Failed',
    resolution: '3d 2h',
    priority: 'Low',
    type: 'Bug',
    assignee: 'Sandeep',
    team: 'Marketing',
    customer: 'Namma yathri',
    rating: 0,
  },
  {
    id: '#06053',
    subject: 'Prepare presentation for client pitch',
    status: 'Awaiting customer',
    firstDue: 'Fulfilled',
    resolution: 'Fulfilled',
    priority: 'Medium',
    type: 'Bug',
    assignee: 'Gowtham',
    team: 'Creative',
    customer: 'Timeless',
    rating: 0,
  },
  {
    id: '#06052',
    subject: 'Analyze competitors’ marketing strategies',
    status: 'New',
    firstDue: 'Fulfilled',
    resolution: 'Fulfilled',
    priority: 'Medium',
    type: 'Incident',
    assignee: 'Sandeep',
    team: 'Marketing',
    customer: 'Agency',
    rating: 0,
  },
  {
    id: '#06051',
    subject: 'Create marketing materials for the campaign',
    status: 'Replied',
    firstDue: 'Fulfilled',
    resolution: 'Fulfilled',
    priority: 'Medium',
    type: 'Incident',
    assignee: 'Sandeep',
    team: 'Marketing',
    customer: 'CRED',
    rating: 0,
  },
  {
    id: '#06050',
    subject: 'Launch email campaign targeting new subscribers',
    status: 'New',
    firstDue: '1h 45m',
    resolution: '3d 2h',
    priority: 'High',
    type: 'Incident',
    assignee: 'Jay',
    team: 'Creative',
    customer: 'Timeless',
    rating: 0,
  },
  {
    id: '#06049',
    subject: 'Conduct A/B testing for website landing pages',
    status: 'In Progress',
    firstDue: 'Fulfilled',
    resolution: '1d 3h',
    priority: 'Medium',
    type: 'Bug',
    assignee: 'Gowtham',
    team: 'Product',
    customer: 'WebSolutions',
    rating: 0,
  },
  {
    id: '#06048',
    subject: 'Revamp mobile app interface for improved flow',
    status: 'Resolved',
    firstDue: 'Fulfilled',
    resolution: 'Fulfilled',
    priority: 'High',
    type: 'Unspecified',
    assignee: 'Aisha',
    team: 'Design',
    customer: 'AppInnovations',
    rating: 4,
  },
  {
    id: '#06047',
    subject: 'Integrate payment gateway for e-commerce',
    status: 'Resolved',
    firstDue: 'Fulfilled',
    resolution: 'Fulfilled',
    priority: 'High',
    type: 'Bug',
    assignee: 'Rajesh',
    team: 'Development',
    customer: 'ShopTech',
    rating: 3,
  },
  {
    id: '#06046',
    subject: 'Conduct user research for new product features',
    status: 'Resolved',
    firstDue: 'Fulfilled',
    resolution: 'Fulfilled',
    priority: 'Medium',
    type: 'Incident',
    assignee: 'Jessica',
    team: 'UX',
    customer: 'InnovativeIdeas',
    rating: 4,
  },
  {
    id: '#06045',
    subject: 'Update content strategy for social media',
    status: 'Resolved',
    firstDue: 'Fulfilled',
    resolution: 'Fulfilled',
    priority: 'Low',
    type: 'Bug',
    assignee: 'Sandeep',
    team: 'Marketing',
    customer: 'SocialMediaMasters',
    rating: 5,
  },
  {
    id: '#06044',
    subject: 'Optimize website load time and performance',
    status: 'Not Started',
    firstDue: 'Pending',
    resolution: '4d 8h',
    priority: 'High',
    type: 'Improvement',
    assignee: 'Lina',
    team: 'Engineering',
    customer: 'TechSolutions',
    rating: 0,
  },
]

// Ratings live here rather than on the row: ListView hands the cell slot its
// own row object, so writing to that doesn't reach this data. Keyed by ticket.
const rows = tickets
  .slice(0, 10)
  .map((ticket) => ({ ...ticket, name: ticket.id }))

const ratings = reactive<Record<string, number>>(
  Object.fromEntries(tickets.map((ticket) => [ticket.id, ticket.rating])),
)

const opened = ref<string | null>(null)
</script>

<template>
  <!--
    1180px of table, scrolling sideways inside that — the columns come to
    ~1470. Rows are 40 and the label row 32, per the table rule; the label row
    is unfilled with a single outline-gray-1 rule under it.
  -->
  <div class="w-[1180px] max-w-full overflow-x-auto">
    <!--
      Row hover: ListView washes an unselected row in `surface-sidebar`, which
      is pure black in the dark theme — darker than the page, so the hover
      reads as nothing. `surface-gray-1` lifts in both themes. Selected rows
      keep their own hover, hence the `:not()`.
    -->
    <ListView
      :class="`w-max ${espressoListView}`"
      :columns="columns"
      :rows="rows"
      row-key="id"
      :options="{
        selectable: true,
        showTooltip: false,
        rowHeight: 40,
        onRowClick: (row: Ticket) => (opened = row.id),
      }"
    >
      <template #cell="{ item, row, column }">
        <span class="flex min-w-0 items-center gap-2">
          <!-- Espresso's own dot and priority glyphs, exported from the file. -->
          <StatusDot
            v-if="column.key === 'status'"
            :token="statusToken[(row as Ticket).status]"
          />
          <PriorityIcon
            v-else-if="column.key === 'priority'"
            :level="(row as Ticket).priority"
          />
          <Avatar
            v-else-if="column.key === 'assignee'"
            size="sm"
            :image="faceFor((row as Ticket).assignee)"
            :label="(row as Ticket).assignee"
          />

          <!-- The two SLA columns read as badges. -->
          <Badge
            v-if="column.key === 'firstDue'"
            :label="(row as Ticket).firstDue"
            :theme="dueTheme((row as Ticket).firstDue)"
            variant="subtle"
            size="md"
          />
          <Badge
            v-else-if="column.key === 'resolution'"
            :label="(row as Ticket).resolution"
            :theme="resolutionTheme((row as Ticket).resolution)"
            variant="subtle"
            size="md"
          />
          <!--
            Read-only here. The rating does work inside a row — a guard on the
            cell keeps its clicks off the row's handler — but the row's own
            hover and click sit under it, and two targets in one place read as
            one. It shows the score; rating happens on the ticket itself.
          -->
          <Rating
            v-else-if="column.key === 'rating'"
            :model-value="ratings[(row as Ticket).id]"
            size="sm"
            disabled
            :aria-label="`Rated ${ratings[(row as Ticket).id]} of 5`"
          />

          <!--
            The id and the ticket both carry the row: medium, in ink-gray-8.
            (Usually that is the first column after the checkbox; here it is
            the first two.) Everything else is regular ink-gray-6.
          -->
          <span
            v-else
            class="truncate"
            :class="
              column.key === 'id' || column.key === 'subject'
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
