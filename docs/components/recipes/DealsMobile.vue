<script setup>
import { ref } from 'vue'
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

const tab = ref('deals')
const view = ref('Board')

const owners = {
  evan: {
    name: 'Evan You',
    image: 'https://avatars.githubusercontent.com/u/499550?v=4',
  },
  priya: { name: 'Priya Nair', image: 'https://i.pravatar.cc/150?img=5' },
  sam: { name: 'Sam Rivera', image: 'https://i.pravatar.cc/150?img=12' },
  ana: { name: 'Ana Costa', image: 'https://i.pravatar.cc/150?img=9' },
}

const logo = (org) =>
  `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(org)}`

const statusDot = {
  gray: 'bg-surface-gray-7',
  amber: 'bg-surface-amber-7',
  blue: 'bg-surface-blue-7',
  green: 'bg-surface-green-7',
}

const columns = ref([
  {
    status: 'Qualification',
    theme: 'gray',
    deals: [
      { org: 'Globex', value: '$ 45,000', owner: 'priya', due: 'Jul 18', tag: 'Inbound' },
      { org: 'Stark Industries', value: '$ 1,10,000', owner: 'ana', due: 'Jul 22', tag: 'Referral' },
      { org: 'Wayne Corp', value: '$ 32,000', owner: 'sam', due: 'Aug 2', tag: 'Outbound' },
      { org: 'Cyberdyne', value: '$ 76,000', owner: 'evan', due: 'Aug 9', tag: 'Outbound' },
      { org: 'Vandelay', value: '$ 28,500', owner: 'priya', due: 'Aug 14', tag: 'Inbound' },
    ],
  },
  {
    status: 'Negotiation',
    theme: 'amber',
    deals: [
      { org: 'Acme Corp', value: '$ 1,20,000', owner: 'evan', due: 'Jul 12', tag: 'Inbound' },
      { org: 'Umbrella Labs', value: '$ 88,000', owner: 'ana', due: 'Jul 15', tag: 'Partner' },
      { org: 'Wonka Industries', value: '$ 54,000', owner: 'sam', due: 'Jul 21', tag: 'Outbound' },
      { org: 'Duff Co', value: '$ 39,000', owner: 'priya', due: 'Jul 25', tag: 'Referral' },
    ],
  },
  {
    status: 'Ready to Close',
    theme: 'blue',
    deals: [
      { org: 'Hooli', value: '$ 2,05,000', owner: 'evan', due: 'Jul 9', tag: 'Expansion' },
      { org: 'Pied Piper', value: '$ 64,000', owner: 'priya', due: 'Jul 11', tag: 'Inbound' },
      { org: 'Massive Dynamic', value: '$ 1,75,000', owner: 'ana', due: 'Jul 14', tag: 'Partner' },
    ],
  },
  {
    status: 'Won',
    theme: 'green',
    deals: [
      { org: 'Initech', value: '$ 2,40,000', owner: 'sam', due: 'Closed Jul 1', tag: 'Renewal' },
      { org: 'Soylent Corp', value: '$ 96,000', owner: 'evan', due: 'Closed Jun 28', tag: 'Expansion' },
      { org: 'Tyrell Corp', value: '$ 1,32,000', owner: 'priya', due: 'Closed Jun 20', tag: 'Referral' },
    ],
  },
])
</script>

<template>
  <MobileShell>
    <PageHeaderMobile title="Deals">
      <template #right>
        <Button variant="ghost" icon="lucide-plus" label="New deal" />
      </template>
    </PageHeaderMobile>

    <div class="flex h-full flex-col">
      <div class="flex items-center gap-2 px-4 py-3">
        <TabButtons
          v-model="view"
          class="flex-1"
          :options="[{ label: 'Board' }, { label: 'List' }]"
        />
        <Button icon="lucide-list-filter" label="Filter" />
        <Button icon="lucide-arrow-down-up" label="Sort" />
      </div>

      <!-- The board pans horizontally with column snapping; each column scrolls
           its own cards. -->
      <div
        class="flex min-h-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pb-4"
      >
        <div
          v-for="column in columns"
          :key="column.status"
          class="flex min-h-0 w-72 shrink-0 snap-start flex-col rounded-lg bg-surface-gray-1"
        >
          <div class="flex items-center justify-between pl-3 pr-1 pt-1">
            <div class="flex items-center gap-2">
              <span
                class="size-2 rounded-full"
                :class="statusDot[column.theme]"
                aria-hidden="true"
              />
              <span class="text-sm font-medium text-ink-gray-8">
                {{ column.status }}
              </span>
              <span class="text-sm text-ink-gray-5">
                {{ column.deals.length }}
              </span>
            </div>
            <Button variant="ghost" icon="lucide-plus" label="Add deal" />
          </div>

          <!-- The card list carries its own padding (instead of the column)
               so card shadows aren't clipped by the scroll container's edge. -->
          <div class="min-h-0 flex-1 overflow-y-auto">
            <div class="flex flex-col gap-2 p-2">
              <div
                v-for="deal in column.deals"
                :key="deal.org"
                class="rounded-lg border bg-surface-base p-3 shadow-sm"
              >
                <div class="flex items-center gap-2">
                  <Avatar
                    :label="deal.org"
                    :image="logo(deal.org)"
                    size="sm"
                    shape="square"
                  />
                  <span
                    class="flex-1 truncate text-base font-medium text-ink-gray-9"
                  >
                    {{ deal.org }}
                  </span>
                </div>
                <div class="mt-2.5 flex items-center justify-between">
                  <span class="text-base font-semibold text-ink-gray-8">
                    {{ deal.value }}
                  </span>
                  <Badge variant="outline" :label="deal.tag" />
                </div>
                <div class="mt-2.5 flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <Avatar
                      :label="owners[deal.owner].name"
                      :image="owners[deal.owner].image"
                      size="xs"
                    />
                    <span class="text-sm text-ink-gray-6">
                      {{ owners[deal.owner].name }}
                    </span>
                  </div>
                  <span class="flex items-center gap-1 text-sm text-ink-gray-5">
                    <span class="lucide-calendar size-3.5" aria-hidden="true" />
                    {{ deal.due }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #nav>
      <MobileNav>
        <MobileNavItem
          label="Notifications"
          icon="lucide-inbox"
          :active="tab === 'notifications'"
          @click="tab = 'notifications'"
        />
        <MobileNavItem
          label="Leads"
          icon="lucide-users"
          :active="tab === 'leads'"
          @click="tab = 'leads'"
        />
        <MobileNavItem
          label="Deals"
          icon="lucide-handshake"
          :active="tab === 'deals'"
          @click="tab = 'deals'"
        />
        <MobileNavItem
          label="Contacts"
          icon="lucide-contact"
          :active="tab === 'contacts'"
          @click="tab = 'contacts'"
        />
      </MobileNav>
    </template>
  </MobileShell>
</template>
