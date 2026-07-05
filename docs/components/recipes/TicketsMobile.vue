<script setup>
import { computed, ref } from 'vue'
import {
  Avatar,
  Badge,
  Button,
  MobileNav,
  MobileNavItem,
  MobileShell,
  PageHeaderMobile,
  TabButtons,
} from 'frappe-ui'
import { List, ListCell, ListRow } from 'frappe-ui/list'

const tab = ref('tickets')
const filterTab = ref('Open')

const statusTheme = {
  Open: 'red',
  Replied: 'blue',
  Resolved: 'green',
  Paused: 'gray',
}
// SLA state → text color, mirroring the desktop recipe: `met`/`breached` read
// as pass/fail against the target, `pending` is still counting down, `none`
// means no target applies (e.g. a paused ticket's resolution).
const slaTextClass = {
  met: 'text-ink-green-6',
  breached: 'text-ink-red-6',
  pending: 'text-ink-gray-5',
  none: 'text-ink-gray-4',
}

// Mirrors the desktop recipe's ticket set. `firstResponse` / `resolution` carry
// the SLA `{ label, state }` shown as a compact line on each card.
const tickets = [
  {
    id: 1024,
    subject: 'Cannot connect custom domain to my site',
    customer: 'Acme Corp',
    image: 'https://i.pravatar.cc/150?img=11',
    status: 'Open',
    firstResponse: { label: 'Due 8m', state: 'pending' },
    resolution: { label: 'Due 3h', state: 'pending' },
    lastActivity: '12m',
  },
  {
    id: 1023,
    subject: 'Invoice shows wrong billing address',
    customer: 'Globex',
    image: 'https://i.pravatar.cc/150?img=12',
    status: 'Replied',
    firstResponse: { label: '6m', state: 'met' },
    resolution: { label: 'Due 5h', state: 'pending' },
    lastActivity: '45m',
  },
  {
    id: 1022,
    subject: 'Webhook deliveries failing since yesterday',
    customer: 'Initech',
    image: 'https://i.pravatar.cc/150?img=13',
    status: 'Open',
    firstResponse: { label: 'Overdue 20m', state: 'breached' },
    resolution: { label: 'Due 1h', state: 'pending' },
    lastActivity: '2h',
  },
  {
    id: 1021,
    subject: 'How do I export all my data?',
    customer: 'Hooli',
    image: 'https://i.pravatar.cc/150?img=14',
    status: 'Replied',
    firstResponse: { label: '18m', state: 'met' },
    resolution: { label: 'Due 1d', state: 'pending' },
    lastActivity: '5h',
  },
  {
    id: 1017,
    subject: 'Payment gateway returns 500 on checkout',
    customer: 'Wayne Enterprises',
    image: 'https://i.pravatar.cc/150?img=20',
    status: 'Open',
    firstResponse: { label: 'Due 4m', state: 'pending' },
    resolution: { label: 'Due 2h', state: 'pending' },
    lastActivity: '5m',
  },
  {
    id: 1016,
    subject: 'API rate limit hit unexpectedly',
    customer: 'Soylent',
    image: 'https://i.pravatar.cc/150?img=21',
    status: 'Replied',
    firstResponse: { label: '11m', state: 'met' },
    resolution: { label: 'Due 6h', state: 'pending' },
    lastActivity: '30m',
  },
  {
    id: 1015,
    subject: 'Cannot invite new team members',
    customer: 'Cyberdyne',
    image: 'https://i.pravatar.cc/150?img=22',
    status: 'Open',
    firstResponse: { label: 'Overdue 5m', state: 'breached' },
    resolution: { label: 'Due 9h', state: 'pending' },
    lastActivity: '1h',
  },
  {
    id: 1014,
    subject: 'Emails landing in the spam folder',
    customer: 'Tyrell Corp',
    image: 'https://i.pravatar.cc/150?img=23',
    status: 'Replied',
    firstResponse: { label: '24m', state: 'met' },
    resolution: { label: 'Due 12h', state: 'pending' },
    lastActivity: '3h',
  },
  {
    id: 1013,
    subject: 'Report export times out for large datasets',
    customer: 'Massive Dynamic',
    image: 'https://i.pravatar.cc/150?img=24',
    status: 'Replied',
    firstResponse: { label: '9m', state: 'met' },
    resolution: { label: 'Due 4h', state: 'pending' },
    lastActivity: '4h',
  },
  {
    id: 1012,
    subject: 'Typo in the onboarding welcome email',
    customer: 'Wonka Industries',
    image: 'https://i.pravatar.cc/150?img=25',
    status: 'Open',
    firstResponse: { label: 'Due 2d', state: 'pending' },
    resolution: { label: 'Due 5d', state: 'pending' },
    lastActivity: '8h',
  },
  {
    id: 1020,
    subject: 'Two-factor authentication reset request',
    customer: 'Umbrella Labs',
    image: 'https://i.pravatar.cc/150?img=15',
    status: 'Paused',
    firstResponse: { label: '14m', state: 'met' },
    resolution: { label: 'On hold', state: 'none' },
    lastActivity: '1d',
  },
  {
    id: 1011,
    subject: 'Production site down after last deploy',
    customer: 'Oscorp',
    image: 'https://i.pravatar.cc/150?img=26',
    status: 'Replied',
    firstResponse: { label: '3m', state: 'met' },
    resolution: { label: 'Overdue 40m', state: 'breached' },
    lastActivity: '1d',
  },
  {
    id: 1019,
    subject: 'Feature request: dark mode for the portal',
    customer: 'Pied Piper',
    image: 'https://i.pravatar.cc/150?img=16',
    status: 'Resolved',
    firstResponse: { label: '32m', state: 'met' },
    resolution: { label: '1d 4h', state: 'met' },
    lastActivity: '2d',
  },
  {
    id: 1010,
    subject: 'Refund not reflected on my statement',
    customer: 'Gringotts',
    image: 'https://i.pravatar.cc/150?img=27',
    status: 'Resolved',
    firstResponse: { label: '19m', state: 'met' },
    resolution: { label: '6h 12m', state: 'met' },
    lastActivity: '2d',
  },
  {
    id: 1018,
    subject: 'SSO login loops back to the sign-in page',
    customer: 'Stark Industries',
    image: 'https://i.pravatar.cc/150?img=28',
    status: 'Resolved',
    firstResponse: { label: '52m', state: 'breached' },
    resolution: { label: '2d 1h', state: 'breached' },
    lastActivity: '3d',
  },
  {
    id: 1009,
    subject: 'Update company logo on generated invoices',
    customer: 'Nakatomi',
    image: 'https://i.pravatar.cc/150?img=29',
    status: 'Resolved',
    firstResponse: { label: '41m', state: 'met' },
    resolution: { label: '3d 2h', state: 'met' },
    lastActivity: '4d',
  },
]

