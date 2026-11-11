<script setup lang="ts">
import { ref } from 'vue'
import {
  Avatar,
  Badge,
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
  Textarea,
  TextInput,
} from '../../src'
import SettingsCell from './SettingsCell.vue'
import * as pending from './pendingFrappeUIChanges'

const open = defineModel<boolean>('open', { default: false })

const activeTab = ref('my-profile')

const name = ref('Sandeep Prabhakaran')
const location = ref('Chennai, India')
const bio = ref(
  'A dedicated support specialist focused on resolving issues quickly and ensuring a smooth customer experience.',
)
const signatureEnabled = ref(true)
const signature = ref('Jayaprakash\nSupport agent')
const twoFactorEnabled = ref(true)
const theme = ref('system')

const themeOptions = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
]

const sessions = [
  {
    id: 'chrome-mac',
    icon: 'lucide-monitor',
    device: 'Chrome on macOS Sequoia, macOS 15.0',
    location: 'Chennai, India',
    current: true,
  },
  {
    id: 'safari-mac',
    icon: 'lucide-laptop',
    device: 'Safari on macOS Sequoia',
    location: 'Mumbai, India',
    current: false,
  },
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
        No SettingsHeader: the Espresso `my-profile` body has no pinned title
        bar, it starts straight at the profile cell. The panel's own `pt-12`
        supplies the 48px the header would normally contribute, so the body
        keeps the design's 52/48 inset on all four sides.
      -->
      <SettingsPanel value="my-profile">
        <SettingsBody :class="pending.body">
          <div class="flex flex-col gap-8 pt-12">
            <!-- Profile -->
            <section class="flex flex-col gap-6">
              <SettingsCell
                emphasis
                title="Sandeep Prabhakaran"
                description="Support agent"
              >
                <template #prefix>
                  <Avatar size="2xl" label="Sandeep Prabhakaran" />
                </template>
                <Button variant="ghost" label="Remove" />
                <Button label="Upload image" />
              </SettingsCell>

              <div class="flex gap-2.5">
                <TextInput
                  v-model="name"
                  class="flex-1"
                  size="md"
                  label="Name"
                />
                <TextInput
                  v-model="location"
                  class="flex-1"
                  size="md"
                  label="Location"
                />
              </div>

              <Textarea v-model="bio" size="sm" label="Bio" :rows="3" />

              <SettingsCell
                title="Enable signature"
                description="Would you like to add a signature to your emails?"
                label-for="enable-signature"
              >
                <Switch
                  id="enable-signature"
                  size="md"
                  v-model="signatureEnabled"
                />
              </SettingsCell>

              <Textarea
                v-if="signatureEnabled"
                v-model="signature"
                size="sm"
                label="Signature"
                :rows="3"
              />
            </section>

            <Divider :class="pending.divider" />

            <!-- Account info & security -->
            <section class="flex flex-col gap-6">
              <h3 class="text-lg-semibold text-ink-gray-8">
                Account info &amp; security
              </h3>
              <SettingsCell title="Email" description="jayaprakash@timeless.co">
                <Button label="Change email" />
              </SettingsCell>
              <SettingsCell
                title="Password"
                description="Change your account password for security."
              >
                <Button label="Change password" />
              </SettingsCell>
              <SettingsCell
                title="2FA Authentication"
                description="Manage two-factor authentication and security methods."
                label-for="two-factor"
              >
                <Switch id="two-factor" size="md" v-model="twoFactorEnabled" />
              </SettingsCell>
            </section>

            <Divider :class="pending.divider" />

            <!-- Appearance -->
            <section class="flex flex-col gap-6">
              <h3 class="text-lg-semibold text-ink-gray-8">Appearance</h3>
              <SettingsCell
                title="Theme"
                description="Switch between light, dark, or system theme."
                label-for="theme"
              >
                <Select id="theme" v-model="theme" :options="themeOptions" />
              </SettingsCell>
            </section>

            <Divider :class="pending.divider" />

            <!-- Device & Activity -->
            <section class="flex flex-col gap-6">
              <h3 class="text-lg-semibold text-ink-gray-8">
                Device &amp; Activity
              </h3>
              <SettingsCell
                v-for="session in sessions"
                :key="session.id"
                :title="session.device"
                :description="session.location"
              >
                <template #prefix>
                  <div
                    class="flex size-8 items-center justify-center rounded-4 border border-outline-gray-1 bg-surface-gray-1"
                  >
                    <span :class="[session.icon, 'size-4 text-ink-gray-6']" />
                  </div>
                </template>
                <template #badge>
                  <Badge
                    v-if="session.current"
                    theme="green"
                    label="This device"
                  />
                </template>
                <Button icon-left="lucide-log-out" label="Sign out" />
              </SettingsCell>
              <!--
                Figma aligns this button's box with the content edge, not its
                label — the 8px padding indents the text. `self-start` keeps it
                hugging its label instead of stretching across the section.
              -->
              <!--
                Via the public `#suffix` slot rather than `icon-right`: the
                chevron glyph carries ~5.3px of empty box on each side (its
                path spans 8-16 of a 24 viewBox), so the nominal 8px `gap-2`
                reads as ~14px of air and the 8px right padding as ~13px.
                `-mx-1` takes back that bearing on both sides.
              -->
              <Button
                class="self-start"
                variant="ghost"
                label="Sign out on all devices"
              >
                <template #suffix>
                  <span class="lucide-chevron-right -mx-1 size-4" />
                </template>
              </Button>
            </section>

            <Divider :class="pending.divider" />

            <!-- Danger Zone -->
            <section class="flex flex-col gap-6">
              <h3 class="text-lg-semibold text-ink-gray-8">Danger Zone</h3>
              <SettingsCell
                title="Delete account"
                description="Permanently remove your account and all associated data."
              >
                <Button
                  theme="red"
                  icon-left="lucide-triangle-alert"
                  label="Delete account"
                />
              </SettingsCell>
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
