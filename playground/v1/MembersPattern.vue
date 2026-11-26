<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Select,
  SettingsBody,
  SettingsContent,
  SettingsDialog,
  SettingsNavGroup,
  SettingsNavItem,
  SettingsPanel,
  SettingsSidebar,
  TextInput,
} from '../../src'
import {
  List,
  ListCell,
  ListHeader,
  ListHeaderCell,
  ListRow,
} from '../../src/molecules/list'
import * as pending from './pendingFrappeUIChanges'

const open = defineModel<boolean>('open', { default: false })

const activeTab = ref('members')
const search = ref('')

const navItems = [
  { value: 'general', label: 'General', icon: 'lucide-settings' },
  { value: 'members', label: 'Members', icon: 'lucide-circle-user-round' },
  { value: 'email-account', label: 'Email account', icon: 'lucide-mail' },
  {
    value: 'email-template',
    label: 'Email template',
    icon: 'lucide-file-text',
  },
  { value: 'data-import', label: 'Data import', icon: 'lucide-download' },
  { value: 'automation', label: 'Automation', icon: 'lucide-workflow' },
]

const roleOptions = [
  { label: 'Admin', value: 'Admin' },
  { label: 'Editor', value: 'Editor' },
  { label: 'Member', value: 'Member' },
  { label: 'Guest', value: 'Guest' },
]

// `status` replaces the old design's two separate treatments (an `Inactive`
// badge, and a `· Invite sent` suffix) with one field, since they occupy the
// same slot next to the name and never co-occur.
const members = ref([
  {
    id: 1,
    name: 'Jayaprakash',
    email: 'jayaprakash@timeless.co',
    role: 'Member',
    status: null,
  },
  {
    id: 2,
    name: 'Ella Thompson',
    email: 'ellathompson@frappe.io',
    role: 'Admin',
    status: null,
  },
  {
    id: 3,
    name: 'Olivia Martinez',
    email: 'oliviamartinez@frappe.io',
    role: 'Member',
    status: null,
  },
  {
    id: 4,
    name: 'Ryan Scott',
    email: 'ryanscott@frappe.io',
    role: 'Guest',
    status: null,
  },
  {
    id: 5,
    name: 'Grace Lee',
    email: 'gracelee@frappe.io',
    role: 'Guest',
    status: null,
  },
  {
    id: 6,
    name: 'Emily Carter',
    email: 'emilycarter@frappe.io',
    role: 'Member',
    status: null,
  },
  {
    id: 7,
    name: 'Sophia Turner',
    email: 'sophiaturner@frappe.io',
    role: 'Member',
    status: null,
  },
  {
    id: 8,
    name: 'Emma Brown',
    email: 'emma.b@frappe.io',
    role: 'Editor',
    status: 'inactive',
  },
  {
    id: 9,
    name: 'Liam Johnson',
    email: 'liam.j@frappe.io',
    role: 'Member',
    status: 'inactive',
  },
  {
    id: 10,
    name: 'Noah Clark',
    email: 'noah.c@frappe.io',
    role: 'Member',
    status: 'invited',
  },
  {
    id: 11,
    name: 'Olivia Bennett',
    email: 'oliviabennett@frappe.io',
    role: 'Guest',
    status: 'invited',
  },
])

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return members.value
  return members.value.filter(
    (m) =>
      m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q),
  )
})

