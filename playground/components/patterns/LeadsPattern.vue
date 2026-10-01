<script setup lang="ts">
import { ref } from 'vue'
import { Avatar } from '../../../src'
import { ListView } from '../../../experimental/ListView'
import { faceFor, logos } from './designAssets'
import { espressoListView } from './listViewClasses'
import StatusDot from '../icons/StatusDot.vue'
import CallIcon from '../icons/CallIcon.vue'

type Status =
  | 'Open'
  | 'Contacted'
  | 'Nurture'
  | 'Qualified'
  | 'Unqualified'
  | 'Junk'

type Lead = {
  id: number
  person: string
  organisation: string
  status: Status
  email: string
  mobile: string
  assignee: string
  modified: string
}

// The theme variable each stage's dot takes its colour from. The `-6` step is
// the saturated one in each family, which is what the design draws.
const statusToken: Record<Status, string> = {
  Open: '--surface-gray-6',
  Contacted: '--surface-amber-6',
  Nurture: '--surface-blue-6',
  Qualified: '--surface-green-6',
  Unqualified: '--surface-red-6',
  Junk: '--surface-violet-6',
}

// Column widths as the design draws them. ListView owns the checkbox column.
// No `prefix` here: with a `#cell` slot in play ListView renders that slot
// alone and never reaches ListRowItem, where `column.prefix` would be drawn —
// so the avatars and the phone glyph are part of the cell below.
const columns = [
  { label: 'Name', key: 'person', width: '170px' },
  { label: 'Organisation', key: 'organisation', width: '144px' },
  { label: 'Status', key: 'status', width: '144px' },
  { label: 'Email', key: 'email', width: '216px' },
  { label: 'Mobile no.', key: 'mobile', width: '184px' },
  { label: 'Assigned to', key: 'assignee', width: '168px' },
  { label: 'Last modified', key: 'modified', width: '120px' },
]

// `name` mirrors the id: ListView looks up a selected row's neighbours by
// `name` when it decides the block's corners and the rule between rows.
const leads: Lead[] = [
  {
    id: 1,
    person: 'Jenny Wilson',
    organisation: 'Gumroad',
    status: 'Open',
    email: 'stacy@example.com',
    mobile: '+91 9994445678',
    assignee: 'Avinash Goel',
    modified: '2 days ago',
  },
  {
    id: 2,
    person: 'Mariana Rodriguez',
    organisation: 'Attentive',
    status: 'Contacted',
    email: 'mariana@example.com',
    mobile: '+91 8885556789',
    assignee: 'Rahul Sharma',
    modified: '1 week ago',
  },
  {
    id: 3,
    person: 'Sophie Chen',
    organisation: 'Evergreen',
    status: 'Nurture',
    email: 'sophie@example.com',
    mobile: '+91 7773335678',
    assignee: 'Elena Petrova',
    modified: '3 days ago',
  },
  {
    id: 4,
    person: 'David Lee',
    organisation: 'Dropbox',
    status: 'Qualified',
    email: 'david@example.com',
    mobile: '+91 6662225678',
    assignee: 'Priya Patel',
    modified: '4 days ago',
  },
  {
    id: 5,
    person: 'Maria Gomez',
    organisation: 'Hourglass',
    status: 'Unqualified',
    email: 'maria@example.com',
    mobile: '+91 5554445678',
    assignee: 'James Smith',
    modified: '5 days ago',
  },
  {
    id: 6,
    person: 'Anika Sharma',
    organisation: 'Miro',
    status: 'Nurture',
    email: 'anika@example.com',
    mobile: '+91 4443335678',
    assignee: 'Mark Johnson',
    modified: '6 days ago',
  },
  {
    id: 7,
    person: 'Liam Brown',
    organisation: 'Zapier',
    status: 'Junk',
    email: 'liam@example.com',
    mobile: '+91 3332225678',
    assignee: 'Olivia Martinez',
    modified: '1 week ago',
  },
  {
    id: 8,
    person: 'Daniel Kim',
    organisation: 'Figma',
    status: 'Contacted',
    email: 'daniel@example.com',
    mobile: '+91 2221115678',
    assignee: 'Isabella Davis',
    modified: '1 week ago',
  },
  {
    id: 9,
    person: 'Nina Lee',
    organisation: '1password',
    status: 'Open',
    email: 'nina@example.com',
    mobile: '+91 1110005678',
    assignee: 'Ethan Wilson',
    modified: '8 days ago',
  },
  {
    id: 10,
    person: 'Avery Clark',
    organisation: 'Cooper',
    status: 'Qualified',
    email: 'avery@example.com',
    mobile: '+91 9998885678',
    assignee: 'Mia Thompson',
    modified: '9 days ago',
  },
  {
    id: 11,
    person: 'Lucas White',
    organisation: 'ChatGpt',
    status: 'Junk',
    email: 'lucas@example.com',
    mobile: '+91 8887775678',
    assignee: 'Ella Hill',
    modified: '10 days ago',
  },
  {
    id: 12,
    person: 'Chloe Allen',
    organisation: 'Github',
    status: 'Contacted',
    email: 'chloe@example.com',
    mobile: '+91 7776665678',
    assignee: 'Noah Scott',
    modified: '11 days ago',
  },
  {
    id: 13,
    person: 'Evelyn Young',
    organisation: 'Metalab',
    status: 'Open',
    email: 'evelyn@example.com',
    mobile: '+91 6665555678',
    assignee: 'Alexander King',
    modified: '12 days ago',
  },
  {
    id: 14,
    person: 'Nathan Green',
    organisation: 'Adobe Express',
    status: 'Unqualified',
    email: 'nathan@example.com',
    mobile: '+91 5554445678',
    assignee: 'Sofia Walker',
    modified: '13 days ago',
  },
  {
    id: 15,
    person: 'Grace Roberts',
    organisation: 'Spotify',
    status: 'Junk',
    email: 'grace@example.com',
    mobile: '+91 4443335678',
    assignee: 'Henry Allen',
    modified: '14 days ago',
  },
]

