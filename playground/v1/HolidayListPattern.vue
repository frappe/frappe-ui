<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import {
  Avatar,
  Button,
  Divider,
  Select,
  SettingsBody,
  SettingsContent,
  SettingsDialog,
  SettingsNavGroup,
  SettingsNavItem,
  SettingsPanel,
  SettingsSidebar,
  Switch,
  TabButtons,
  Textarea,
  TextInput,
} from '../../src'
import SettingsCell from './SettingsCell.vue'
import HolidayCalendar from './HolidayCalendar.vue'
import * as pending from './pendingFrappeUIChanges'

const open = defineModel<boolean>('open', { default: false })

const activeTab = ref('holiday-list')

const name = ref('New schedule')
const description = ref('A basic set of commonly observed holidays India')
const associate = ref(true)
const predefined = ref('Default holiday list')
const holidayView = ref('calendar')

const appNav = [
  { value: 'general', label: 'General', icon: 'lucide-settings' },
  { value: 'sla', label: 'SLA policies', icon: 'lucide-shield-check' },
  {
    value: 'holiday-list',
    label: 'Holiday list',
    icon: 'lucide-calendar-days',
  },
  { value: 'assignment', label: 'Assignment rules', icon: 'lucide-git-fork' },
  { value: 'email', label: 'Email accounts', icon: 'lucide-mail' },
  { value: 'automation', label: 'Automation', icon: 'lucide-workflow' },
  {
    value: 'field-dependency',
    label: 'Field dependency',
    icon: 'lucide-sliders-horizontal',
  },
  { value: 'misc', label: 'Miscellaneous', icon: 'lucide-ellipsis' },
]

const predefinedOptions = [
  'Default holiday list',
  'India — national',
  'US — federal',
].map((v) => ({ label: v, value: v }))

const viewOptions = [
  { value: 'list', label: 'List view', icon: 'lucide-list' },
  { value: 'calendar', label: 'Calendar view', icon: 'lucide-calendar' },
]

// A plausible Indian holiday set for the current year, so the calendar has
// something to mark. The old file hardcoded 2025.
const y = dayjs().year()
const holidays = [
  `${y}-01-01`,
  `${y}-01-13`,
  `${y}-01-14`,
  `${y}-01-26`,
  `${y}-02-02`,
  `${y}-02-12`,
  `${y}-02-19`,
  `${y}-02-23`,
  `${y}-02-26`,
  `${y}-03-14`,
  `${y}-03-30`,
  `${y}-04-06`,
  `${y}-04-10`,
  `${y}-04-13`,
  `${y}-04-14`,
  `${y}-04-18`,
  `${y}-04-20`,
  `${y}-05-01`,
  `${y}-05-07`,
  `${y}-05-09`,
  `${y}-05-12`,
  `${y}-05-14`,
  `${y}-05-21`,
  `${y}-05-28`,
  `${y}-05-30`,
  `${y}-06-07`,
  `${y}-06-09`,
  `${y}-08-15`,
  `${y}-10-02`,
  `${y}-10-20`,
  `${y}-12-25`,
]
</script>

