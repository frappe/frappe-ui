<script setup lang="ts">
import { computed } from 'vue'
import { Avatar, Badge, Button, Select, Switch, TabButtons, TextInput } from '../../src'
import type { CalendarEvent } from '../../experimental/Calendar'

const props = defineProps<{
  /** `null` while creating; an event when one was clicked. */
  event: CalendarEvent | null
  /** The day a cell click landed on, for the new-event form. */
  date?: Date | null
  /** Which face the New menu asked for. */
  kind?: 'Event' | 'Task'
}>()
defineEmits<{ close: []; delete: [id: string | number | undefined] }>()

const creating = computed(() => !props.event)

const when = computed(() => {
  const e = props.event
  if (!e) return ''
  const d = new Date(`${e.fromDate}T${e.fromTime ?? '00:00'}`)
  const day = d.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
  const t = (v?: string) =>
    v
      ? new Date(`2000-01-01T${v}`)
          .toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
          .toLowerCase()
      : ''
  return `${t(e.fromTime)} – ${t(e.toTime)} · ${day}`
})

const dot: Record<string, string> = {
  amber: 'bg-surface-amber-6',
  violet: 'bg-surface-violet-6',
  green: 'bg-surface-green-6',
}

const people = [
  'faris@timeless.co',
  'gowtham@timeless.co',
  'rubin@timeless.co',
]
</script>

