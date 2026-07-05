<script setup>
import { computed, ref } from 'vue'
import {
  Avatar,
  Badge,
  Button,
  DesktopShell,
  PageHeader,
  PageHeaderTitle,
  ScrollArea,
  Sidebar,
  SidebarCollapseToggle,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  TabButtons,
} from 'frappe-ui'
import {
  List,
  ListCell,
  ListHeader,
  ListHeaderCell,
  ListHeaderCellSort,
  ListRow,
  ListRows,
} from 'frappe-ui/list'

const nav = [
  { label: 'Tickets', icon: 'lucide-ticket', count: 24 },
  { label: 'Customers', icon: 'lucide-building-2' },
  { label: 'Contacts', icon: 'lucide-contact' },
  { label: 'Agents', icon: 'lucide-headset' },
  { label: 'Knowledge base', icon: 'lucide-book-open' },
  { label: 'Canned responses', icon: 'lucide-message-square-text' },
]
const activeNav = ref('Tickets')

const views = ['My open tickets', 'Urgent', 'Unassigned', 'Solved this week']

const statusTheme = {
  Open: 'red',
  Replied: 'blue',
  Resolved: 'green',
  Paused: 'gray',
}
const priorityDot = {
  Urgent: 'bg-surface-red-7',
  High: 'bg-surface-amber-7',
  Medium: 'bg-surface-gray-7',
  Low: 'bg-surface-gray-4',
}
// SLA state → text color. `met`/`breached` read as pass/fail against the
// target, `pending` is still counting down, `none` means no target applies.
const slaTextClass = {
  met: 'text-ink-green-6',
  breached: 'text-ink-red-6',
  pending: 'text-ink-gray-5',
  none: 'text-ink-gray-4',
}

