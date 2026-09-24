<script setup lang="ts">
import { ref } from 'vue'
import {
  Avatar,
  Button,
  Divider,
  Radio,
  RadioGroup,
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
} from '../../src'
import SettingsCell from './SettingsCell.vue'
import * as pending from './pendingFrappeUIChanges'

const open = defineModel<boolean>('open', { default: false })

const activeTab = ref('calendar')

const defaultView = ref('week')
const defaultCalendar = ref('gowtham@frappe.io')
const timeFormat = ref('12hrs')
const startDay = ref('Monday')
const defaultDuration = ref('30 mins')
const eventNotifications = ref(false)
const allDayNotifications = ref(true)

const views = [
  { value: 'day', label: 'Day', caption: 'Monday' },
  { value: 'week', label: 'Week', caption: 'May / W32' },
  { value: 'month', label: 'Month', caption: 'May 2025' },
]

const calendarOptions = [
  { label: 'gowtham@frappe.io', value: 'gowtham@frappe.io' },
  { label: 'team@frappe.io', value: 'team@frappe.io' },
]
const timeFormatOptions = [
  { label: '12hrs', value: '12hrs' },
  { label: '24hrs', value: '24hrs' },
]
const startDayOptions = [
  { label: 'Sunday', value: 'Sunday' },
  { label: 'Monday', value: 'Monday' },
]
const durationOptions = ['15 mins', '30 mins', '45 mins', '1 hour'].map(
  (d) => ({
    label: d,
    value: d,
  }),
)

const channelOptions = [
  { label: 'In-app notification', value: 'in-app' },
  { label: 'Email notification', value: 'email' },
]
const countOptions = [1, 2, 5, 10, 15, 30].map((n) => ({
  label: String(n),
  value: n,
}))
const unitOptions = ['Mins before', 'Hour before', 'Day before'].map((u) => ({
  label: u,
  value: u,
}))

let nextId = 4
const allDayReminders = ref([
  { id: 1, channel: 'in-app', count: 1, unit: 'Hour before' },
  { id: 2, channel: 'email', count: 2, unit: 'Day before' },
  { id: 3, channel: 'in-app', count: 30, unit: 'Mins before' },
])