const appOptions = [
  { label: 'CRM Members', onClick: () => {} },
  { label: 'Helpdesk Members', onClick: () => {} },
  { label: 'Insights Members', onClick: () => {} },
]

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
  <SettingsDialog
    v-model:open="open"
    v-model:tab="activeTab"
    :size="pending.dialogSize"
  >
    <SettingsSidebar :class="pending.sidebar">
      <div :class="pending.navGroups">
        <SettingsNavGroup label="App settings" :class="pending.navGroup">
          <SettingsNavItem
            v-for="item in navItems"
            :key="item.value"
            :value="item.value"
          >
            <template #prefix>
              <span :class="[item.icon, 'size-4 shrink-0 text-ink-gray-6']" />
            </template>
            {{ item.label }}
          </SettingsNavItem>
        </SettingsNavGroup>
      </div>
    </SettingsSidebar>

    <SettingsContent>
      <SettingsPanel value="members">
        <SettingsBody :class="pending.body">
          <div class="flex flex-col gap-8 pt-12">
            <section class="flex flex-col gap-6">
              <!-- Title row: app identity on the left, primary action right. -->
              <div class="flex items-center gap-2">
                <!--
                  The Frappe CRM mark from the design: its magenta (#DB4EE0,
                  sampled from the export — a brand colour, so deliberately not
                  a theme token) behind the funnel glyph the product uses.
                -->
                <!--
                  The whole header is the trigger, via Dropdown's `#trigger`
                  slot (it renders `as-child`, so the button below receives the
                  trigger props). Wrapped in the h2 so the heading semantics
                  survive the control.
                -->
                <h2 class="min-w-0">
                  <Dropdown :options="appOptions">
                    <template #trigger>
                      <button
                        type="button"
                        class="flex items-center gap-2 text-2xl-semibold text-ink-gray-8 transition-colors hover:text-ink-gray-7"
                      >
                        <span
                          class="flex size-7 shrink-0 items-center justify-center rounded-4 bg-[#DB4EE0]"
                          aria-hidden="true"
                        >
                          <span class="lucide-funnel size-4 text-white" />
                        </span>
                        CRM Members
                        <span
                          class="lucide-chevron-down size-4 shrink-0 text-ink-gray-5"
                          aria-hidden="true"
                        />
                      </button>
                    </template>
                  </Dropdown>
                </h2>
                <div class="ml-auto">
                  <Button variant="solid" icon-left="lucide-plus" label="Add" />
                </div>
              </div>

              <!-- Search + filter -->
              <div class="flex items-center gap-2">
                <TextInput
                  v-model="search"
                  class="flex-1"
                  size="sm"
                  :placeholder="`Search ${members.length} members`"
                >
                  <template #prefix>
                    <span class="lucide-search size-4 text-ink-gray-5" />
                  </template>
                </TextInput>
                <!-- `sm` to match the input beside it: both resolve to 28px. -->
                <!--
                  Espresso's filter mark is 16px square but its ink is only
                  13 x 7.66 — a short, wide glyph. Lucide's `list-filter` runs
                  its three rules across 12 of a 24 viewBox, so at `size-4` the
                  ink is 12.7 x 9.33: the same width but 22% taller, which is
                  what reads as the icon filling the button. 14px lands the ink
                  at 8.2 tall, matching the design's proportion; the mark comes
                  out ~1.9px narrower, which is the closer of the two misses.
                  Via `#prefix` because `icon-left` hard-codes `size-4`.
                -->
                <Button size="sm" label="Filter">
                  <template #prefix>
                    <span class="lucide-list-filter size-3.5" />
                  </template>
                </Button>
              </div>

              <!--
                Two controls per row (the role select and the actions menu), so
                the row itself is never a click target — same rule as the
                notifications matrix.
              -->
              <List
                class="list-row-px-0"
                :columns="['minmax(0,1fr)', '98px', '40px']"
              >
                <ListHeader>
                  <ListHeaderCell>Name</ListHeaderCell>
                  <!--
                    The ghost Select's own `px-2` insets its value, so the
                    header takes the same 8px to sit flush with the column of
                    roles beneath it, as in the design.
                  -->
                  <ListHeaderCell class="pl-2">Role</ListHeaderCell>
                  <ListHeaderCell
                    ><span class="sr-only">Actions</span></ListHeaderCell
                  >
                </ListHeader>

                <ListRow
                  v-for="member in filtered"
                  :key="member.id"
                  class="py-3"
                >
                  <ListCell class="gap-2">
                    <Avatar
                      size="lg"
                      :label="member.name"
                      class="shrink-0"
                      :class="{ 'opacity-50': member.status === 'inactive' }"
                    />
                    <div class="min-w-0">
                      <div class="flex items-center gap-1.5">
                        <span class="truncate text-base-medium text-ink-gray-8">
                          {{ member.name }}
                        </span>
                        <Badge
                          v-if="member.status === 'inactive'"
                          label="Inactive"
                        />
                        <span
                          v-else-if="member.status === 'invited'"
                          class="shrink-0 text-base text-ink-gray-5"
                        >
                          · Invite sent
                        </span>
                      </div>
                      <p class="mt-1 truncate text-p-base text-ink-gray-6">
                        {{ member.email }}
                      </p>
                    </div>
                  </ListCell>

                  <ListCell>
                    <!--
                      Select hugs its selected value by default, so a column of
                      them comes out ragged and the chevrons land at different
                      x. `w-full` pins every trigger to the column's width; the
                      chevron's own `ml-auto` then holds it against the right
                      edge, so the labels start on one line and the chevrons
                      finish on another.
                    -->
                    <Select
                      v-model="member.role"
                      class="w-full"
                      variant="ghost"
                      size="sm"
                      :options="roleOptions"
                      :aria-label="`Role for ${member.name}`"
                    />
                  </ListCell>

                  <ListCell class="justify-end">
                    <Dropdown
                      :options="rowActions(member.name)"
                      :button="{
                        variant: 'ghost',
                        icon: 'lucide-ellipsis',
                      }"
                    />
                  </ListCell>
                </ListRow>
              </List>
            </section>
          </div>
        </SettingsBody>
      </SettingsPanel>

      <SettingsPanel
        v-for="item in navItems.filter((i) => i.value !== 'members')"
        :key="item.value"
        :value="item.value"
      >
        <SettingsBody :class="pending.body">
          <div class="pt-12 text-base text-ink-gray-5">
            {{ item.label }} — not part of this pattern.
          </div>
        </SettingsBody>
      </SettingsPanel>
    </SettingsContent>
  </SettingsDialog>
</template>
