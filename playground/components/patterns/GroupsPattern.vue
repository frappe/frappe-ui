<script setup lang="ts">
import { ref } from 'vue'
import { Avatar } from '../../../src'
import { ListView } from '../../../experimental/ListView'
import { faceFor, logos } from './designAssets'
import { espressoListView, espressoListViewGroups } from './listViewClasses'
import StageRing from '../icons/StageRing.vue'

type Stage = 'Qualification' | 'Demo' | 'Proposal' | 'Negotiation'

type Deal = {
  id: number
  name: number
  organisation: string
  amount: string
  status: Stage
  email: string
  mobile: string
  assignee: string
  modified: string
}

// The stage ring's colour, sampled off the file's group rows: gray while the
// deal is still being qualified, then blue, amber and pink as it moves on.
const stageToken: Record<Stage, string> = {
  Qualification: '--surface-gray-6',
  Demo: '--surface-blue-6',
  Proposal: '--surface-amber-6',
  Negotiation: '--surface-pink-6',
}

// Column widths as the file draws them (node 35171:100039). ListView owns the
// checkbox column. No `prefix`: with a `#cell` slot in play ListView renders
// that slot alone and never reaches ListRowItem, so the logos, the ring, the
// avatars and the phone glyph are all part of the cell below.
const columns = [
  { label: 'Organisation', key: 'organisation', width: '120px' },
  { label: 'Amount', key: 'amount', width: '144px' },
  { label: 'Status', key: 'status', width: '144px' },
  { label: 'Email', key: 'email', width: '216px' },
  { label: 'Mobile no.', key: 'mobile', width: '184px' },
  { label: 'Assigned to', key: 'assignee', width: '168px' },
  { label: 'Last modified', key: 'modified', width: '120px' },
]

// The file repeats one row under every heading to show the shape; these are
// twelve different deals, each sitting in the stage its own Status cell
// reports. Group sizes vary, which is what a real pipeline looks like — the
// deals bunch up in the middle and thin out at the end.
//
// `name` mirrors the id: ListView looks up a selected row's neighbours by
// `name` when it decides the block's corners and the rule between rows.
function deal(
  id: number,
  organisation: string,
  amount: string,
  status: Stage,
  email: string,
  mobile: string,
  assignee: string,
  modified: string,
): Deal {
  return {
    id,
    name: id,
    organisation,
    amount,
    status,
    email,
    mobile,
    assignee,
    modified,
  }
}

// `ref`, not a plain array: the chevron collapses a group by writing
// `group.collapsed`, which only redraws anything if the array Vue handed the
// list is reactive.
const groups = ref([
  {
    group: 'Qualification' as Stage,
    collapsed: false,
    rows: [
      deal(1, 'Github', '₹ 4,70,000', 'Qualification', 'hannah@example.com', '+91 2224445555', 'Karan Bhatia', '1 month ago'),
      deal(2, 'Gumroad', '₹ 6,20,000', 'Qualification', 'nora@example.com', '+91 4448887777', 'Ankit Mehta', '3 days ago'),
      deal(3, 'Cooper', '₹ 5,90,000', 'Qualification', 'olivia@example.com', '+91 7774442222', 'Nishant Iyer', '3 days ago'),
      deal(4, 'Hourglass', '₹ 2,15,000', 'Qualification', 'emile@example.com', '+91 9991112222', 'Karan Bhatia', 'Yesterday'),
    ],
  },
  {
    group: 'Demo' as Stage,
    collapsed: false,
    rows: [
      deal(5, 'Dropbox', '₹ 11,40,000', 'Demo', 'marcus@example.com', '+91 8006663333', 'Priya Nair', '5 days ago'),
      deal(6, 'Miro', '₹ 8,75,000', 'Demo', 'lena@example.com', '+91 9012345678', 'Ankit Mehta', '2 weeks ago'),
      deal(7, 'Zapier', '₹ 3,30,000', 'Demo', 'theo@example.com', '+91 7778889999', 'Nishant Iyer', '6 hours ago'),
    ],
  },
  {
    group: 'Proposal' as Stage,
    collapsed: false,
    rows: [
      deal(8, 'Figma', '₹ 18,50,000', 'Proposal', 'clara@example.com', '+91 9884443210', 'Priya Nair', '4 days ago'),
      deal(9, 'Metalab', '₹ 9,20,000', 'Proposal', 'jonas@example.com', '+91 9765432100', 'Devika Rao', '1 week ago'),
      deal(10, 'Attentive', '₹ 7,05,000', 'Proposal', 'ruth@example.com', '+91 9345671289', 'Karan Bhatia', '2 days ago'),
    ],
  },
  {
    group: 'Negotiation' as Stage,
    collapsed: false,
    rows: [
      deal(11, 'Spotify', '₹ 24,80,000', 'Negotiation', 'amelie@example.com', '+91 9900112233', 'Devika Rao', '1 day ago'),
      deal(12, '1password', '₹ 13,60,000', 'Negotiation', 'sven@example.com', '+91 9822334455', 'Priya Nair', '3 weeks ago'),
    ],
  },
])

const opened = ref<string | null>(null)
</script>

<template>
  <!--
    The same 1180px table as the rest, with its rows gathered under the stage
    each deal is in. ListView does the grouping itself the moment its rows
    arrive as `{ group, rows }`; `espressoListViewGroups` is what makes the
    heading read the way the file draws it.
  -->
  <div class="w-[1180px] max-w-full overflow-x-auto">
    <ListView
      :class="`w-max ${espressoListView} ${espressoListViewGroups}`"
      :columns="columns"
      :rows="groups"
      row-key="id"
      :options="{
        selectable: true,
        showTooltip: false,
        rowHeight: 40,
        onRowClick: (row: Deal) => (opened = row.organisation),
      }"
    >
      <!--
        The heading names the field it grouped by, then the value with its own
        stage ring. ListView draws the chevron before this; everything after
        it is here, at the file's 8px to the ring and 4 from the ring to the
        value.
      -->
      <template #group-header="{ group }">
        <span
          class="flex items-center gap-2 text-base-medium text-ink-gray-9"
        >
          Status -
          <span class="flex items-center gap-1">
            <StageRing :token="stageToken[(group.group as Stage)]" />
            {{ group.group }}
          </span>
        </span>
      </template>

      <!-- One wrapper per cell: ListView's cell box isn't a flex row, so the
           logo, the ring and the text are spaced here. -->
      <template #cell="{ item, row, column }">
        <span class="flex min-w-0 items-center gap-2">
          <Avatar
            v-if="column.key === 'organisation'"
            size="sm"
            shape="square"
            :image="logos[(row as Deal).organisation]"
            :label="(row as Deal).organisation"
          />
          <Avatar
            v-else-if="column.key === 'assignee'"
            size="sm"
            :image="faceFor((row as Deal).assignee)"
            :label="(row as Deal).assignee"
          />
          <span
            v-else-if="column.key === 'mobile'"
            class="lucide-phone size-4 shrink-0 text-ink-gray-5"
            aria-hidden="true"
          />
          <StageRing
            v-else-if="column.key === 'status'"
            :token="stageToken[(row as Deal).status]"
          />

          <!-- The organisation carries the row: medium, in ink-gray-8. -->
          <span
            class="truncate"
            :class="
              column.key === 'organisation'
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
