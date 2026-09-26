<script setup lang="ts">
import { ref } from 'vue'
import { Badge, TabList, Tabs, TabTrigger } from '../../../src'
import {
  ListHeader,
  ListHeaderItem,
  ListRows,
  ListView,
} from '../../../experimental/ListView'
import {
  dataGridListView,
  settingsListViewOptions,
} from '../settingsListViewClasses'

const activeTab = ref('deals')
const tabs = [
  { value: 'deals', label: 'Deals' },
  { value: 'contacts', label: 'Contacts' },
  { value: 'organizations', label: 'Organizations' },
]

// Ten rows here, more than the usual five, at the user's request.
// Column widths from the design. "Lead" appears twice there; kept as drawn.
const columns = [
  { key: 'no', label: 'No', width: '48px' },
  { key: 'organization', label: 'Organization', width: '184px' },
  { key: 'annualReturns', label: 'Annual Returns', width: '136px' },
  { key: 'status', label: 'Status', width: '136px' },
  // 200 and 160 rather than the design's 184 and 120: at those the longest
  // address and domain clip. A column is sized to its content here.
  { key: 'email', label: 'Email', width: '200px' },
  { key: 'mobile', label: 'Mobile number', width: '144px' },
  { key: 'assignee', label: 'Assignee', width: '168px' },
  { key: 'modified', label: 'Modified', width: '216px' },
  { key: 'lead', label: 'Lead', width: '216px' },
  { key: 'phone', label: 'Phone', width: '216px' },
  { key: 'leadStage', label: 'Lead', width: '136px' },
  { key: 'source', label: 'Source', width: '88px' },
  { key: 'leadName', label: 'Lead name', width: '120px' },
  { key: 'website', label: 'Website', width: '160px' },
]

type Row = {
  id: number
  organization: string
  annualReturns: string
  status: { label: string; theme: 'amber' | 'gray' | 'blue' | 'green' | 'red' }
  email: string
  mobile: string
  assignee: string
  modified: string
  lead: string
  phone: string
  leadStage: string
  source: string
  leadName: string
  website: string
}

const rows: Row[] = [
  {
    id: 1,
    organization: 'Attentive',
    annualReturns: '₹12,00,000',
    status: { label: 'Negotiation', theme: 'amber' },
    email: 'hello@attentive.com',
    mobile: '+91 98840 12345',
    assignee: 'George Costanza',
    modified: '21 Sep 2026, 4:12 pm',
    lead: 'Inbound enquiry',
    phone: '+91 44 4012 3456',
    leadStage: 'Qualified',
    source: 'Web',
    leadName: 'Nisha R',
    website: 'attentive.com',
  },
  {
    id: 2,
    organization: 'Northwind Traders',
    annualReturns: '₹8,40,000',
    status: { label: 'Qualification', theme: 'gray' },
    email: 'sales@northwind.co',
    mobile: '+91 98111 22334',
    assignee: 'Elaine Benes',
    modified: '20 Sep 2026, 11:03 am',
    lead: 'Conference list',
    phone: '+91 11 4102 8899',
    leadStage: 'New',
    source: 'Event',
    leadName: 'Arjun M',
    website: 'northwind.co',
  },
  {
    id: 3,
    organization: 'Lumen Works',
    annualReturns: '₹21,60,000',
    status: { label: 'Proposal', theme: 'blue' },
    email: 'contact@lumenworks.io',
    mobile: '+91 90035 77120',
    assignee: 'Jerry Seinfeld',
    modified: '19 Sep 2026, 6:45 pm',
    lead: 'Referral',
    phone: '+91 80 4890 2210',
    leadStage: 'Contacted',
    source: 'Referral',
    leadName: 'Priya S',
    website: 'lumenworks.io',
  },
  {
    id: 4,
    organization: 'Harbour Logistics',
    annualReturns: '₹5,75,000',
    status: { label: 'Won', theme: 'green' },
    email: 'ops@harbourlog.com',
    mobile: '+91 99620 45500',
    assignee: 'Cosmo Kramer',
    modified: '18 Sep 2026, 9:20 am',
    lead: 'Outbound call',
    phone: '+91 22 6789 4321',
    leadStage: 'Customer',
    source: 'Outbound',
    leadName: 'Vikram J',
    website: 'harbourlog.com',
  },
  {
    id: 5,
    organization: 'Peak Analytics',
    annualReturns: '₹3,20,000',
    status: { label: 'Lost', theme: 'red' },
    email: 'team@peakanalytics.ai',
    mobile: '+91 93800 66711',
    assignee: 'Susan Ross',
    modified: '15 Sep 2026, 2:38 pm',
    lead: 'Website form',
    phone: '+91 40 2355 7788',
    leadStage: 'Unqualified',
    source: 'Web',
    leadName: 'Meera K',
    website: 'peakanalytics.ai',
  },
  {
    id: 6,
    organization: 'Copperline Foods',
    annualReturns: '₹9,10,000',
    status: { label: 'Negotiation', theme: 'amber' },
    email: 'orders@copperline.in',
    mobile: '+91 94440 30021',
    assignee: 'Newman',
    modified: '14 Sep 2026, 10:15 am',
    lead: 'Trade show',
    phone: '+91 44 2814 7766',
    leadStage: 'Qualified',
    source: 'Event',
    leadName: 'Rahul D',
    website: 'copperline.in',
  },
  {
    id: 7,
    organization: 'Blue Cedar Health',
    annualReturns: '₹17,25,000',
    status: { label: 'Proposal', theme: 'blue' },
    email: 'info@bluecedar.health',
    mobile: '+91 98204 11876',
    assignee: 'Elaine Benes',
    modified: '12 Sep 2026, 3:02 pm',
    lead: 'Partner intro',
    phone: '+91 22 4009 5512',
    leadStage: 'Contacted',
    source: 'Partner',
    leadName: 'Sana Q',
    website: 'bluecedar.health',
  },
  {
    id: 8,
    organization: 'Ridgeway Motors',
    annualReturns: '₹6,80,000',
    status: { label: 'Qualification', theme: 'gray' },
    email: 'desk@ridgewaymotors.com',
    mobile: '+91 90190 55432',
    assignee: 'George Costanza',
    modified: '11 Sep 2026, 8:47 am',
    lead: 'Cold email',
    phone: '+91 20 6621 3300',
    leadStage: 'New',
    source: 'Outbound',
    leadName: 'Imran B',
    website: 'ridgewaymotors.com',
  },
  {
    id: 9,
    organization: 'Sandbar Studios',
    annualReturns: '₹2,40,000',
    status: { label: 'Won', theme: 'green' },
    email: 'hey@sandbar.studio',
    mobile: '+91 89390 77004',
    assignee: 'Jerry Seinfeld',
    modified: '9 Sep 2026, 5:29 pm',
    lead: 'Referral',
    phone: '+91 484 298 1100',
    leadStage: 'Customer',
    source: 'Referral',
    leadName: 'Deepa V',
    website: 'sandbar.studio',
  },
  {
    id: 10,
    organization: 'Vantage Interiors',
    annualReturns: '₹11,50,000',
    status: { label: 'Lost', theme: 'red' },
    email: 'studio@vantageinteriors.co',
    mobile: '+91 97410 22118',
    assignee: 'Cosmo Kramer',
    modified: '5 Sep 2026, 1:11 pm',
    lead: 'Website form',
    phone: '+91 80 4123 6677',
    leadStage: 'Unqualified',
    source: 'Web',
    leadName: 'Karthik N',
    website: 'vantageinteriors.co',
  },
]

