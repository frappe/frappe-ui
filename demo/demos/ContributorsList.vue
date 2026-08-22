<script setup>
import { computed, ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { Avatar, Badge, Button } from 'frappe-ui'
import {
  List,
  ListCell,
  ListHeader,
  ListHeaderCell,
  ListHeaderCellSort,
  ListRow,
  ListRows,
} from 'frappe-ui/list'

const members = [
  {
    name: 'nadia',
    fullName: 'Nadia Haddad',
    email: 'nadia@example.com',
    image: 'https://i.pravatar.cc/150?img=12',
    team: 'Design systems',
    role: 'Maintainer',
    status: 'Active',
    commits: 412,
    lastActive: '2 m',
    lastActiveRank: 2,
  },
  {
    name: 'rosa',
    fullName: 'Rosa Diaz',
    email: 'rosa@example.com',
    image: 'https://i.pravatar.cc/150?img=45',
    team: 'Platform',
    role: 'Maintainer',
    status: 'Active',
    commits: 288,
    lastActive: '18 m',
    lastActiveRank: 18,
  },
  {
    name: 'evan',
    fullName: 'Evan You',
    email: 'evan@example.com',
    image: 'https://avatars.githubusercontent.com/u/499550?v=4',
    team: 'Core',
    role: 'Reviewer',
    status: 'Away',
    commits: 964,
    lastActive: '3 h',
    lastActiveRank: 180,
  },
  {
    name: 'priya',
    fullName: 'Priya Nair',
    email: 'priya@example.com',
    image: 'https://i.pravatar.cc/150?img=8',
    team: 'Docs',
    role: 'Writer',
    status: 'Active',
    commits: 137,
    lastActive: '40 m',
    lastActiveRank: 40,
  },
  {
    name: 'leo',
    fullName: 'Leo Park',
    email: 'leo@example.com',
    image: 'https://i.pravatar.cc/150?img=33',
    team: 'Platform',
    role: 'Contributor',
    status: 'Away',
    commits: 76,
    lastActive: '5 h',
    lastActiveRank: 300,
  },
  {
    name: 'ana',
    fullName: 'Ana Costa',
    email: 'ana@example.com',
    image: 'https://i.pravatar.cc/150?img=25',
    team: 'Design systems',
    role: 'Designer',
    status: 'Active',
    commits: 203,
    lastActive: '1 h',
    lastActiveRank: 60,
  },
  {
    name: 'terry',
    fullName: 'Terry Jeffords',
    email: 'terry@example.com',
    image: 'https://i.pravatar.cc/150?img=53',
    team: 'Core',
    role: 'Contributor',
    status: 'Invited',
    commits: 0,
    lastActive: 'Never',
    lastActiveRank: 99999,
  },
  {
    name: 'mara',
    fullName: 'Mara Singh',
    email: 'mara@example.com',
    // No image — the Avatar falls back to initials from `label`.
    team: 'Docs',
    role: 'Writer',
    status: 'Offline',
    commits: 58,
    lastActive: '2 d',
    lastActiveRank: 2880,
  },
  {
    name: 'sam',
    fullName: 'Sam Rivera',
    email: 'sam@example.com',
    image: 'https://i.pravatar.cc/150?img=15',
    team: 'Platform',
    role: 'Reviewer',
    status: 'Offline',
    commits: 341,
    lastActive: '4 d',
    lastActiveRank: 5760,
  },
]

const statusTheme = {
  Active: 'green',
  Away: 'amber',
  Invited: 'blue',
  Offline: 'gray',
}

// Sort state and the comparator are app code — the header cell only renders
// chrome for whatever `direction` it is handed.
const sortField = ref('lastActiveRank')
const sortDirection = ref('asc')

function toggleSort(field) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = typeof members[0][field] === 'string' ? 'asc' : 'desc'
  }
}

function directionFor(field) {
  return sortField.value === field ? sortDirection.value : null
}

const sortedMembers = computed(() => {
  const factor = sortDirection.value === 'desc' ? -1 : 1
  return [...members].sort((a, b) => {
    const field = sortField.value
    if (typeof a[field] === 'string') return factor * a[field].localeCompare(b[field])
    return factor * (a[field] - b[field])
  })
})

// Talk demo only: a deliberately unpolished version of the list, so the same
// page can show the before and the after. Keyboard-only and off by default, so
// nothing about it appears on screen. `b` toggles all three at once; `1`, `2`
// and `3` toggle one detail each, for a single-point comparison. `l` darkens
// the dividers and the hover surface, so the hover behaviour still reads on a
// projector.
const badDivider = ref(false)
const badHover = ref(false)
const badSort = ref(false)
const loud = ref(false)
useEventListener('keydown', (e) => {
  const flags = { 1: badDivider, 2: badHover, 3: badSort }
  if (e.key === 'b' || e.key === 'B') {
    const on = !(badDivider.value && badHover.value && badSort.value)
    badDivider.value = badHover.value = badSort.value = on
  } else if (e.key === 'l' || e.key === 'L') {
    loud.value = !loud.value
  } else if (flags[e.key]) {
    flags[e.key].value = !flags[e.key].value
  }
})

// Selection is a mode: the checkbox column stays hidden until it is on, and
// leaving the mode drops whatever was picked.
const selectMode = ref(false)
const selection = ref([])

function toggleSelectMode() {
  selectMode.value = !selectMode.value
  selection.value = []
}
</script>

