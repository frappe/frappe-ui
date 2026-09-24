<script setup lang="ts">
import { ref } from 'vue'
import { Avatar, Badge, Dropdown, Select } from '../../../src'
import { faceFor } from '../../components/patterns/designAssets'
import {
  List,
  ListCell,
  ListHeader,
  ListHeaderCell,
  ListRow,
} from '../../../src/molecules/list'

const roleOptions = [
  { label: 'Admin', value: 'Admin' },
  { label: 'Editor', value: 'Editor' },
  { label: 'Member', value: 'Member' },
  { label: 'Guest', value: 'Guest' },
]

// Five rows is enough to show the pattern, including the inactive state.
const members = ref([
  {
    id: 1,
    name: 'Jayaprakash',
    email: 'jayaprakash@frappe.io',
    role: 'Member',
    inactive: false,
  },
  {
    id: 2,
    name: 'Ella Thompson',
    email: 'ellathompson@frappe.io',
    role: 'Admin',
    inactive: false,
  },
  {
    id: 3,
    name: 'Olivia Martinez',
    email: 'oliviamartinez@frappe.io',
    role: 'Member',
    inactive: false,
  },
  {
    id: 4,
    name: 'Ryan Scott',
    email: 'ryanscott@frappe.io',
    role: 'Guest',
    inactive: false,
  },
  {
    id: 5,
    name: 'Emma Brown',
    email: 'emma.b@frappe.io',
    role: 'Editor',
    inactive: true,
  },
])

function rowActions(name: string) {
  return [
    { label: 'Resend invite', icon: 'lucide-send', onClick: () => {} },
    { label: 'Copy email', icon: 'lucide-copy', onClick: () => {} },
    {
      label: `Remove ${name}`,
      icon: 'lucide-user-minus',
      theme: 'red' as const,
      onClick: () => {},
    },
  ]
}
</script>

<template>
  <!--
    frappe-ui's List family in table mode. Each row holds two controls (the
    role select and the actions menu), so rows stay static — only the controls
    are interactive. `list-row-px-0`: no inset, so the avatar and the "Name"
    label sit flush with the pattern's left edge.
  -->
  <List
    class="w-[700px] max-w-full list-row-px-0 [&_[data-slot=list-header]]:!h-10"
    :columns="['minmax(0,1fr)', '98px', '40px']"
  >
    <ListHeader>
      <ListHeaderCell>Name</ListHeaderCell>
      <!--
        The ghost Select insets its value by its own `px-2`, so the header
        takes the same 8px to line up with the roles beneath it.
      -->
      <ListHeaderCell class="pl-2">Role</ListHeaderCell>
      <ListHeaderCell><span class="sr-only">Actions</span></ListHeaderCell>
    </ListHeader>

    <!-- 13px above and below the 39px name/email block: the design's 65px row. -->
    <ListRow v-for="member in members" :key="member.id" class="py-3">
      <ListCell class="gap-2">
        <!--
          A photo for everyone who has actually joined; the inactive row keeps
          its initial, which is what an account with no one behind it shows.
        -->
        <Avatar
          size="xl"
          :label="member.name"
          :image="member.inactive ? undefined : faceFor(member.name)"
          class="shrink-0"
          :class="{ 'opacity-50': member.inactive }"
        />
        <div class="min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="truncate text-base-medium text-ink-gray-7">
              {{ member.name }}
            </span>
            <!-- `sm` (16px): an `md` badge is 20 and made this one row 4px
                 taller than the rest. -->
            <Badge v-if="member.inactive" label="Inactive" size="sm" />
          </div>
          <p class="mt-0.5 truncate text-p-base text-ink-gray-5">
            {{ member.email }}
          </p>
        </div>
      </ListCell>

      <ListCell>
        <!--
          `w-full` pins every select to the column's width, so the role labels
          start on one line and the chevrons finish on another.
        -->
        <Select
          v-model="member.role"
          class="w-full"
          variant="ghost"
          size="sm"
          :options="roleOptions"
          placeholder="Select role"
          :aria-label="`Role for ${member.name}`"
        />
      </ListCell>

      <ListCell class="justify-end">
        <Dropdown
          :options="rowActions(member.name)"
          :button="{
            variant: 'ghost',
            icon: 'lucide-ellipsis',
            'aria-label': `Actions for ${member.name}`,
          }"
        />
      </ListCell>
    </ListRow>
  </List>
</template>