const visibleTickets = computed(() => {
  if (filterTab.value === 'Open') {
    return tickets.filter((t) => ['Open', 'Replied'].includes(t.status))
  }
  return tickets
})
</script>

<template>
  <MobileShell>
    <PageHeaderMobile title="Tickets">
      <template #right>
        <Button
          variant="ghost"
          icon="lucide-list-filter"
          label="Filter tickets"
        />
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
          v-for="ticket in visibleTickets"
          :key="ticket.id"
          class="py-3"
          @click="() => {}"
        >
          <ListCell class="self-start pt-0.5">
            <Avatar
              :image="ticket.image"
              :label="ticket.customer"
              size="2xl"
              shape="circle"
            />
          </ListCell>
          <ListCell class="self-start">
            <div class="min-w-0 flex-1">
              <!-- The sized text lives in an inner span so it keeps its own
                   line-height. Putting `leading-none` on the same element as
                   `truncate` (overflow-hidden) would shear off descenders like
                   the tail of "g". -->
              <div class="truncate leading-none text-ink-gray-8">
                <span class="text-lg">{{ ticket.subject }}</span>
              </div>
              <div class="mt-1.5 truncate text-md text-ink-gray-5">
                #{{ ticket.id }} · {{ ticket.customer }}
              </div>
              <!-- SLA line: first response + resolution, matching the desktop
                   Response / Resolution column. `overflow-hidden` clips rather
                   than wraps if a label pair runs long on a narrow screen. -->
              <div
                class="mt-1.5 flex items-center gap-2.5 overflow-hidden text-sm"
              >
                <span
                  class="flex items-center gap-1 whitespace-nowrap"
                  title="First response"
                >
                  <span
                    class="lucide-reply size-3.5 shrink-0 text-ink-gray-4"
                    aria-hidden="true"
                  />
                  <span :class="slaTextClass[ticket.firstResponse.state]">
                    {{ ticket.firstResponse.label }}
                  </span>
                </span>
                <span
                  class="flex items-center gap-1 whitespace-nowrap"
                  title="Resolution"
                >
                  <span
                    class="lucide-circle-check size-3.5 shrink-0 text-ink-gray-4"
                    aria-hidden="true"
                  />
                  <span :class="slaTextClass[ticket.resolution.state]">
                    {{ ticket.resolution.label }}
                  </span>
                </span>
              </div>
            </div>
          </ListCell>
          <ListCell class="self-start justify-end pt-0.5">
            <div>
              <div class="whitespace-nowrap text-right text-sm text-ink-gray-5">
                {{ ticket.lastActivity }}
              </div>
              <div class="mt-1.5 flex items-center justify-end">
                <Badge
                  :theme="statusTheme[ticket.status]"
                  :label="ticket.status"
                />
              </div>
            </div>
          </ListCell>
        </ListRow>
      </List>
    </div>

    <template #nav>
      <MobileNav>
        <MobileNavItem
          label="Tickets"
          icon="lucide-ticket"
          :active="tab === 'tickets'"
          @click="tab = 'tickets'"
        />
        <MobileNavItem
          label="Knowledge base"
          icon="lucide-book-open"
          :active="tab === 'kb'"
          @click="tab = 'kb'"
        />
        <MobileNavItem
          label="Notifications"
          icon="lucide-bell"
          :active="tab === 'notifications'"
          @click="tab = 'notifications'"
        />
        <MobileNavItem label="You" :active="tab === 'you'" @click="tab = 'you'">
          <template #default="{ active }">
            <Avatar
              image="https://i.pravatar.cc/150?img=17"
              label="Priya Nair"
              size="md"
              :class="active ? 'ring-2 ring-outline-gray-4' : ''"
            />
          </template>
        </MobileNavItem>
      </MobileNav>
    </template>
  </MobileShell>
</template>