function addReminder() {
  allDayReminders.value.push({
    id: nextId++,
    channel: 'in-app',
    count: 30,
    unit: 'Mins before',
  })
}
function removeReminder(id: number) {
  allDayReminders.value = allDayReminders.value.filter((r) => r.id !== id)
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
          <SettingsNavItem value="general">
            <template #prefix>
              <span class="lucide-settings size-4 shrink-0 text-ink-gray-6" />
            </template>
            General
          </SettingsNavItem>
          <SettingsNavItem value="members">
            <template #prefix>
              <span
                class="lucide-circle-user-round size-4 shrink-0 text-ink-gray-6"
              />
            </template>
            Members
          </SettingsNavItem>
          <SettingsNavItem value="calendar">
            <template #prefix>
              <span class="lucide-calendar size-4 shrink-0 text-ink-gray-6" />
            </template>
            Calendar
          </SettingsNavItem>
        </SettingsNavGroup>

        <SettingsNavGroup label="Integrations" :class="pending.navGroup">
          <SettingsNavItem value="google">
            <template #prefix>
              <span class="lucide-chrome size-4 shrink-0 text-ink-gray-6" />
            </template>
            Google
          </SettingsNavItem>
        </SettingsNavGroup>
      </div>
    </SettingsSidebar>

    <SettingsContent>
      <SettingsPanel value="calendar">
        <SettingsBody :class="pending.body">
          <div class="flex flex-col gap-8 pt-12">
            <!-- Calendar view -->
            <section class="flex flex-col gap-6">
              <h3 class="text-lg-semibold text-ink-gray-8">Calendar view</h3>
              <div class="flex flex-col gap-4">
                <SettingsCell
                  title="Default view"
                  description="Switch between default calendar view"
                />
                <!--
                Three selectable cards. Each card is a <label> bound to its
                Radio's id, so the whole card is the hit target while the Radio
                stays the real control.
              -->
                <!--
                  RadioGroup's own root is a `flex flex-row flex-wrap` track, so
                  the card strip inside it is a flex *item* and would otherwise
                  hug its content instead of spanning the 700px column.
                -->
                <RadioGroup
                  v-model="defaultView"
                  class="w-full"
                  orientation="horizontal"
                  size="sm"
                >
                  <div class="flex w-full gap-2.5">
                    <label
                      v-for="view in views"
                      :key="view.value"
                      :for="`view-${view.value}`"
                      class="flex h-[108px] flex-1 cursor-pointer flex-col overflow-hidden rounded-5 border bg-surface-elevation-2 transition-colors"
                      :class="
                        defaultView === view.value
                          ? 'border-outline-gray-7'
                          : 'border-outline-gray-2 hover:border-outline-gray-3'
                      "
                    >
                      <!--
                      A gray field with a white panel inset from the left and
                      top that runs off the right and bottom edges — that bleed
                      is what makes it read as a calendar continuing past the
                      card. Rebuilt in CSS rather than lifted as a bitmap.
                    -->
                      <div
                        class="h-[76px] shrink-0 overflow-hidden bg-surface-gray-3 pl-5 pt-3.5"
                      >
                        <div
                          class="h-full overflow-hidden rounded-tl-2 bg-surface-elevation-2"
                        >
                          <div
                            class="whitespace-nowrap px-2 py-1.5 text-2xs font-semibold uppercase tracking-wider text-ink-gray-7"
                            :class="
                              view.value !== 'day' &&
                              'border-b border-outline-gray-2'
                            "
                          >
                            {{ view.caption }}
                          </div>

                          <!-- Day: stacked events against the hour rules. -->
                          <div
                            v-if="view.value === 'day'"
                            class="flex flex-col gap-1.5 px-2 pt-1"
                          >
                            <div
                              v-for="n in 2"
                              :key="n"
                              class="flex items-center gap-1.5"
                            >
                              <span
                                class="h-[7px] w-2.5 shrink-0 bg-surface-red-6 dark:bg-surface-red-8"
                              />
                              <span class="h-[5px] flex-1 bg-surface-gray-3" />
                            </div>
                          </div>

                          <!-- Week: events banked in the first column. -->
                          <div
                            v-else-if="view.value === 'week'"
                            class="grid w-[210px] grid-cols-[26px_repeat(4,46px)]"
                          >
                            <div
                              v-for="n in 15"
                              :key="n"
                              class="relative h-[13px] border-b border-r border-outline-gray-2"
                            >
                              <span
                                v-if="n % 5 === 1"
                                class="absolute left-1 top-[3px] h-[7px] w-2.5 bg-surface-red-6 dark:bg-surface-red-8"
                              />
                            </div>
                          </div>

                          <!-- Month: one event per day across the first week. -->
                          <div
                            v-else
                            class="grid w-[230px] grid-cols-[repeat(5,46px)]"
                          >
                            <div
                              v-for="n in 15"
                              :key="n"
                              class="relative h-[17px] border-b border-r border-outline-gray-2"
                            >
                              <span
                                v-if="n <= 4"
                                class="absolute left-1/2 top-[5px] h-[7px] w-2.5 -translate-x-1/2 bg-surface-red-6 dark:bg-surface-red-8"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        class="flex flex-1 items-center justify-between gap-2 pl-4 pr-2"
                      >
                        <span class="text-base text-ink-gray-8">{{
                          view.label
                        }}</span>
                        <!--
                          This card supplies its own label, so Radio's two
                          label-related affordances work against it: the circle
                          is nudged down (`mt-[3.5px]` at sm) to meet a label's
                          first line, and an empty label span still earns the
                          row's `gap-2`, holding the circle 8px off the edge.
                          Clear both so the circle centres and sits flush.
                        -->
                        <Radio
                          :id="`view-${view.value}`"
                          :value="view.value"
                          class="[&>span:first-child]:mt-0 [&>span:last-child]:hidden"
                        />
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </div>
            </section>

            <Divider :class="pending.divider" />

            <!-- Calendar -->
            <section class="flex flex-col gap-6">
              <h3 class="text-lg-semibold text-ink-gray-8">Calendar</h3>
              <SettingsCell
                title="Default calendar"
                description="New events, todos, and share links will be scheduled in this calendar."
                label-for="default-calendar"
              >
                <Select
                  id="default-calendar"
                  v-model="defaultCalendar"
                  :options="calendarOptions"
                >
                  <template #prefix>
                    <span
                      class="size-2 shrink-0 rounded-full bg-surface-blue-6"
                    />
                  </template>
                </Select>
              </SettingsCell>
            </section>

            <Divider :class="pending.divider" />

            <!-- General -->
            <section class="flex flex-col gap-6">
              <h3 class="text-lg-semibold text-ink-gray-8">General</h3>
              <SettingsCell
                title="Time format"
                description="Choose the way times are displayed."
              >
                <TabButtons v-model="timeFormat" :options="timeFormatOptions" />
              </SettingsCell>
              <SettingsCell
                title="Start day"
                description="Choose what day the calendar week should start."
              >
                <TabButtons v-model="startDay" :options="startDayOptions" />
              </SettingsCell>
              <SettingsCell
                title="Default duration"
                description="Set how long new events should be by default."
                label-for="default-duration"
              >
                <Select
                  id="default-duration"
                  v-model="defaultDuration"
                  :options="durationOptions"
                />
              </SettingsCell>
            </section>

            <Divider :class="pending.divider" />

            <!-- Notifications -->
            <section class="flex flex-col gap-6">
              <h3 class="text-lg-semibold text-ink-gray-8">Notifications</h3>

              <div class="flex flex-col gap-8">
                <div class="flex flex-col gap-4">
                  <SettingsCell
                    title="Event notifications"
                    description="Reminders will be sent before the event starts, based on the configured time."
                    label-for="event-notifications"
                  >
                    <Switch
                      id="event-notifications"
                      size="md"
                      v-model="eventNotifications"
                    />
                  </SettingsCell>
                  <Button
                    class="self-start"
                    icon-left="lucide-plus"
                    label="Add notification"
                    :disabled="!eventNotifications"
                  />
                </div>

                <div class="flex flex-col gap-4">
                  <SettingsCell
                    title="All day event notifications"
                    description="For all-day events, set a time to send reminders before the event starts"
                    label-for="all-day-notifications"
                  >
                    <Switch
                      id="all-day-notifications"
                      size="md"
                      v-model="allDayNotifications"
                    />
                  </SettingsCell>

                  <div v-if="allDayNotifications" class="flex flex-col gap-3">
                    <div
                      v-for="reminder in allDayReminders"
                      :key="reminder.id"
                      class="flex items-center gap-3"
                    >
                      <Select
                        v-model="reminder.channel"
                        class="flex-1"
                        :options="channelOptions"
                        aria-label="Notification channel"
                      />
                      <Select
                        v-model="reminder.count"
                        class="w-[98px]"
                        :options="countOptions"
                        aria-label="Amount"
                      />
                      <Select
                        v-model="reminder.unit"
                        class="w-[148px]"
                        :options="unitOptions"
                        aria-label="Unit"
                      />
                      <Button
                        variant="ghost"
                        icon="lucide-trash-2"
                        :aria-label="`Remove reminder ${reminder.id}`"
                        @click="removeReminder(reminder.id)"
                      />
                    </div>
                    <Button
                      class="self-start"
                      icon-left="lucide-plus"
                      label="Add notification"
                      @click="addReminder"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </SettingsBody>
      </SettingsPanel>

      <SettingsPanel
        v-for="value in [
          'profile',
          'notifications',
          'general',
          'members',
          'google',
        ]"
        :key="value"
        :value="value"
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
