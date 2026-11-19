<script setup lang="ts">
import { ref } from 'vue'
import {
  Avatar,
  Button,
  Checkbox,
  Password,
  Select,
  SettingsBody,
  SettingsContent,
  SettingsDialog,
  SettingsNavGroup,
  SettingsNavItem,
  SettingsPanel,
  SettingsSidebar,
  Textarea,
} from '../../src'
import SettingsCell from './SettingsCell.vue'
import * as pending from './pendingFrappeUIChanges'

const open = defineModel<boolean>('open', { default: false })

const activeTab = ref('my-profile')

const password = ref('')
const confirmPassword = ref('')
const reason = ref(null)
const feedback = ref('')
const acknowledged = ref(false)

const reasonOptions = [
  { label: 'No longer need the account', value: 'not-needed' },
  { label: 'Switching to another tool', value: 'switching' },
  { label: 'Too expensive', value: 'cost' },
  { label: 'Missing features', value: 'missing-features' },
  { label: 'Other', value: 'other' },
]

// Standalone pattern: in a real app this pops back to the profile panel. Here
// the delete view is the whole panel, so the only sensible target is dismissal.
function goBack() {
  open.value = false
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
      <!--
        Delete account is a drill-down of the My profile tab, so the sidebar
        selection stays on `my-profile` and the body swaps for the sub-view.
      -->
      <SettingsPanel value="my-profile">
        <SettingsBody :class="pending.body">
          <div class="flex flex-col gap-8 pt-12">
            <!-- Intro -->
            <section class="flex flex-col gap-6">
              <!--
                Espresso models this as a `cell` whose prefix is a bare 16px
                chevron (not a 28px icon button), so the row stays 21px tall.
              -->
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
                    @click="goBack()"
                  >
                    <span
                      class="lucide-chevron-left -ml-[5px] size-4 shrink-0"
                      aria-hidden="true"
                    />
                    Delete account
                  </button>
                </h2>
              </div>

              <SettingsCell
                title="Are you sure you want to delete your Helpdesk account?"
              >
                <template #description>
                  <p>
                    This will permanently delete your Helpdesk account at
                    jayaprakash@frappe.io. You'll lose access to all tickets,
                    reports, and teams linked to this account.
                  </p>
                  <p class="mt-[21px]">What will happen:</p>
                  <ul class="list-disc pl-[22px]">
                    <li>
                      Your profile, settings, and API keys will be deleted.
                    </li>
                    <li>You'll be signed out from all devices immediately.</li>
                    <li>
                      Tickets and records you created remain in shared
                      workspaces, but your ownership will be removed.
                    </li>
                    <li>
                      This action is permanent — we cannot restore your account
                      after deletion.
                    </li>
                  </ul>
                </template>
              </SettingsCell>
            </section>

            <!-- Final Confirmation -->
            <section class="flex flex-col gap-6">
              <h3 class="text-lg-semibold text-ink-gray-8">
                Final Confirmation
              </h3>

              <div class="flex gap-2.5">
                <Password
                  v-model="password"
                  class="flex-1"
                  size="md"
                  label="Password"
                  placeholder="Enter your password"
                />
                <Password
                  v-model="confirmPassword"
                  class="flex-1"
                  size="md"
                  label="Confirm password"
                  placeholder="Confirm password"
                />
              </div>

              <!--
                The field fills its column, as Espresso draws it, but the menu
                should only be as wide as the longest reason. reka's
                item-aligned positioning writes `min-width: <trigger width>`
                as an *inline* style on the wrapper around `[data-slot=content]`
                (SelectItemAlignedPosition), so the menu inherits the trigger's
                700px and there is no prop or class that reaches it. The style
                block below overrides that one declaration; `#item-label` is
                only here to mark this select's rows so the rule can find the
                right menu among all the portalled ones.
              -->
              <Select
                v-model="reason"
                size="md"
                label="Reason for deleting"
                placeholder="Select a reason"
                :options="reasonOptions"
                side="bottom"
                align="start"
              >
                <template #item-label="{ item }">
                  <div class="reason-option truncate">{{ item.label }}</div>
                </template>
              </Select>

              <!--
                Espresso's 12px gap assumes the padded checkbox contributes its
                own 6px of top padding. Unpadded (see below) that padding is
                gone, so the gap carries the full 18px the design reads as.
              -->
              <div class="flex flex-col gap-[18px]">
                <Textarea
                  v-model="feedback"
                  size="sm"
                  label="Feedback"
                  placeholder="Anything we should improve?"
                  :rows="4"
                />
                <!--
                  Espresso marks this checkbox `padded`, which is right for a
                  selection list where each row is its own hit target. Here it's
                  a single consent control in a form, so the padded surface
                  reads as a list row that isn't one — and its 6px inset pushes
                  the box out of line with the inputs above. Unpadded instead.
                -->
                <Checkbox
                  v-model="acknowledged"
                  size="sm"
                  label="I understand this permanently deletes my account and personal data."
                />
              </div>

              <div class="flex justify-end">
                <Button
                  theme="red"
                  icon-left="lucide-trash-2"
                  label="Delete account"
                />
              </div>
            </section>
          </div>
        </SettingsBody>
      </SettingsPanel>

      <SettingsPanel value="notifications">
        <SettingsBody :class="pending.body">
          <div class="pt-12 text-base text-ink-gray-5">
            The notifications body is Espresso pattern 3 — not implemented yet.
          </div>
        </SettingsBody>
      </SettingsPanel>
    </SettingsContent>
  </SettingsDialog>
</template>

<!--
  Unscoped on purpose: the menu is portalled to `body`, so a scoped rule (or a
  `:deep()`) never reaches it. `:has()` keeps the override on this one menu
  instead of every Select on the page — the role picker in Members, for
  instance, wants to stay at least as wide as its trigger.
-->
<style>
div:has(> [data-slot='content'] .reason-option),
[data-slot='content']:has(.reason-option) {
  min-width: 0 !important;
}
</style>
