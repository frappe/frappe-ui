<script setup lang="ts">
import { Badge, Divider, Dropdown } from '../../../src'
import { List, ListCell, ListRow } from '../../../src/molecules/list'
import * as logos from '../providerLogos'
import * as pending from '../pendingFrappeUIChanges'

const providers = [
  { key: 'gmail', label: 'Gmail', logo: logos.gmail },
  { key: 'frappe', label: 'Frappe', logo: logos.frappe },
  { key: 'outlook', label: 'Outlook', logo: logos.outlook },
  { key: 'apple', label: 'Apple', logo: logos.apple, mono: true },
  { key: 'yahoo', label: 'Yahoo', logo: logos.yahoo },
  { key: 'aol', label: 'Aol', logo: logos.aol, mono: true },
  { key: 'others', label: 'Others', logo: logos.others, mono: true },
]

const accounts = [
  { email: 'gowtham@gmail.com', logo: logos.gmail, primary: true },
  { email: 'gowtham@timeless.co', logo: logos.gmail, primary: false },
  {
    email: 'gowtham@icloud.com',
    logo: logos.apple,
    mono: true,
    primary: false,
  },
  { email: 'gowtham@outlook.com', logo: logos.outlook, primary: false },
  { email: 'gowtham@yahoo.com', logo: logos.yahoo, primary: false },
]

function accountActions(email: string) {
  return [
    { label: 'Make primary', icon: 'lucide-star', onClick: () => {} },
    { label: 'Sync now', icon: 'lucide-refresh-cw', onClick: () => {} },
    {
      label: `Disconnect ${email}`,
      icon: 'lucide-unlink',
      theme: 'red' as const,
      onClick: () => {},
    },
  ]
}
</script>

<template>
  <div class="flex w-[700px] max-w-full flex-col gap-5">
    <section class="flex flex-col gap-3">
      <div class="flex flex-col gap-1">
        <div class="text-lg-semibold text-ink-gray-8">
          Let’s get your email set up!
        </div>
        <p class="text-p-base tracking-normal text-ink-gray-6">
          Choose your email provider to get started
        </p>
      </div>

      <!--
        The provider tiles: 74px boxes built from tokens, since frappe-ui has
        no card or tile component. The marks are exported from the design.
      -->
      <div class="flex flex-wrap gap-3">
        <button
          v-for="provider in providers"
          :key="provider.key"
          type="button"
          class="flex size-[74px] flex-col items-center justify-center gap-1.5 rounded-6 border border-outline-gray-1 bg-surface-base transition-colors hover:bg-surface-gray-1 focus-visible:focus-ring"
        >
          <!--
            The three single-colour marks are drawn in black, which vanishes
            on a dark page; inverting keeps them legible without shipping a
            second set of images.
          -->
          <img
            :src="provider.logo"
            alt=""
            class="size-6"
            :class="{ 'dark:invert': provider.mono }"
          />
          <span class="text-base text-ink-gray-6">{{ provider.label }}</span>
        </button>
      </div>
    </section>

    <!-- frappe-ui's Divider is a shade darker than every other line here. -->
    <Divider :class="pending.divider" />

    <!--
      8px under the heading, which lands the first email line 26px below it —
      the design's spacing, once the rows' own 12px padding is counted.
    -->
    <section class="flex flex-col gap-2">
      <div class="text-lg-semibold text-ink-gray-8">Connected mail</div>

      <!--
        52px rows: 12px above and below the 28px action, which is the taller
        of the two row heights the design uses. No rules between them.
      -->
      <List
        class="list-gap-3 list-row-px-0"
        :columns="['minmax(0,1fr)', 'auto']"
        divider="none"
      >
        <ListRow v-for="account in accounts" :key="account.email" class="py-3">
          <ListCell>
            <div class="flex min-w-0 items-center gap-[10px]">
              <img
                :src="account.logo"
                alt=""
                class="size-6 shrink-0"
                :class="{ 'dark:invert': account.mono }"
              />
              <span class="truncate text-base text-ink-gray-8">
                {{ account.email }}
              </span>
              <Badge
                v-if="account.primary"
                label="Primary"
                theme="green"
                variant="subtle"
                size="md"
              />
            </div>
          </ListCell>

          <ListCell class="justify-end">
            <Dropdown
              :options="accountActions(account.email)"
              :button="{
                variant: 'ghost',
                icon: 'lucide-ellipsis',
                'aria-label': `Actions for ${account.email}`,
              }"
            />
          </ListCell>
        </ListRow>
      </List>
    </section>
  </div>
</template>