/*
 * The three things frappe-ui's List doesn't do for a data grid, added from
 * outside through its published `data-slot` hooks — the library is untouched:
 *
 *   1. grid lines        a border on every cell, not just the row divider
 *   2. frozen No column  the first cell in each row stays put while the rest
 *                        scrolls (its own background hides what slides under)
 *   3. full-height cells rows centre their cells by default, so the vertical
 *                        rules would only be as tall as the text
 *
 * Horizontal scrolling is the wrapper's `overflow-x-auto`: the columns total
 * ~2100px inside the pattern's 700.
 */
// The grid's whole treatment lives in `dataGridListView`.
</script>

<template>
  <div class="w-[700px] max-w-full">
    <!-- Browser-style tabs, as the design draws them, attached to the grid. -->
    <Tabs v-model="activeTab">
      <!--
        The variant lives on TabList when you compose the tabs yourself — on
        Tabs it only applies to the `tabs` shorthand.
      -->
      <!--
        `!border-b-0`: the browser-tab strip draws its own rule across the full
        width, which doubled up with the grid's top border and ran past its
        rounded corner. The grid's border is the only line now; the active tab
        already leaves its attached edge open.
      -->
      <TabList
        variant="browser-tab"
        size="sm"
        class="!border-b-0 [&_[data-slot=tab-indicator]]:border-b-0 [&_[data-slot=tab-indicator]]:after:inset-x-0"
      >
        <TabTrigger
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
      </TabList>
    </Tabs>

    <!--
      Scrolls sideways: the columns are ~2100px wide inside 700. 8px corners
      all round — the top left squares off only while the first tab is active
      and meets the grid there. The outline uses the same line colour as the
      cells (the design draws this one a shade darker, which read as a
      different line).
    -->
    <div
      class="overflow-x-auto rounded-4 border border-outline-gray-1"
      :class="{ 'rounded-tl-none': activeTab === tabs[0].value }"
    >
      <ListView
        :class="dataGridListView"
        :columns="columns"
        :rows="rows"
        row-key="id"
        :options="{ ...settingsListViewOptions, rowHeight: 40 }"
      >
        <template #default>
          <ListHeader>
            <ListHeaderItem
              v-for="column in columns"
              :key="column.key"
              :item="column"
              :class="column.key === 'no' ? 'justify-center' : ''"
            />
          </ListHeader>
          <ListRows />
        </template>

        <template #cell="{ row, column }">
          <!-- The serial number sits centred in its column, label and all. -->
          <span v-if="column.key === 'no'" class="text-base text-ink-gray-7">
            {{ row.id }}
          </span>
          <Badge
            v-else-if="column.key === 'status'"
            :label="row.status.label"
            :theme="row.status.theme"
            variant="subtle"
            size="md"
          />
          <span v-else class="truncate text-base text-ink-gray-6">
            {{ row[column.key] }}
          </span>
        </template>
      </ListView>
    </div>
  </div>
</template>
