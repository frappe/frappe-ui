<script setup lang="ts">
import { ref } from 'vue'
import { Avatar, Button, Divider, MultiSelect, Select } from '../../../src'
import { faceFor } from '../../components/patterns/designAssets'
import * as pending from '../pendingFrappeUIChanges'

const role = ref('Member')
const roleOptions = [
  { label: 'Member', value: 'Member' },
  { label: 'Admin', value: 'Admin' },
  { label: 'Guest', value: 'Guest' },
]

const people = [
  {
    label: 'Shantanu Mishra',
    value: 'shantanu@timeless.co',
  },
  {
    label: 'Ella Thompson',
    value: 'ella@timeless.co',
  },
  {
    label: 'Olivia Martinez',
    value: 'olivia@frappe.io',
  },
  {
    label: 'Ryan Scott',
    value: 'ryan@frappe.io',
  },
  {
    label: 'Grace Lee',
    value: 'grace@frappe.io',
  },
  {
    label: 'Emma Brown',
    value: 'emma.b@frappe.io',
  },
]

// Two picked already, so the field shows its chips as well as its placeholder
// behaviour.
const invitees = ref<(string | number)[]>([
  'shantanu@timeless.co',
  'ella@timeless.co',
])

function remove(value: string | number) {
  invitees.value = invitees.value.filter((v) => v !== value)
}
</script>

<template>
  <div class="flex w-[700px] max-w-full flex-col gap-6">
    <div class="flex items-center gap-2">
      <!--
        Chevron and title are one back target, as in V1: `-ml-[5px]` cancels
        the glyph's own left bearing so its stroke lines up with the content
        below, and the pair steps down a shade on hover.
      -->
      <h3 class="min-w-0 flex-1">
        <button
          type="button"
          class="flex items-center gap-2 text-2xl-semibold text-ink-gray-8 transition-colors hover:text-ink-gray-7"
        >
          <span
            class="lucide-chevron-left -ml-[5px] size-4 shrink-0"
            aria-hidden="true"
          />
          Invite people
        </button>
      </h3>
      <Button variant="solid" label="Send Invites" />
    </div>

    <div class="flex items-center gap-8">
      <div class="min-w-0 flex-1">
        <div class="text-lg-medium text-ink-gray-8">Invite by link</div>
        <p class="mt-[2px] -mb-[2px] text-p-base text-ink-gray-6">
          Share this link to invite users to join your workspace
        </p>
      </div>
      <Button icon-left="lucide-link" label="Copy link" />
    </div>

    <!-- frappe-ui's Divider is a shade darker than every other line here. -->
    <Divider :class="pending.divider" />

    <div class="flex items-center gap-8">
      <div class="min-w-0 flex-1">
        <div class="text-lg-medium text-ink-gray-8">Invite by email</div>
        <p class="mt-[2px] -mb-[2px] text-p-base text-ink-gray-6">
          New people will be added to the team as
        </p>
      </div>
      <Select
        v-model="role"
        :options="roleOptions"
        placeholder="Select role"
        aria-label="Role for new people"
      />
    </div>

    <!--
      The people field is frappe-ui's MultiSelect.
      · `py-1 !pl-1` insets the tags evenly: the trigger's own `px-2.5` leaves
        them 11px from the left edge against 5px above and below, which reads
        as a hole on the left once the field holds tags rather than text.
      · `#summary` replaces its "N selected" text with a tag per person, built
        to Espresso's `tag` (md, subtle, gray) — 24px tall, 6px radius, 6px of
        padding at the lead and 4 at the tail, a 12px avatar, a 13px label in
        ink-gray-7 and a 12px close. frappe-ui has no Tag component; `Badge` is
        a pill with no dismiss, so this one is built from tokens.
      · The dismiss is a glyph, not a Button: the field's trigger is itself a
        button, and a button inside a button is invalid. Unchecking the person
        in the menu is the keyboard path.
      · `#item-suffix` puts a check on the chosen rows, and the menu's own
        leading checkbox is hidden, so the menu reads as the design draws it.
    -->
    <MultiSelect
      v-model="invitees"
      class="h-auto min-h-8 w-full py-1 !pl-1"
      :class="pending.multiSelectMenu"
      size="md"
      placeholder="Add people or emails"
      :options="people"
      aria-label="Add people or emails"
    >
      <!--
        With exactly one selection the trigger repeats that person's avatar
        from `#item-prefix` before the tags. An empty `#prefix` takes
        precedence over that and leaves the area to the tags.
      -->
      <template #prefix><span class="hidden" /></template>

      <template #summary="{ selectedOptions }">
        <span v-if="!selectedOptions.length" class="text-base text-ink-gray-4"
          >Add people or emails</span
        >
        <span v-else class="flex min-w-0 flex-wrap items-center gap-1">
          <span
            v-for="option in selectedOptions"
            :key="option.value"
            class="flex h-6 shrink-0 items-center gap-1 rounded-3 bg-surface-base py-[4.5px] pl-1.5 pr-1 dark:bg-surface-gray-4"
          >
            <!-- 12px: the Avatar scale starts at 16. -->
            <Avatar
              size="xs"
              class="!size-3"
              :label="option.label"
              :image="faceFor(option.label)"
            />
            <span class="text-sm text-ink-gray-7">{{ option.label }}</span>
            <span
              class="lucide-x size-3 cursor-pointer text-ink-gray-7 hover:text-ink-gray-8"
              role="presentation"
              @click.stop.prevent="remove(option.value)"
            />
          </span>
        </span>
      </template>

      <!-- Espresso draws no footer on this menu; an empty slot replaces
           frappe-ui's Clear All / Select All. -->
      <template #footer><span /></template>

      <template #search-prefix>
        <span
          class="lucide-search size-4 shrink-0 text-ink-gray-5"
          aria-hidden="true"
        />
      </template>

      <!-- 16px, so a row stays 32 tall as the design draws it. -->
      <template #item-prefix="{ item }">
        <Avatar size="xs" :label="item.label" :image="faceFor(item.label)" />
      </template>

      <template #item-suffix="{ selected }">
        <span
          v-if="selected"
          class="lucide-check size-4 text-ink-gray-6"
          aria-hidden="true"
        />
      </template>
    </MultiSelect>
  </div>
</template>

<!--
  Espresso's multiselect menu. The menu is portalled to <body>, so a class on
  the field can't reach it — hence a plain (unscoped) block. Everything here is
  a token via `@apply`, and none of it goes to frappe-ui until the team has
  validated this menu and the tag.
-->
<style>
/* The row's checkbox: Espresso marks a chosen row with the trailing check. */
[data-slot='content'][role='listbox']
  [data-slot='item-prefix']
  > span
  > div:first-child {
  display: none;
}

/* Search sits inside the panel as a filled field, with no rule under it. */
[data-slot='content'][role='listbox'] [data-slot='search'] {
  @apply gap-2 rounded-4 border-b-0 bg-surface-gray-2 p-2;
  margin: 4px 4px 0;
}

[data-slot='content'][role='listbox'] [data-slot='search'] [data-slot='input'] {
  @apply py-0;
}

/* 32px rows on a 10px radius, the chosen one washed in surface-gray-3. */
[data-slot='content'][role='listbox'] [data-slot='item'] {
  @apply rounded-5;
}

[data-slot='content'][role='listbox'] [data-slot='item'][aria-selected='true'] {
  @apply bg-surface-gray-3;
}
</style>
