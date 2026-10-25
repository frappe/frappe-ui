<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  FormControl,
  SettingsBody,
  SettingsHeader,
  SettingsRow,
  Select,
  Switch,
} from 'frappe-ui'

const workspaceName = ref('Lumen Labs')

const timezone = ref('Europe/Berlin')
const timezoneOptions = [
  { label: 'Europe/Berlin (UTC+2)', value: 'Europe/Berlin' },
  { label: 'America/New_York (UTC−4)', value: 'America/New_York' },
  { label: 'Asia/Kolkata (UTC+5:30)', value: 'Asia/Kolkata' },
]

const weekStart = ref('Monday')
const weekStartOptions = ['Monday', 'Sunday'].map((d) => ({
  label: d,
  value: d,
}))

const guestAccess = ref(true)
</script>

<template>
  <SettingsHeader
    title="General"
    description="Settings that apply to everyone in this workspace."
  />
  <SettingsBody>
    <div class="flex flex-col gap-8 pt-6">
      <div class="flex flex-col gap-6">
        <div class="flex items-center gap-4">
          <img
            src="https://api.dicebear.com/9.x/glass/svg?seed=Lumen"
            alt="Workspace logo"
            class="size-12 shrink-0 rounded-6"
          />
          <Button>Change logo</Button>
        </div>
        <FormControl v-model="workspaceName" label="Workspace name" />
      </div>

      <section>
        <h3 class="text-base font-semibold text-ink-gray-8">Regional</h3>
        <div class="mt-2 divide-y divide-outline-gray-1">
          <SettingsRow
            title="Time zone"
            description="Used for due dates and digest emails."
          >
            <Select v-model="timezone" :options="timezoneOptions" />
          </SettingsRow>
          <SettingsRow
            title="First day of the week"
            description="Changes how calendars and date pickers start."
          >
            <Select v-model="weekStart" :options="weekStartOptions" />
          </SettingsRow>
        </div>
      </section>

      <section>
        <h3 class="text-base font-semibold text-ink-gray-8">Access</h3>
        <div class="mt-2 divide-y divide-outline-gray-1">
          <SettingsRow
            title="Guest access"
            description="Let members invite people from outside the company to single projects."
          >
            <Switch v-model="guestAccess" />
          </SettingsRow>
          <SettingsRow
            title="Delete workspace"
            description="Removes all projects, files and members. This cannot be undone."
          >
            <Button theme="red">Delete</Button>
          </SettingsRow>
        </div>
      </section>
    </div>
  </SettingsBody>
</template>
