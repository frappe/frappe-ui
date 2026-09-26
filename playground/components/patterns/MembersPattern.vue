<script setup lang="ts">
import { reactive } from 'vue'
import { Avatar, Select } from '../../../src'
import { ListView } from '../../../experimental/ListView'
import { faceFor } from './designAssets'
import {
  espressoListViewStatic,
  espressoStaticOptions,
} from './listViewClasses'
import * as pending from '../../pendingFrappeUIChanges'

type Member = {
  id: number
  person: string
  email: string
  teams: string
  role: string
}

// The design draws no label row here. Every other table on this page has one
// and the columns are unreadable without it, so this one gets one too.
const columns = [
  { label: 'Name', key: 'person', width: '1fr' },
  { label: 'Teams', key: 'teams', width: '120px' },
  { label: 'Role', key: 'role', width: '120px' },
]

const teamOptions = ['1 team', '2 team', '3 team', '4 team', '5 team', '7 team', '8 team']
const roleOptions = ['Admin', 'Member', 'Guest', 'Can view']

const members = reactive<Member[]>([
  { id: 1, person: 'Shruti', email: 'shruti@gmail.com', teams: '2 team', role: 'Can view' },
  { id: 2, person: 'Sandeep', email: 'sandeepk@example.com', teams: '1 team', role: 'Can view' },
  { id: 3, person: 'Aaron Menezes', email: 'aaron@example.com', teams: '2 team', role: 'Member' },
  { id: 4, person: 'Abhishek Balam', email: 'abhishek@example.com', teams: '1 team', role: 'Guest' },
  { id: 5, person: 'Aditya', email: 'aditya@example.com', teams: '1 team', role: 'Member' },
  { id: 6, person: 'Brad Steel', email: 'brad@example.com', teams: '5 team', role: 'Member' },
  { id: 7, person: 'Daniel kapoor', email: 'danielk@example.com', teams: '7 team', role: 'Guest' },
  { id: 8, person: 'Alice Mcqire', email: 'alice@example.com', teams: '7 team', role: 'Member' },
  { id: 9, person: 'Steven James', email: 'steven@example.com', teams: '8 team', role: 'Admin' },
  { id: 10, person: 'Vaani Kapoor', email: 'vaani@example.com', teams: '4 team', role: 'Member' },
])

// `name` mirrors the id — ListView finds a selected row's neighbours by `name`.
const rows = members.map((member) => ({ ...member, name: member.id }))

/** ListView hands the cell slot its own copy of the row, so writes go here. */
const choice = reactive(
  Object.fromEntries(
    members.map((m) => [m.id, { teams: m.teams, role: m.role }]),
  ) as Record<number, { teams: string; role: string }>,
)
</script>

<template>
  <!-- The name column takes the slack; the two selects stay paired at the right. -->
  <div class="w-[1180px] max-w-full overflow-x-auto">
    <!--
      Two selects per row, so the row itself is never a click target — and
      with no row click ListView draws no hover, which is right here.
      62px rows, not 63: the settings-modal rule is 12px above and below a
      row's content so that content clears content by 24. ListView draws a 1px
      rule between rows where V1's list draws none, so 12 each side would come
      to 25 — 62 puts the gap back on 24.
    -->
    <ListView
      :class="`!w-full ${espressoListViewStatic} [&_.grid]:!px-0 [&_.grid.rounded-4.bg-surface-gray-2>*:nth-child(n+2)]:pl-2`"
      :columns="columns"
      :rows="rows"
      row-key="id"
      :options="{ ...espressoStaticOptions, rowHeight: 62 }"
    >
      <template #cell="{ row, column }">
        <span class="flex min-w-0 items-center gap-2">
          <template v-if="column.key === 'person'">
            <!-- 32px, as the design draws it. -->
            <Avatar
              size="xl"
              :image="faceFor((row as Member).person)"
              :label="(row as Member).person"
              class="shrink-0"
            />
            <span class="min-w-0">
              <span class="block truncate text-base-medium text-ink-gray-8">
                {{ (row as Member).person }}
              </span>
              <span class="mt-[2px] block truncate text-p-base text-ink-gray-6">
                {{ (row as Member).email }}
              </span>
            </span>
          </template>

          <!--
            `w-full` pins every trigger to the column's width so the labels
            start on one line and the chevrons finish on another. The ghost
            select keeps its own px-2 — it is what the hover and open states
            are drawn on — so the header label is inset by the same 8px to sit
            over the value, as in the settings modal.
          -->
          <Select
            v-else
            v-model="choice[(row as Member).id][column.key as 'teams' | 'role']"
            class="w-full"
            :class="pending.ghostSelectFocus"
            variant="ghost"
            size="sm"
            :options="column.key === 'teams' ? teamOptions : roleOptions"
            :aria-label="`${column.label} for ${(row as Member).person}`"
            @click.stop
          />
        </span>
      </template>
    </ListView>
  </div>
</template>