const rows = leads.slice(0, 10).map((lead) => ({ ...lead, name: lead.id }))

const opened = ref<string | null>(null)
</script>

<template>
  <!--
    1180px of table; a wider set of columns scrolls sideways inside it.
    Built on the experimental ListView, which brings its own checkbox column,
    the 40px row and the row hover. `onRowClick` is what switches that hover
    on — ListView treats a row as hoverable only when it is clickable or
    routed.
  -->
  <div class="w-[1180px] max-w-full overflow-x-auto">
    <!--
      ListView's label row is a filled, rounded bar with 8px under it. Here it
      is a plain 32px row sitting straight on top of the first row: no fill, no
      gap, and a single outline-gray-1 rule under it. (`!h-8` because its own
      bar lands at 31 — its label line is 15.)
    -->
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
        onRowClick: (row: Lead) => (opened = row.person),
      }"
    >
      <!-- One wrapper per cell: ListView's cell box isn't a flex row, so the
           avatar, the dot and the text are spaced here. -->
      <template #cell="{ item, row, column }">
        <span class="flex min-w-0 items-center gap-2">
          <Avatar
            v-if="column.key === 'person'"
            size="sm"
            :image="faceFor((row as Lead).person)"
            :label="(row as Lead).person"
          />
          <Avatar
            v-else-if="column.key === 'organisation'"
            size="sm"
            shape="square"
            :image="logos[(row as Lead).organisation]"
            :label="(row as Lead).organisation"
          />
          <Avatar
            v-else-if="column.key === 'assignee'"
            size="sm"
            :image="faceFor((row as Lead).assignee)"
            :label="(row as Lead).assignee"
          />
          <!-- Espresso's own handset (component 23447:5069), in the same
               ink as the number beside it. -->
          <CallIcon
            v-else-if="column.key === 'mobile'"
            class="text-ink-gray-6"
            aria-hidden="true"
          />
          <!-- Espresso's own dot glyph, exported from the design file. -->
          <StatusDot
            v-else-if="column.key === 'status'"
            :token="statusToken[(row as Lead).status]"
          />

          <!-- The lead's own name is the one medium, ink-gray-8 cell in a row. -->
          <span
            class="truncate"
            :class="
              column.key === 'person'
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