<template>
  <SettingsDialog
    v-model:open="open"
    v-model:tab="activeTab"
    :size="pending.dialogSize"
  >
    <SettingsSidebar :class="pending.sidebar">
      <div :class="pending.navGroups">
        <SettingsNavGroup label="User settings" :class="pending.navGroup">
          <SettingsNavItem value="profile">
            <template #prefix>
              <Avatar size="xs" label="Gowtham" class="shrink-0" />
            </template>
            Profile
          </SettingsNavItem>
          <SettingsNavItem value="notifications">
            <template #prefix>
              <span class="lucide-bell size-4 shrink-0 text-ink-gray-6" />
            </template>
            Notifications
          </SettingsNavItem>
        </SettingsNavGroup>

        <SettingsNavGroup label="App settings" :class="pending.navGroup">
          <SettingsNavItem
            v-for="item in appNav"
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
      <SettingsPanel value="holiday-list">
        <SettingsBody :class="pending.body">
          <div class="flex flex-col gap-8 pt-12">
            <!-- Title row: back, name, and the save/cancel pair. -->
            <section class="flex flex-col gap-6">
              <div class="flex items-center gap-2">
                <!--
                  The chevron and the heading are one target, as the design
                  reads them: a single back affordance that dims a step on
                  hover. `-ml-[5px]` cancels the chevron glyph's own left
                  bearing so its stroke lines up with the text below.
                -->
                <h2 class="min-w-0">
                  <button
                    type="button"
                    class="flex items-center gap-2 text-2xl-semibold text-ink-gray-8 transition-colors hover:text-ink-gray-7"
                    @click="open = false"
                  >
                    <span
                      class="lucide-chevron-left -ml-[5px] size-4 shrink-0"
                      aria-hidden="true"
                    />
                    New schedule
                  </button>
                </h2>
                <div class="ml-auto flex items-center gap-2">
                  <Button label="Cancel" @click="open = false" />
                  <Button variant="solid" label="Save" />
                </div>
              </div>

              <SettingsCell title="Total holidays (Calculated automatically)">
                <TextInput
                  class="w-[220px]"
                  size="md"
                  disabled
                  :model-value="`${holidays.length} Holidays`"
                />
              </SettingsCell>

              <!-- The design rules off the calculated total from the fields. -->
              <Divider :class="pending.divider" />

              <div class="flex gap-5">
                <TextInput
                  v-model="name"
                  class="flex-1"
                  size="md"
                  label="Name"
                  required
                />
                <Textarea
                  v-model="description"
                  class="flex-1"
                  size="md"
                  label="Description"
                  required
                  :rows="3"
                />
              </div>
            </section>

            <Divider :class="pending.divider" />

            <!-- Associate an existing list -->
            <section class="flex flex-col gap-6">
              <SettingsCell
                title="Associate holiday list"
                description="Link a holiday list to skip business hours on specified dates."
                label-for="associate-holiday-list"
              >
                <Switch
                  id="associate-holiday-list"
                  size="md"
                  v-model="associate"
                />
              </SettingsCell>
              <SettingsCell
                v-if="associate"
                title="Select from pre defined holiday list"
                label-for="predefined-holiday-list"
              >
                <Select
                  id="predefined-holiday-list"
                  v-model="predefined"
                  :options="predefinedOptions"
                />
              </SettingsCell>
            </section>

            <Divider :class="pending.divider" />

            <!-- Holidays -->
            <section class="flex flex-col gap-6">
              <div class="flex items-start justify-between gap-4">
                <div class="flex min-w-0 flex-col gap-1">
                  <h3 class="text-lg-semibold text-ink-gray-8">Holidays</h3>
                  <p class="text-p-base text-ink-gray-6">
                    Add holidays here to make sure they're excluded from SLA
                    calculations.
                  </p>
                </div>
                <TabButtons v-model="holidayView" :options="viewOptions" />
              </div>

              <HolidayCalendar
                v-if="holidayView === 'calendar'"
                :holidays="holidays"
              />
              <div
                v-else
                class="rounded-5 border border-outline-gray-1 p-4 text-p-base text-ink-gray-5"
              >
                The list view is not part of this pattern.
              </div>

              <Button
                class="self-start"
                icon-left="lucide-plus"
                label="Add holiday"
              />
            </section>
          </div>
        </SettingsBody>
      </SettingsPanel>

      <SettingsPanel
        v-for="item in [
          { value: 'profile' },
          { value: 'notifications' },
          ...appNav.filter((i) => i.value !== 'holiday-list'),
        ]"
        :key="item.value"
        :value="item.value"
      >
        <SettingsBody :class="pending.body">
          <div class="pt-12 text-base text-ink-gray-5">
            Not part of this pattern.
          </div>
        </SettingsBody>
      </SettingsPanel>
    </SettingsContent>
  </SettingsDialog>
</template>
