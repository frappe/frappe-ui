<script setup lang="ts">
import { DatePicker, ErrorMessage } from 'frappe-ui'

// The invalid-date example needs the trigger to show raw, uncommitted text
// ("31 / 02 / 2026" is not a real calendar date, so it has no `YYYY-MM-DD`
// modelValue DatePicker could hold) with a red border. No component today
// colors a border on `error` — see the Behavior section above, `error` only
// renders the message below — so the border color here is a plain
// `border-outline-red-5` override on a static trigger, reproducing
// DatePicker's real trigger markup (TextInput, with the same `#prefix`
// calendar-icon convention used throughout this page). The message itself is
// the real `ErrorMessage` component.
const triggerClass =
  'flex h-7 w-64 items-center gap-2 rounded-4 border border-outline-red-5 bg-surface-gray-2 px-2 text-base leading-tighter text-ink-gray-8'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Always pair the error state with a message -->
    <Guideline
      layout="stack"
      caption="Always pair the error state with a message explaining what went wrong."
    >
      <template #do>
        <div class="flex flex-col gap-1.5">
          <div :class="triggerClass">
            <span class="lucide-calendar size-4 text-ink-gray-5" />
            <span>31 / 02 / 2026</span>
          </div>
          <ErrorMessage message="February 2026 doesn't have 31 days." />
        </div>
      </template>
      <template #dont>
        <div :class="triggerClass">
          <span class="lucide-calendar size-4 text-ink-gray-5" />
          <span>31 / 02 / 2026</span>
        </div>
      </template>
    </Guideline>

    <!-- 2. Separators make the date order unambiguous (real component: both
         sides are just placeholder text, no value entered). -->
    <Guideline
      layout="stack"
      caption="Use separators in the date format to make the order clear and unambiguous."
    >
      <template #do>
        <DatePicker class="w-56" placeholder="dd / mm / yyyy">
          <template #prefix>
            <span class="lucide-calendar size-4 text-ink-gray-5" />
          </template>
        </DatePicker>
      </template>
      <template #dont>
        <DatePicker class="w-56" placeholder="03 02 2026">
          <template #prefix>
            <span class="lucide-calendar size-4 text-ink-gray-5" />
          </template>
        </DatePicker>
      </template>
    </Guideline>
  </div>
</template>