// `firstResponse` / `resolution` mirror a helpdesk SLA: `label` is the elapsed
// or remaining time, `state` drives the color (met / breached / pending / none).
const tickets = [
  {
    id: 1024,
    subject: 'Cannot connect custom domain to my site',
    customer: 'Acme Corp',
    status: 'Open',
    priority: 'Urgent',
    agent: 'Priya Nair',
    agentImage: 'https://i.pravatar.cc/150?img=8',
    firstResponse: { label: 'Due 8 m', state: 'pending' },
    resolution: { label: 'Due 3 h', state: 'pending' },
    modified: 12,
    modifiedLabel: '12 m',
  },
  {
    id: 1023,
    subject: 'Invoice shows wrong billing address',
    customer: 'Globex',
    status: 'Replied',
    priority: 'High',
    agent: 'Evan You',
    agentImage: 'https://avatars.githubusercontent.com/u/499550?v=4',
    firstResponse: { label: '6 m', state: 'met' },
    resolution: { label: 'Due 5 h', state: 'pending' },
    modified: 45,
    modifiedLabel: '45 m',
  },
  {
    id: 1022,
    subject: 'Webhook deliveries failing since yesterday',
    customer: 'Initech',
    status: 'Open',
    priority: 'High',
    agent: 'Sam Rivera',
    agentImage: 'https://i.pravatar.cc/150?img=15',
    firstResponse: { label: 'Overdue 20 m', state: 'breached' },
    resolution: { label: 'Due 1 h', state: 'pending' },
    modified: 120,
    modifiedLabel: '2 h',
  },
  {
    id: 1021,
    subject: 'How do I export all my data?',
    customer: 'Hooli',
    status: 'Replied',
    priority: 'Medium',
    agent: 'Ana Costa',
    agentImage: 'https://i.pravatar.cc/150?img=25',
    firstResponse: { label: '18 m', state: 'met' },
    resolution: { label: 'Due 1 d', state: 'pending' },
    modified: 300,
    modifiedLabel: '5 h',
  },
  {
    id: 1017,
    subject: 'Payment gateway returns 500 on checkout',
    customer: 'Wayne Enterprises',
    status: 'Open',
    priority: 'Urgent',
    agent: 'Leo Park',
    agentImage: 'https://i.pravatar.cc/150?img=33',
    firstResponse: { label: 'Due 4 m', state: 'pending' },
    resolution: { label: 'Due 2 h', state: 'pending' },
    modified: 5,
    modifiedLabel: '5 m',
  },
  {
    id: 1016,
    subject: 'API rate limit hit unexpectedly',
    customer: 'Soylent',
    status: 'Replied',
    priority: 'High',
    agent: 'Mara Singh',
    agentImage: 'https://i.pravatar.cc/150?img=45',
    firstResponse: { label: '11 m', state: 'met' },
    resolution: { label: 'Due 6 h', state: 'pending' },
    modified: 30,
    modifiedLabel: '30 m',
  },
  {
    id: 1015,
    subject: 'Cannot invite new team members',
    customer: 'Cyberdyne',
    status: 'Open',
    priority: 'Medium',
    agent: 'Ana Costa',
    agentImage: 'https://i.pravatar.cc/150?img=25',
    firstResponse: { label: 'Overdue 5 m', state: 'breached' },
    resolution: { label: 'Due 9 h', state: 'pending' },
    modified: 75,
    modifiedLabel: '1 h',
  },
  {
    id: 1014,
    subject: 'Emails landing in the spam folder',
    customer: 'Tyrell Corp',
    status: 'Replied',
    priority: 'Medium',
    agent: 'Sam Rivera',
    agentImage: 'https://i.pravatar.cc/150?img=15',
    firstResponse: { label: '24 m', state: 'met' },
    resolution: { label: 'Due 12 h', state: 'pending' },
    modified: 210,
    modifiedLabel: '3 h 30 m',
  },
  {
    id: 1013,
    subject: 'Report export times out for large datasets',
    customer: 'Massive Dynamic',
    status: 'Replied',
    priority: 'High',
    agent: 'Leo Park',
    agentImage: 'https://i.pravatar.cc/150?img=33',
    firstResponse: { label: '9 m', state: 'met' },
    resolution: { label: 'Due 4 h', state: 'pending' },
    modified: 260,
    modifiedLabel: '4 h',
  },
  {
    id: 1012,
    subject: 'Typo in the onboarding welcome email',
    customer: 'Wonka Industries',
    status: 'Open',
    priority: 'Low',
    agent: 'Mara Singh',
    agentImage: 'https://i.pravatar.cc/150?img=45',
    firstResponse: { label: 'Due 2 d', state: 'pending' },
    resolution: { label: 'Due 5 d', state: 'pending' },
    modified: 480,
    modifiedLabel: '8 h',
  },
  {
    id: 1020,
    subject: 'Two-factor authentication reset request',
    customer: 'Umbrella Labs',
    status: 'Paused',
    priority: 'Medium',
    agent: 'Priya Nair',
    agentImage: 'https://i.pravatar.cc/150?img=8',
    firstResponse: { label: '14 m', state: 'met' },
    resolution: { label: 'On hold', state: 'none' },
    modified: 1440,
    modifiedLabel: '1 d',
  },
  {
    id: 1011,
    subject: 'Production site down after last deploy',
    customer: 'Oscorp',
    status: 'Replied',
    priority: 'Urgent',
    agent: 'Sam Rivera',
    agentImage: 'https://i.pravatar.cc/150?img=15',
    firstResponse: { label: '3 m', state: 'met' },
    resolution: { label: 'Overdue 40 m', state: 'breached' },
    modified: 1500,
    modifiedLabel: '1 d',
  },
  {
    id: 1019,
    subject: 'Feature request: dark mode for the portal',
    customer: 'Pied Piper',
    status: 'Resolved',
    priority: 'Low',
    agent: 'Evan You',
    agentImage: 'https://avatars.githubusercontent.com/u/499550?v=4',
    firstResponse: { label: '32 m', state: 'met' },
    resolution: { label: '1 d 4 h', state: 'met' },
    modified: 2880,
    modifiedLabel: '2 d',
  },
  {
    id: 1010,
    subject: 'Refund not reflected on my statement',
    customer: 'Gringotts',
    status: 'Resolved',
    priority: 'Medium',
    agent: 'Ana Costa',
    agentImage: 'https://i.pravatar.cc/150?img=25',
    firstResponse: { label: '19 m', state: 'met' },
    resolution: { label: '6 h 12 m', state: 'met' },
    modified: 3600,
    modifiedLabel: '2 d',
  },
  {
    id: 1018,
    subject: 'SSO login loops back to the sign-in page',
    customer: 'Stark Industries',
    status: 'Resolved',
    priority: 'Urgent',
    agent: 'Sam Rivera',
    agentImage: 'https://i.pravatar.cc/150?img=15',
    firstResponse: { label: '52 m', state: 'breached' },
    resolution: { label: '2 d 1 h', state: 'breached' },
    modified: 4320,
    modifiedLabel: '3 d',
  },
  {
    id: 1009,
    subject: 'Update company logo on generated invoices',
    customer: 'Nakatomi',
    status: 'Resolved',
    priority: 'Low',
    agent: 'Leo Park',
    agentImage: 'https://i.pravatar.cc/150?img=33',
    firstResponse: { label: '41 m', state: 'met' },
    resolution: { label: '3 d 2 h', state: 'met' },
    modified: 5760,
    modifiedLabel: '4 d',
  },
]