<template>
  <div class="min-h-screen bg-surface-base p-6 text-ink-gray-9">
    <div class="mx-auto max-w-5xl">
      <!-- Toolbar: bulk actions once rows are picked, browse actions otherwise. -->
      <!-- px-3 matches the list's own row inset (`list-row-px-3`), so the title
           lines up with the Member column and the buttons with the last one. -->
      <div class="mb-4 flex h-8 items-center justify-between px-3">
        <div class="flex items-baseline gap-2">
          <h1 class="text-lg font-semibold text-ink-gray-9">Contributors</h1>
          <span class="text-sm text-ink-gray-5">
            {{ selection.length ? `${selection.length} selected` : `${members.length} people` }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <template v-if="selection.length">
            <Button label="Change role" icon-left="lucide-user-cog" />
            <Button theme="red" label="Remove" icon-left="lucide-trash-2" />
          </template>
          <template v-else-if="!selectMode">
            <Button label="Filter" icon-left="lucide-list-filter" />
            <Button variant="solid" label="Invite" icon-left="lucide-plus" />
          </template>
          <Button
            :variant="selectMode ? 'subtle' : 'outline'"
            :label="selectMode ? 'Done' : 'Select'"
            :icon-left="selectMode ? 'lucide-x' : 'lucide-square-check'"
            @click="toggleSelectMode"
          />
        </div>
      </div>

      <!-- The avatar track is a fixed 2rem (the xl Avatar), not `auto`: header
           and rows are separate grids, so an `auto` track collapses in the
           header's empty cell and pulls the labels out of line with the rows.
           `inset` dividers start at the name column, so the avatars sit clear
           of the rules, while `Member` spans the avatar and name tracks and
           stays flush with the avatars' left edge. -->
      <List
        class="w-full list-row-px-3"
        :class="[
          badHover && 'demo-bad-hover',
          badSort && 'demo-bad-sort',
          loud && 'demo-loud',
        ]"
        :columns="['2rem', 'minmax(0,1fr)', '9rem', '7rem', '6rem', '6rem']"
        :divider="badDivider ? 'full' : 'inset'"
        :row-height="60"
        :selectable="selectMode"
        v-model:selection="selection"
      >
        <ListHeader>
          <ListHeaderCellSort
            class="col-span-2"
            :direction="directionFor('fullName')"
            @click="toggleSort('fullName')"
          >
            Member
          </ListHeaderCellSort>
          <ListHeaderCellSort
            :direction="directionFor('team')"
            @click="toggleSort('team')"
          >
            Team
          </ListHeaderCellSort>
          <ListHeaderCell>Status</ListHeaderCell>
          <ListHeaderCellSort
            :direction="directionFor('commits')"
            align="end"
            @click="toggleSort('commits')"
          >
            Commits
          </ListHeaderCellSort>
          <ListHeaderCellSort
            :direction="directionFor('lastActiveRank')"
            align="end"
            @click="toggleSort('lastActiveRank')"
          >
            Active
          </ListHeaderCellSort>
        </ListHeader>

        <ListRows :items="sortedMembers" v-slot="{ item: member, value }">
          <ListRow :value="value" @click="() => {}">
            <ListCell>
              <Avatar :label="member.fullName" :image="member.image" size="xl" />
            </ListCell>
            <ListCell>
              <div class="min-w-0">
                <div class="truncate text-base text-ink-gray-8">
                  {{ member.fullName }}
                </div>
                <div class="mt-1 truncate text-sm text-ink-gray-5">
                  {{ member.email }} · {{ member.role }}
                </div>
              </div>
            </ListCell>
            <ListCell>
              <span class="truncate text-base text-ink-gray-7">{{ member.team }}</span>
            </ListCell>
            <ListCell>
              <Badge :theme="statusTheme[member.status]" :label="member.status" />
            </ListCell>
            <ListCell class="justify-end">
              <span class="tabular-nums text-base text-ink-gray-7">
                {{ member.commits }}
              </span>
            </ListCell>
            <ListCell class="justify-end">
              <span class="text-sm text-ink-gray-5">{{ member.lastActive }}</span>
            </ListCell>
          </ListRow>
        </ListRows>
      </List>
    </div>
  </div>
</template>

<style>
/* Talk demo only. These classes undo two of the list's own details so the
   polished behaviour has something to be compared against. */

/* Keep the rules above and below a hovered row, instead of dropping them.
   Scoped to a row that follows another row, so the first row's absent
   divider-above stays absent. */
.demo-bad-hover
  [data-slot='list-row']
  + [data-slot='list-row'][data-interactive]:hover
  [data-slot='list-divider'],
.demo-bad-hover
  [data-slot='list-row'][data-interactive]:hover
  + [data-slot='list-row']
  [data-slot='list-divider'] {
  opacity: 1;
}

/* Darken the dividers and the hover surface for a projector, each one token
   step up its own scale rather than an invented colour. */
.demo-loud [data-slot='list-divider'],
.demo-loud [data-slot='list-header-border'] {
  border-color: var(--outline-gray-3);
}
.demo-loud [data-slot='list-row'][data-interactive]:hover {
  background-color: var(--surface-gray-2);
}

/* Put the sort glyph after the label on right-aligned columns, so the label
   no longer sits flush with the values below it. */
.demo-bad-sort [data-slot='list-header-cell'].justify-end button {
  flex-direction: row-reverse;
}
</style>
