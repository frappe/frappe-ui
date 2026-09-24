<script setup lang="ts">
import { ref } from 'vue'
import {
  Avatar,
  Checkbox,
  SettingsBody,
  SettingsContent,
  SettingsDialog,
  SettingsNavGroup,
  SettingsNavItem,
  SettingsPanel,
  SettingsSidebar,
  Switch,
} from '../../src'
import {
  List,
  ListCell,
  ListHeader,
  ListHeaderCell,
  ListRow,
} from '../../src/molecules/list'
import SettingsCell from './SettingsCell.vue'
import * as pending from './pendingFrappeUIChanges'

const open = defineModel<boolean>('open', { default: false })

const activeTab = ref('notifications')
const dailyDigest = ref(true)

// Espresso's `table-row` maps to the List family here. Each row carries two
// independent checkboxes, so the row itself is never a click target — a List
// row is interactive *or* it holds inline controls, never both (nested
// interactive elements are invalid HTML). Leaving `route`/`href`/`@click` off
// renders a plain div, and the checkbox cells own every interaction.
const events = ref([
  {
    id: 'lead-assigned',
    title: 'New lead assigned',
    description: 'When a lead is routed to you',
    inApp: true,
    mail: false,
  },
  {
    id: 'lead-status',
    title: 'Lead status updated',
    description: 'Any stage change',
    inApp: true,
    mail: true,
  },
  {
    id: 'lead-followup',
    title: 'Lead follow-up due',
    description: 'Nearing SLA or overdue',
    inApp: true,
    mail: true,
  },
  {
    id: 'stage-changed',
    title: 'Stage changed',
    description: 'e.g., Negotiation → Closed Won',
    inApp: true,
    mail: false,
  },
  {
    id: 'deal-followup',
    title: 'Deal follow-up due',
    description: 'Pending action or stale',
    inApp: false,
    mail: true,
  },
  {
    id: 'task-assigned',
    title: 'Task assigned',
    description: 'You’re the owner',
    inApp: true,
    mail: true,
  },
  {
    id: 'task-due',
    title: 'Task due / overdue',
    description: 'Upcoming deadline',
    inApp: false,
    mail: true,
  },
  {
    id: 'meeting',
    title: 'Meeting scheduled/updated',
    description: 'Calendar invite changes',
    inApp: false,
    mail: false,
  },
  {
    id: 'chat',
    title: 'New chat message',
    description: 'Any conversation you follow',
    inApp: true,
    mail: false,
  },
  {
    id: 'mentions',
    title: 'Mentions & replies',
    description: '@you or reply to your comment',
    inApp: true,
    mail: false,
  },
])
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
          <SettingsNavItem value="my-profile">
            <template #prefix>
              <Avatar size="xs" label="Sandeep Prabhakaran" class="shrink-0" />
            </template>
            My profile
          </SettingsNavItem>
          <SettingsNavItem value="notifications">
            <template #prefix>
              <span class="lucide-bell size-4 shrink-0 text-ink-gray-6" />
            </template>
            Notifications
          </SettingsNavItem>
        </SettingsNavGroup>
      </div>
    </SettingsSidebar>

    <SettingsContent>
      <SettingsPanel value="my-profile">
        <SettingsBody :class="pending.body">
          <div class="pt-12 text-base text-ink-gray-5">
            The profile body is Espresso pattern 1 — open it from the list.
          </div>
        </SettingsBody>
      </SettingsPanel>

      <SettingsPanel value="notifications">
        <SettingsBody :class="pending.body">
          <div class="flex flex-col gap-8 pt-12">
            <!-- Intro -->
            <section class="flex flex-col gap-6">
              <h2 class="text-2xl-semibold text-ink-gray-8">
                Notification settings
              </h2>
              <!-- Espresso gives this switch cell 8px of vertical padding. -->
              <SettingsCell
                class="py-2"
                title="Daily digest"
                description="Deliver productivity stats and today’s tasks each morning."
                label-for="daily-digest"
              >
                <Switch id="daily-digest" size="md" v-model="dailyDigest" />
              </SettingsCell>
            </section>

            <!-- Per-event matrix -->
            <section class="flex flex-col gap-6">
              <h3 class="text-lg-semibold text-ink-gray-8">
                Account info &amp; security
              </h3>

              <!--
                A `full` divider spans the grid area, so row padding would pull
                the rules in at both ends. Espresso runs them the full 700 —
                flush with the section heading on the left and the Daily digest
                switch on the right — so the row padding stays at 0 and the
                insets ride on the cells: 12px of text inset on the first,
                and the trailing column is 4px wider with `pr-1` on its cell,
                which reproduces the 4px the design insets its table by.
              -->
              <List
                class="list-gap-0 list-row-px-0"
                :columns="['minmax(0,1fr)', '80px', '84px']"
              >
                <ListHeader>
                  <ListHeaderCell>Notify me about</ListHeaderCell>
                  <ListHeaderCell class="justify-center">In-app</ListHeaderCell>
                  <ListHeaderCell class="justify-center pr-1"
                    >Mail</ListHeaderCell
                  >
                </ListHeader>

                <ListRow v-for="event in events" :key="event.id" class="py-3">
                  <ListCell>
                    <div class="min-w-0">
                      <div class="text-base-medium text-ink-gray-8">
                        {{ event.title }}
                      </div>
                      <p class="mt-1 text-p-base text-ink-gray-6">
                        {{ event.description }}
                      </p>
                    </div>
                  </ListCell>
                  <ListCell class="justify-center">
                    <Checkbox
                      v-model="event.inApp"
                      size="md"
                      :aria-label="`In-app notifications for ${event.title}`"
                    />
                  </ListCell>
                  <ListCell class="justify-center pr-1">
                    <Checkbox
                      v-model="event.mail"
                      size="md"
                      :aria-label="`Mail notifications for ${event.title}`"
                    />
                  </ListCell>
                </ListRow>
              </List>
            </section>
          </div>
        </SettingsBody>
      </SettingsPanel>
    </SettingsContent>
  </SettingsDialog>
</template>