const filterTab = ref('Open')
const filteredTickets = computed(() => {
  if (filterTab.value === 'Open') {
    return tickets.filter((t) => ['Open', 'Replied'].includes(t.status))
  }
  return tickets
})

// Sort state, toggle rules, and the comparator are app code — the header
// cells only render chrome for whatever `direction` you hand them.
const sortField = ref('modified')
const sortDirection = ref('asc')

function toggleSort(field) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

function directionFor(field) {
  return sortField.value === field ? sortDirection.value : null
}

const priorityRank = { Urgent: 0, High: 1, Medium: 2, Low: 3 }
const sortedTickets = computed(() => {
  const factor = sortDirection.value === 'desc' ? -1 : 1
  return [...filteredTickets.value].sort((a, b) => {
    if (sortField.value === 'priority') {
      return factor * (priorityRank[a.priority] - priorityRank[b.priority])
    }
    return factor * (a.modified - b.modified)
  })
})

const selection = ref([])
</script>

<template>
  <div class="h-screen w-full bg-surface-base text-ink-gray-9">
    <DesktopShell>
      <template #sidebar>
        <Sidebar width="14rem" class="border-r">
          <SidebarHeader
            title="Tickets"
            subtitle="helpdesk.fernwood.io"
            logo="https://api.dicebear.com/10.x/disco/svg?seed=Fernwood"
            :menu-items="[
              { label: 'Switch team', icon: 'lucide-arrow-left-right' },
              { label: 'Log out', icon: 'lucide-log-out' },
            ]"
          />

          <ScrollArea class="min-h-0 flex-1" viewport-class="px-2 pt-0.5 pb-10">
            <nav class="space-y-0.5">
              <SidebarItem
                v-for="item in nav"
                :key="item.label"
                :active="activeNav === item.label"
                @click="activeNav = item.label"
              >
                <template #prefix>
                  <span :class="item.icon" class="size-4" aria-hidden="true" />
                </template>
                <span class="flex-1 truncate text-sm">{{ item.label }}</span>
                <template #suffix>
                  <Badge
                    v-if="item.count"
                    variant="ghost"
                    :label="String(item.count)"
                  />
                </template>
              </SidebarItem>
            </nav>

            <div class="mt-4 flex h-7 items-center">
              <SidebarLabel>Views</SidebarLabel>
            </div>
            <nav class="mt-0.5 space-y-0.5">
              <SidebarItem v-for="view in views" :key="view">
                <template #prefix>
                  <span class="lucide-list-filter size-4" aria-hidden="true" />
                </template>
                <span class="flex-1 truncate text-sm">{{ view }}</span>
              </SidebarItem>
            </nav>
          </ScrollArea>

          <div class="mt-auto px-2 pb-2">
            <SidebarCollapseToggle />
          </div>
        </Sidebar>
      </template>

      <PageHeader>
        <div class="flex items-center gap-2">
          <PageHeaderTitle title="Tickets" />
          <span v-if="selection.length" class="text-sm text-ink-gray-5">
            {{ selection.length }} selected
          </span>
        </div>
        <div class="flex items-center gap-2">
          <template v-if="selection.length">
            <Button label="Assign" icon-left="lucide-user-plus" />
            <Button label="Close tickets" icon-left="lucide-check" />
          </template>
          <template v-else>
            <TabButtons
              v-model="filterTab"
              :options="[{ label: 'Open' }, { label: 'All' }]"
            />
            <Button label="Filter" icon-left="lucide-list-filter" />
            <Button
              variant="solid"
              label="New ticket"
              icon-left="lucide-plus"
            />
          </template>
        </div>
      </PageHeader>

      <div class="px-3 pt-3 sm:px-5">
        <List
          class="w-full list-row-px-3"
          :columns="[
            'minmax(0,1fr)',
            '11rem',
            '6.5rem',
            '6rem',
            '9rem',
            '5rem',
          ]"
          :row-height="60"
          selectable
          v-model:selection="selection"
        >
          <ListHeader>
            <ListHeaderCell>Subject</ListHeaderCell>
            <ListHeaderCell>Response / Resolution</ListHeaderCell>
            <ListHeaderCell>Status</ListHeaderCell>
            <ListHeaderCellSort
              :direction="directionFor('priority')"
              @click="toggleSort('priority')"
            >
              Priority
            </ListHeaderCellSort>
            <ListHeaderCell>Assigned to</ListHeaderCell>
            <ListHeaderCellSort
              :direction="directionFor('modified')"
              align="end"
              @click="toggleSort('modified')"
            >
              Modified
            </ListHeaderCellSort>
          </ListHeader>
          <ListRows :items="sortedTickets" v-slot="{ item: ticket, value }">
            <ListRow :value="value" @click="() => {}">
              <ListCell>
                <div class="min-w-0">
                  <div class="truncate text-base text-ink-gray-8">
                    {{ ticket.subject }}
                  </div>
                  <div class="mt-1.5 truncate text-sm text-ink-gray-5">
                    #{{ ticket.id }} · {{ ticket.customer }}
                  </div>
                </div>
              </ListCell>
              <ListCell>
                <div class="min-w-0 leading-tight">
                  <div class="flex items-center gap-1.5" title="First response">
                    <span
                      class="lucide-reply size-3.5 shrink-0 text-ink-gray-4"
                      aria-hidden="true"
                    />
                    <span
                      class="truncate text-sm"
                      :class="slaTextClass[ticket.firstResponse.state]"
                    >
                      {{ ticket.firstResponse.label }}
                    </span>
                  </div>
                  <div
                    class="mt-1.5 flex items-center gap-1.5"
                    title="Resolution"
                  >
                    <span
                      class="lucide-circle-check size-3.5 shrink-0 text-ink-gray-4"
                      aria-hidden="true"
                    />
                    <span
                      class="truncate text-sm"
                      :class="slaTextClass[ticket.resolution.state]"
                    >
                      {{ ticket.resolution.label }}
                    </span>
                  </div>
                </div>
              </ListCell>
              <ListCell>
                <Badge
                  :theme="statusTheme[ticket.status]"
                  :label="ticket.status"
                />
              </ListCell>
              <ListCell>
                <span
                  class="size-2 shrink-0 rounded-full"
                  :class="priorityDot[ticket.priority]"
                  aria-hidden="true"
                />
                <span class="ml-2 whitespace-nowrap text-base text-ink-gray-7">
                  {{ ticket.priority }}
                </span>
              </ListCell>
              <ListCell>
                <Avatar
                  :label="ticket.agent"
                  :image="ticket.agentImage"
                  size="sm"
                />
                <span class="ml-2 truncate text-base text-ink-gray-7">
                  {{ ticket.agent }}
                </span>
              </ListCell>
              <ListCell class="justify-end">
                <span class="text-sm text-ink-gray-5">{{
                  ticket.modifiedLabel
                }}</span>
              </ListCell>
            </ListRow>
          </ListRows>
        </List>
      </div>
    </DesktopShell>
  </div>
</template>