<template>
  <!--
    The file's side panel (node 35208:100549): 352 wide, white, full height
    beside the grid. Sections are divided by a hairline inset 20 either side,
    rows sit 40 tall with an 18px lead and 14 between a glyph and its text.

    One panel, two faces — creating and viewing — as the file draws them.
  -->
  <aside
    class="flex h-full w-[352px] shrink-0 flex-col overflow-y-auto border-l border-outline-gray-1 bg-surface-base"
  >
    <header class="flex items-center gap-3 px-5 py-[18px]">
      <h2 class="min-w-0 flex-1 truncate text-lg-medium text-ink-gray-7">
        {{ creating ? `New ${kind ?? 'Event'}` : 'Event detail' }}
      </h2>
      <Button
        v-if="!creating"
        variant="ghost"
        icon="lucide-trash-2"
        aria-label="Delete event"
        @click="$emit('delete', event?.id)"
      />
      <Button
        variant="ghost"
        icon="lucide-x"
        aria-label="Close"
        @click="$emit('close')"
      />
    </header>

    <!-- ── Creating ─────────────────────────────────────────────────── -->
    <template v-if="creating">
      <div class="px-5">
        <TabButtons
          :model-value="kind ?? 'Event'"
          :options="[
            { label: 'Event', value: 'Event' },
            { label: 'Task', value: 'Task' },
          ]"
        />
      </div>

      <div class="px-5 pt-3">
        <TextInput size="md" class="w-full" :placeholder="`${kind ?? 'Event'} Title`" />
      </div>

      <div class="flex items-center gap-3 px-5 py-3">
        <Switch size="sm" :model-value="false" label="All day" />
        <span class="ml-auto text-sm text-ink-gray-5">GMT+6:30</span>
      </div>

      <div class="h-px bg-outline-gray-1 mx-5" />

      <!-- The event's own fields, one row each. -->
      <dl class="flex flex-col py-2.5">
        <div
          v-for="row in [
            { label: 'Date', value: 'Wed, May 22' },
            { label: 'Time', value: '4:00 pm – 5:00 pm' },
            { label: 'Repeat', value: 'None' },
            { label: 'Alert', value: '10 min before' },
            { label: 'Occupancy', value: 'Busy' },
            { label: 'Visibility', value: 'Default' },
          ]"
          :key="row.label"
          class="flex h-10 items-center gap-3.5 px-[18px]"
        >
          <dt class="w-[88px] shrink-0 text-base text-ink-gray-6">
            {{ row.label }}
          </dt>
          <dd class="min-w-0 flex-1">
            <Select
              variant="ghost"
              size="sm"
              class="w-full"
              :model-value="row.value"
              :options="[{ label: row.value, value: row.value }]"
              :aria-label="row.label"
            />
          </dd>
        </div>
      </dl>

      <div class="h-px bg-outline-gray-1 mx-5" />

      <!-- What the event can be attached to, and what it carries. -->
      <div class="flex flex-col py-2.5">
        <Button
          v-for="action in [
            { label: 'Add video conference', icon: 'lucide-video' },
            { label: 'Add attendee', icon: 'lucide-user-plus' },
            { label: 'Add location', icon: 'lucide-map-pin' },
            { label: 'Add description', icon: 'lucide-align-left' },
          ]"
          :key="action.label"
          variant="ghost"
          class="!h-10 !justify-start !px-[18px] !text-ink-gray-5"
          :icon-left="action.icon"
          :label="action.label"
        />
      </div>

      <div class="mt-auto border-t border-outline-gray-1 p-5">
        <Button
          variant="solid"
          class="w-full"
          :label="`Create ${(kind ?? 'Event').toLowerCase()}`"
        />
      </div>
    </template>

    <!-- ── Viewing ──────────────────────────────────────────────────── -->
    <template v-else>
      <div class="flex flex-col gap-1 px-5 pb-4">
        <div class="flex items-start gap-2">
          <span
            class="mt-[7px] size-2 shrink-0 rounded-full"
            :class="dot[event?.color ?? 'amber']"
          />
          <h3 class="text-lg-medium text-ink-gray-8">{{ event?.title }}</h3>
        </div>
        <p class="pl-4 text-p-base text-ink-gray-6">{{ when }}</p>
      </div>

      <div class="h-px bg-outline-gray-1 mx-5" />

      <div class="flex flex-col py-2.5">
        <div class="flex h-10 items-center gap-3.5 px-[18px]">
          <Badge theme="gray" variant="subtle" size="md" label="Frappe CRM" />
        </div>
        <Button
          variant="ghost"
          class="!h-10 !justify-start !px-[18px]"
          icon-left="lucide-video"
          label="Join google meet"
        />
        <div
          v-for="fact in [
            { icon: 'lucide-map-pin', text: 'Bengaluru, India' },
            { icon: 'lucide-bell', text: '10 min before' },
            { icon: 'lucide-circle', text: 'Busy' },
            { icon: 'lucide-globe', text: 'Public' },
          ]"
          :key="fact.text"
          class="flex h-10 items-center gap-3.5 px-[18px]"
        >
          <span :class="[fact.icon, 'size-4 shrink-0 text-ink-gray-5']" />
          <span class="text-base text-ink-gray-7">{{ fact.text }}</span>
        </div>
      </div>

      <div class="h-px bg-outline-gray-1 mx-5" />

      <div class="flex flex-col gap-2 px-[18px] py-3">
        <p class="text-base-medium text-ink-gray-7">
          {{ people.length }} People
          <span class="text-ink-gray-5">· 1 yes, 2 awaiting</span>
        </p>
        <div
          v-for="person in people"
          :key="person"
          class="flex h-8 items-center gap-2"
        >
          <Avatar size="sm" :label="person" />
          <span class="truncate text-base text-ink-gray-7">{{ person }}</span>
        </div>
      </div>

      <div class="h-px bg-outline-gray-1 mx-5" />

      <div class="flex flex-col gap-1.5 px-[18px] py-3">
        <p class="text-base-medium text-ink-gray-7">Description</p>
        <p class="text-p-base text-ink-gray-6">
          Please ensure that everyone attends the call at the scheduled time.
        </p>
      </div>

      <div class="mt-auto flex items-center gap-2 border-t border-outline-gray-1 p-5">
        <span class="text-base text-ink-gray-6">Going?</span>
        <Button label="Yes" />
        <Button label="No" />
        <Button label="Maybe" />
      </div>
    </template>
  </aside>
</template>
