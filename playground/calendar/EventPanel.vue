<script setup lang="ts">
import { computed, h, reactive, ref, watch } from 'vue'
import {
  Avatar,
  Button,
  DateRangePicker,
  Dropdown,
  MultiSelect,
  Select,
  Switch,
  TabList,
  TabTrigger,
  Tabs,
  TextInput,
  Textarea,
} from '../../src'
import { faceFor, logos } from '../components/patterns/designAssets'
import { colourValue } from './sampleCalendars'
import DateIcon from './icons/DateIcon.vue'
import type { CalendarEvent } from '../../experimental/Calendar'

const props = defineProps<{
  /** `null` while creating; an event when one was clicked. */
  event: CalendarEvent | null
  /** What a click or a drag on the grid asked for. */
  draft?: {
    fromDate: string
    toDate: string
    fromTime: string
    toTime: string
    allDay: boolean
  } | null
  /** Which face the New menu asked for. */
  kind?: 'Event' | 'Task'
  /** The title, held by the page so the dashed block on the grid can read it. */
  titleModel?: string
  /** The colour, held for the same reason. */
  colourModel?: string
}>()
const emit = defineEmits<{
  close: []
  create: [event: CalendarEvent]
  save: [event: CalendarEvent]
  delete: [id: string | number | undefined]
  'update:titleModel': [value: string]
  'update:colourModel': [value: string]
  /** The span, once a row has changed it, so the grid redraws the block. */
  'update:draft': [
    value: {
      fromDate: string
      toDate: string
      fromTime: string
      toTime: string
      allDay: boolean
    },
  ]
}>()

const creating = computed(() => !props.event)

/**
 * An event opened from the grid is read first and changed second. The fields
 * are the same either way — what changes is whether they take a hand — so
 * Edit unlocks them rather than swapping the panel for another one.
 *
 * `dirty` is what Save waits on: a panel opened to read and closed again has
 * nothing to save, and a button that can be pressed to no effect is a button
 * that has to be explained.
 */
const editing = ref(false)
const dirty = ref(false)
watch(
  () => props.event,
  () => {
    editing.value = false
    dirty.value = false
  },
)
/** Every field runs through here, so nothing can be changed unnoticed. */
const touch = () => {
  if (editing.value) dirty.value = true
}
/** Read-only until Edit is pressed — a made event, not being changed. */
const locked = computed(() => !creating.value && !editing.value)
const tab = ref<string>(props.kind ?? 'Event')
watch(
  () => props.kind,
  (k) => (tab.value = k ?? 'Event'),
)

// ── What the grid handed over ────────────────────────────────────────────────
//
// A click on an hour fills one; a drag across four fills four, and a drag
// across days fills the dates too. The panel is the only way in, so it opens
// with what was drawn already in it.
const pretty = (iso?: string) =>
  iso
    ? new Date(`${iso}T00:00`).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : ''
// `hour12` spelled out: the file writes "4:00 pm", and this browser's locale
// is en-GB, which would have given "16:00".
const clock = (t?: string) =>
  t
    ? new Date(`2000-01-01T${t}`)
        .toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
        .toLowerCase()
    : ''

const source = computed(() =>
  props.event
    ? {
        fromDate: String(props.event.fromDate ?? ''),
        toDate: String(props.event.toDate ?? props.event.fromDate ?? ''),
        fromTime: String(props.event.fromTime ?? ''),
        toTime: String(props.event.toTime ?? ''),
        allDay: !!props.event.isFullDay,
      }
    : (props.draft ?? null),
)

const allDay = ref(false)
watch(source, (s) => (allDay.value = !!s?.allDay), { immediate: true })

/**
 * The span the panel is working on, which is the grid's to begin with and the
 * panel's after that. A drag draws it and a click on an event brings it in,
 * but either can be wrong — an event dragged to the right hour on the wrong
 * day, an hour meant to the quarter — and the two rows are where that is put
 * right, so they hold their own copy rather than reading the grid's.
 */
const span = reactive({
  fromDate: '',
  toDate: '',
  fromTime: '09:00',
  toTime: '10:00',
})
watch(
  source,
  (s) => {
    span.fromDate = s?.fromDate || todayIso()
    span.toDate = s?.toDate || s?.fromDate || todayIso()
    span.fromTime = s?.fromTime || '09:00'
    span.toTime = s?.toTime || '10:00'
  },
  { immediate: true },
)

/** Changing either row moves the block drawn on the grid with it. */
function push() {
  touch()
  emit('update:draft', { ...span, allDay: allDay.value })
}
watch(allDay, () => emit('update:draft', { ...span, allDay: allDay.value }))

const dateLabel = computed(() =>
  span.toDate && span.toDate !== span.fromDate
    ? `${pretty(span.fromDate)} – ${pretty(span.toDate)}`
    : pretty(span.fromDate),
)
const fromLabel = computed(() => clock(span.fromTime) || '9:00 am')
const toLabel = computed(() => clock(span.toTime) || '10:00 am')

/**
 * Every quarter hour of the day, which is the grid's own step: a drag snaps
 * to fifteen minutes, so a time typed in should not be able to land between
 * two of them.
 */
const CLOCK_STEP = 15
const times = computed(() =>
  Array.from({ length: (24 * 60) / CLOCK_STEP }, (_, i) => {
    const mins = i * CLOCK_STEP
    const value = `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(
      mins % 60,
    ).padStart(2, '0')}`
    return { label: clock(value), value }
  }),
)
/**
 * Where the menu hangs, so the time that is set lands on the field.
 *
 * The file opens the list over the field with the chosen row on the value
 * and the rest of the day running either way from it. Select does that by
 * itself — but it works out how far up to hang the panel from where the row
 * sits in the whole list, not from where it sits in the eight rows on show,
 * so a list of 96 hung near the top of the window. So the panel is placed as
 * an ordinary menu, hung by as much as it takes.
 *
 * It takes the row's own height off the panel's and halves it, because the
 * list scrolls the chosen row to the middle of the panel — measured, not
 * assumed: scrolling it anywhere else held for a frame and was then centred
 * again. At the first and last hours of the day the scroll runs out before
 * the middle, and the row sits above or below the field, which is what a
 * select does when you open it on its first or last option.
 */
const ROW = 28
const MENU = 232
const FIELD = 28
const menuOffset = -(FIELD + (MENU - ROW) / 2)

const minutesOf = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}
const asClock = (mins: number) => {
  const m = Math.max(0, Math.min(24 * 60 - CLOCK_STEP, mins))
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(
    m % 60,
  ).padStart(2, '0')}`
}

/** Moving the start carries the end with it: an hour stays an hour. */
function setFromTime(value: string) {
  const length = Math.max(
    CLOCK_STEP,
    minutesOf(span.toTime) - minutesOf(span.fromTime),
  )
  span.fromTime = value
  span.toTime = asClock(minutesOf(value) + length)
  push()
}
/** The end cannot land on or before the start; the nearest quarter will do. */
function setToTime(value: string) {
  span.toTime =
    minutesOf(value) > minutesOf(span.fromTime)
      ? value
      : asClock(minutesOf(span.fromTime) + CLOCK_STEP)
  push()
}
function setDates(range: string[]) {
  const [from, to] = range ?? []
  if (!from) return
  span.fromDate = from
  span.toDate = to || from
  push()
}

/**
 * A new title lives on the page, not here: the dashed block drawn on the grid
 * reads it too, so a name typed in the panel appears on the calendar as it is
 * typed. An existing one is held here — it belongs to the event until Save
 * hands it back, and a made event's block should not follow the field while
 * it is being changed.
 */
const ownTitle = ref('')
watch(
  () => props.event,
  (e) => (ownTitle.value = String(e?.title ?? '')),
  { immediate: true },
)
const title = computed({
  get: () => (props.event ? ownTitle.value : (props.titleModel ?? '')),
  set: (v: string) => {
    if (props.event) ownTitle.value = v
    else emit('update:titleModel', v)
  },
})

// ── The rows the file draws ──────────────────────────────────────────────────
/**
 * The four rows the file lists under the first rule. One record rather than
 * four refs: a `v-for` over a literal array unwraps a ref to its value on the
 * way in, so `v-model` had nothing to write back to and every row showed its
 * placeholder.
 */
const behaviour = reactive<Record<string, string>>({
  Repeat: 'None',
  Alert: '10 min before',
  Occupancy: 'Busy',
  Visibility: 'Default',
})
/**
 * A task is not a short event: it has an assignee, a state and a priority
 * where an event has repetition, an alert and an occupancy. Same rows, same
 * `sm` ghost fields — different questions.
 */
const taskFields = reactive<Record<string, string>>({
  Backlog: 'Backlog',
  Priority: 'Medium',
})
const taskOptions: Record<string, string[]> = {
  Backlog: ['Backlog', 'Todo', 'In progress', 'Done', 'Cancelled'],
  Priority: ['Low', 'Medium', 'High', 'Urgent'],
}

/** Who it is on. Their own faces, as everywhere else people are listed. */
const assignee = ref('')

/**
 * Tags are typed in, not picked from a list — the same MultiSelect the
 * settings modal's people field is built on, without the avatars. Each tag
 * carries a colour of its own, taken from Badge's `subtle` pairs, so a row of
 * them reads as a row of distinct things rather than one grey blur. The
 * colour is chosen by the tag's own letters, so a tag keeps it wherever it
 * appears.
 */
const tags = ref<(string | number)[]>([])
const TAG_THEMES = [
  'text-ink-blue-7 bg-surface-blue-2',
  'text-ink-green-7 bg-surface-green-2',
  'text-ink-amber-7 bg-surface-amber-2',
  'text-ink-red-7 bg-surface-red-2',
  'text-ink-violet-7 bg-surface-violet-2',
  'text-ink-gray-6 bg-surface-gray-2',
]
const tagOptions = [
  'Design',
  'Engineering',
  'Marketing',
  'Sales',
  'Research',
  'Urgent',
].map((label, i) => ({ label, value: label.toLowerCase(), theme: TAG_THEMES[i] }))

/**
 * By place in the list, not by a hash of the letters: six tags against six
 * themes came out with two violets and two ambers, which is the one thing a
 * colour per tag is meant to avoid. Anything typed in later falls back to the
 * letters, so it keeps whatever colour it is first given.
 */
const tagTheme = (label: string) => {
  const known = tagOptions.find((o) => o.label === label)
  if (known) return known.theme
  let n = 0
  for (const ch of label) n = (n * 31 + ch.charCodeAt(0)) % 997
  return TAG_THEMES[n % TAG_THEMES.length]
}
const removeTag = (value: string | number) =>
  (tags.value = tags.value.filter((v) => v !== value))

/** The organisation an event or a task belongs to — the file's own marks. */
const organisation = ref('')
const orgOptions = [
  { label: 'Cooper', value: 'cooper', logo: logos.Cooper },
  { label: 'Dropbox', value: 'dropbox', logo: logos.Dropbox },
]
const orgLogo = computed(
  () => orgOptions.find((o) => o.value === organisation.value)?.logo,
)

const behaviourOptions: Record<string, string[]> = {
  Repeat: ['None', 'Daily', 'Weekly', 'Monthly'],
  Alert: ['None', '10 min before', '30 min before', '1 hour before'],
  Occupancy: ['Busy', 'Free'],
  Visibility: ['Default', 'Public', 'Private'],
}
/**
 * What an event can be hung off. Each carries its own mark, cut out of the
 * file (node 35346:104871): 16px on a 4px radius, square — the brands are
 * drawn as rounded squares there, not as discs the way people are.
 */
const link = ref('')
const linkOptions = [
  { label: 'Cooper', value: 'cooper', logo: logos.Cooper },
  { label: 'Dropbox', value: 'dropbox', logo: logos.Dropbox },
]
const linkLogo = computed(
  () => linkOptions.find((o) => o.value === link.value)?.logo,
)
const location = ref('')
const description = ref('')
const meet = ref('')

const people = [
  { label: 'Faris Ansari', value: 'faris@timeless.co' },
  { label: 'Rubini Raman', value: 'rubini@timeless.co' },
  { label: 'Gowtham Sivakumar', value: 'gowtham@timeless.co' },
  { label: 'Shariq Ansari', value: 'shariq@timeless.co' },
  { label: 'Sally Potter', value: 'sally@timeless.co' },
  { label: 'Emily Taylor', value: 'emily@timeless.co' },
]
/** The assignee picks from the same list the attendees do. */
const assigneeOptions = people

const attendees = ref<(string | number)[]>([])
const removeAttendee = (value: string | number) =>
  (attendees.value = attendees.value.filter((v) => v !== value))

// The dot beside the title is the calendar the event belongs to.
/**
 * The swatch's own fill: the card's ink, which is what names the calendar.
 *
 * As a variable rather than a class, because `ink-*` is a text colour —
 * `bg-ink-amber-6` generates nothing at all, the same way `bg-outline-gray-1`
 * did, and the swatches came out black.
 */
const dot: Record<string, string> = {
  gray: 'var(--ink-gray-6)',
  blue: 'var(--ink-blue-6)',
  green: 'var(--ink-green-6)',
  amber: 'var(--ink-amber-6)',
  red: 'var(--ink-red-6)',
  violet: 'var(--ink-violet-6)',
}
/**
 * The calendar a thing belongs to, which is what its colour says. The six the
 * file draws — each a frappe-ui colour name, which is all the component needs
 * to reach the `surface-{c}-1` fill and the `ink-{c}-6` ink.
 */
const COLOURS = ['gray', 'blue', 'green', 'amber', 'red', 'violet'] as const

/**
 * A thing being made has no colour until one is chosen for it, so it starts
 * grey — amber text on a grey ground is nobody's idea of a default, and the
 * block on the grid is grey while it is being drawn anyway.
 *
 * Held by the page, like the title, because the block reads it too: picking
 * violet here turns the block violet before the thing exists.
 */
/**
 * The colour picked here, which an existing event had no way to take.
 *
 * A new one keeps its colour on the page, so the block drawn on the grid can
 * read it as it is being chosen. A made one carries its own — and the field
 * read that colour straight off the event, so picking another changed
 * nothing: the swatch went back to what it had been and Save wrote the old
 * colour out again. The pick is held here until the panel is pointed at
 * another event.
 */
const picked = ref<string | null>(null)
watch(
  () => props.event,
  () => (picked.value = null),
)

/**
 * An event's colour as a name. A made event stores what the calendar draws
 * with, which for two of the six is a hex — `colorMap` has no gray and no
 * red — and the swatch needs the name back.
 */
const nameOf = (v: unknown) => {
  const s = String(v ?? 'gray')
  if ((COLOURS as readonly string[]).includes(s)) return s
  return COLOURS.find((c) => colourValue(c) === s) ?? 'gray'
}

const chosenColour = computed({
  get: () =>
    picked.value ??
    (props.event ? nameOf(props.event.color) : (props.colourModel ?? 'gray')),
  set: (v: string) => {
    picked.value = v
    if (!props.event) emit('update:colourModel', v)
  },
})
const dotColor = computed(() => chosenColour.value)
const dotFill = computed(() => dot[dotColor.value] ?? dot.amber)
const colourOptions = computed(() =>
  COLOURS.map((c) => ({
    label: c[0]!.toUpperCase() + c.slice(1),
    icon: undefined,
    onClick: () => {
      chosenColour.value = c
      touch()
    },
    slots: {
      prefix: () =>
        h('span', {
          class: 'block shrink-0 rounded-1',
          style: { width: '12px', height: '12px', backgroundColor: dot[c] },
        }),
      suffix: () =>
        chosenColour.value === c
          ? h('span', { class: 'lucide-check size-4 text-ink-gray-6' })
          : null,
    },
  })),
)

/**
 * Every field in here is `sm` and `ghost`, as asked. The file draws the row
 * fields `sm outline` and the title `md subtle`; ghost is the one thing in
 * this panel that follows the instruction over the node.
 */
const field = '!h-7 w-full'

/**
 * A ghost field that cannot be typed in should still be a ghost field.
 * TextInput and Textarea wash themselves in `surface-gray-1` when disabled —
 * Select does not — so a panel opened to read had two of its rows filled and
 * the rest transparent, which read as an error rather than a state.
 */
const readable =
  '[&_input:disabled]:!bg-transparent [&_textarea:disabled]:!bg-transparent disabled:!bg-transparent'

/**
 * Create. The panel hands the page a whole event and the page keeps it; the
 * dashed block on the grid is the same span, so what is drawn where the drag
 * was is what lands there.
 */
function submit() {
  emit('create', {
    title: title.value || `New ${tab.value.toLowerCase()}`,
    fromDate: span.fromDate || todayIso(),
    toDate: span.toDate || span.fromDate || todayIso(),
    fromTime: allDay.value ? undefined : span.fromTime,
    toTime: allDay.value ? undefined : span.toTime,
    isFullDay: allDay.value,
    type: tab.value.toLowerCase(),
    color: dotColor.value,
    participant: attendees.value.join(', '),
    venue: location.value,
    description: description.value,
  })
}

/** Save: the same payload as Create, carrying the id it already had. */
function save() {
  emit('save', {
    id: props.event?.id,
    title: title.value,
    fromDate: span.fromDate,
    toDate: span.toDate,
    fromTime: allDay.value ? undefined : span.fromTime,
    toTime: allDay.value ? undefined : span.toTime,
    isFullDay: allDay.value,
    type: props.event?.type,
    color: dotColor.value,
    participant: attendees.value.join(', '),
    venue: location.value,
    description: description.value,
  })
}

function todayIso() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}
</script>

<template>
  <!--
    The file's side panel (nodes 35208:100549 empty, 35208:100687 filled):
    352 wide, full height beside the grid, sections divided by a hairline
    inset 20 either side. The header is 54 and the rows 40, each an 18px
    lead with a 90px label and the field filling what is left.
  -->
  <aside
    class="flex h-full w-[352px] shrink-0 flex-col overflow-y-auto border-l border-outline-gray-1 bg-surface-base"
  >
    <!-- Header, 54 tall -->
    <!-- `gap-1`, not 3: three icon buttons a hair apart read as one set of
         controls; 12 between them read as three unrelated things. -->
    <header class="flex shrink-0 items-center gap-1 px-5 py-[18px]">
      <h2 class="mr-2 min-w-0 flex-1 truncate text-lg-medium text-ink-gray-7">
        {{ creating ? `New ${tab}` : 'Event detail' }}
      </h2>
      <Button
        v-if="!creating && !editing"
        size="sm"
        variant="ghost"
        icon="lucide-pencil"
        aria-label="Edit event"
        @click="editing = true"
      />
      <Button
        v-if="!creating"
        size="sm"
        variant="ghost"
        icon="lucide-trash-2"
        aria-label="Delete event"
        @click="$emit('delete', event?.id)"
      />
      <Button
        size="sm"
        variant="ghost"
        icon="lucide-x"
        aria-label="Close"
        @click="$emit('close')"
      />
    </header>

    <!-- Event / Task, underlined as the file draws them -->
    <!--
      Inset 20, like the header above and the rules below. `!px-5` on
      `TabList` never landed — the padding is on the element it renders
      inside itself, so the class has to reach it from the root.
    -->
    <Tabs v-model="tab" class="shrink-0 [&_[role=tablist]]:!px-5">
      <TabList>
        <TabTrigger value="Event">Event</TabTrigger>
        <TabTrigger value="Task">Task</TabTrigger>
      </TabList>
    </Tabs>

    <!-- ── When ─────────────────────────────────────────────────────────── -->
    <!--
      20 above the title, which is what the footer leaves under the button.
      The panel's first field and its last control are the two things that
      sit against the panel's own ends, so they are the two that should be
      set off it by the same measure; every section between them keeps the
      10 that separates one from the next.
    -->
    <div class="flex flex-col pb-2.5 pt-5">
      <!--
        The file draws the title as a swatch button beside a field (node
        35235:66788). It draws both outlined; here they are ghost, which is
        the rule for every field in this panel.

        The swatch is the calendar the thing belongs to, and it opens on
        click — a square rather than the file's own glyph, because the square
        *is* the colour and a glyph would only stand for it.
      -->
      <!--
        Both ends land on 18, where every row below them does — but from
        different paddings, because only the left one has a button in front
        of it: 10 plus the swatch's own 8 on the lead, 18 flat on the tail.
      -->
      <div class="flex items-center gap-1 pb-1.5 pl-3 pr-5">
        <Dropdown
          :options="colourOptions"
          :disabled="locked"
          placement="bottom-start"
        >
          <template #trigger="{ open }">
            <Button
              size="sm"
              variant="ghost"
              :disabled="locked"
              :aria-label="`Colour: ${dotColor}`"
              :class="open && '!bg-surface-gray-3'"
            >
              <span
                class="block rounded-1"
                :style="{ width: '12px', height: '12px', backgroundColor: dotFill }"
              />
            </Button>
          </template>
        </Dropdown>
        <TextInput
          v-model="title"
          size="sm"
          variant="ghost"
          :disabled="locked"
          :class="`min-w-0 flex-1 ${readable}`"
          @update:model-value="touch"
          :placeholder="`${tab} Title`"
        />
      </div>

      <!--
        36 tall on the file's 4 above and below (node 35208:100549), the label
        at the same 14 the field labels carry — Switch sets its own to 13 at
        `sm`, which read as a different kind of thing from "Date" under it.

        `pr-[27px]`, not the row's 18: what stands at the right of every row
        below is a chevron, and a ghost Select holds its chevron 8 inside the
        field's own edge. The zone ends where they do rather than where the
        fields do, because the fields have no drawn edge to end at.
      -->
      <div class="flex h-9 items-center gap-3 py-1 pl-5 pr-[29px]">
        <Switch
          v-model="allDay"
          size="sm"
          label="All day"
          :disabled="locked"
          @update:model-value="touch"
          class="[&_label]:!text-base [&>span]:!text-base"
        />
        <span class="ml-auto flex items-center gap-1.5 text-base text-ink-gray-5">
          <span class="lucide-globe size-4 shrink-0" aria-hidden="true" />
          GMT+5:30
        </span>
      </div>

      <!--
        One row, either one day or several: a range picker takes a single day
        as a range of one, and an event dragged across a week of the month
        view has no other way to be shortened. Its own trigger, because the
        row reads as the ghost Selects under it and the picker's field does
        not — the chevron sits 8 inside the edge there, so it does here.
      -->
      <div class="flex h-10 items-center gap-3.5 px-5">
        <span class="w-[90px] shrink-0 text-base text-ink-gray-6">Date</span>
        <DateRangePicker
          :model-value="[span.fromDate, span.toDate]"
          :clearable="false"
          align="start"
          :disabled="locked"
          :class="field"
          @update:model-value="setDates"
        >
          <template #trigger="{ open, setOpen }">
            <button
              type="button"
              :disabled="locked"
              aria-label="Date"
              class="flex h-7 w-full items-center gap-2 rounded-4 pl-[9px] pr-2 text-base text-ink-gray-7 transition-colors hover:bg-surface-gray-2 disabled:hover:bg-transparent"
              @click="setOpen(!open)"
            >
              <span class="truncate">{{ dateLabel }}</span>
              <!--
                The file's own calendar glyph rather than a chevron (node
                35447:66251): a date field says what it opens by the thing it
                opens, where every other row on the panel is a list and says
                so with a chevron. 16 square in #999999, which is
                `ink-gray-4` here.
              -->
              <DateIcon class="ml-auto text-ink-gray-4" />
            </button>
          </template>
        </DateRangePicker>
      </div>

      <div v-if="!allDay" class="flex h-10 items-center gap-3.5 px-5">
        <span class="w-[90px] shrink-0 text-base text-ink-gray-6">Time</span>
        <!-- Two fields to one label: the file splits the row down the middle. -->
        <div class="flex min-w-0 flex-1 gap-2">
          <!-- Placed by hand over the field; see `menuOffset`. -->
          <Select
            :model-value="span.fromTime"
            :options="times"
            size="sm"
            variant="ghost"
            side="bottom"
            align="start"
            :offset="menuOffset"
            :disabled="locked"
            class="!h-7 min-w-0 flex-1"
            aria-label="Start time"
            @update:model-value="setFromTime"
          />
          <Select
            :model-value="span.toTime"
            :options="times"
            size="sm"
            variant="ghost"
            side="bottom"
            align="start"
            :offset="menuOffset"
            :disabled="locked"
            class="!h-7 min-w-0 flex-1"
            aria-label="End time"
            @update:model-value="setToTime"
          />
        </div>
      </div>
    </div>

    <div class="mx-5 shrink-0 border-t border-outline-gray-1" />

    <!-- ── How it behaves ───────────────────────────────────────────────── -->
    <div class="flex flex-col py-2.5">
      <!-- Whoever it is on, with their own face beside the name. -->
      <div
        v-if="tab === 'Task'"
        class="flex h-10 items-center gap-3.5 px-5"
      >
        <span class="w-[90px] shrink-0 text-base text-ink-gray-6">Assignee</span>
        <Select
          v-model="assignee"
          :options="assigneeOptions"
          size="sm"
          variant="ghost"
          :disabled="locked"
          :class="field"
          placeholder="Unassigned"
          @update:model-value="touch"
          aria-label="Assignee"
        >
          <template v-if="assignee" #prefix>
            <Avatar
              size="xs"
              class="!size-4 shrink-0"
              :label="assignee"
              :image="faceFor(assignee)"
            />
          </template>
          <template #item-prefix="{ item }">
            <Avatar
              size="xs"
              class="!size-4 shrink-0"
              :label="(item as { label: string }).label"
              :image="faceFor((item as { label: string }).label)"
            />
          </template>
        </Select>
      </div>

      <!-- Tags, typed rather than picked, each in a colour of its own. -->
      <div
        v-if="tab === 'Task'"
        class="flex min-h-10 items-start gap-3.5 px-5 py-1.5"
      >
        <span class="mt-1.5 w-[90px] shrink-0 text-base text-ink-gray-6">
          Tags
        </span>
        <div class="min-w-0 flex-1 [&>div]:w-full">
          <!--
            28 tall with one line of tags in it, growing only when they wrap:
            a 20px chip and 3px either side comes to 26, and the field's own
            border makes 28. It was `min-h-7` with a 24px chip and `py-1`,
            which pushed it to 32 the moment the first tag landed.
          -->
          <MultiSelect
            v-model="tags"
            :disabled="locked"
            class="!h-auto !min-h-7 w-full !py-[3px] !pl-2"
            size="sm"
            variant="ghost"
            placeholder="Add tags"
            :options="tagOptions"
            hide-search
            aria-label="Add tags"
            @update:model-value="touch"
          >
            <template #prefix><span class="hidden" /></template>
            <template #summary="{ selectedOptions }">
              <span
                v-if="!selectedOptions.length"
                class="text-base text-ink-gray-4"
              >
                Add tags
              </span>
              <span v-else class="flex min-w-0 flex-wrap items-center gap-1">
                <span
                  v-for="option in selectedOptions"
                  :key="option.value"
                  class="flex h-5 shrink-0 items-center gap-1 rounded-2 px-1.5 text-xs"
                  :class="tagTheme(option.label)"
                >
                  {{ option.label }}
                  <span
                    class="lucide-x size-3 cursor-pointer opacity-70 hover:opacity-100"
                    role="presentation"
                    @click.stop.prevent="removeTag(option.value)"
                  />
                </span>
              </span>
            </template>
            <!-- Six options need no Clear All / Select All either. -->
            <template #footer><span /></template>
            <!--
              Plain text down the menu, with a check on the far right for the
              chosen ones — the same shape the settings modal's people menu
              takes. A tag becomes a coloured chip when it lands in the field,
              not before: a menu of chips reads as a set of things already
              picked.
            -->
            <template #item-suffix="{ selected }">
              <span
                v-if="selected"
                class="lucide-check size-4 text-ink-gray-6"
                aria-hidden="true"
              />
            </template>
          </MultiSelect>
        </div>
      </div>

      <div
        v-for="(options, label) in tab === 'Task'
          ? taskOptions
          : behaviourOptions"
        :key="label"
        class="flex h-10 items-center gap-3.5 px-5"
      >
        <span class="w-[90px] shrink-0 text-base text-ink-gray-6">
          {{ label }}
        </span>
        <Select
          v-model="(tab === 'Task' ? taskFields : behaviour)[label]"
          :options="options"
          size="sm"
          variant="ghost"
          :disabled="locked"
          :class="field"
          @update:model-value="touch"
          :aria-label="label"
        />
      </div>

      <!-- Organisation, with the file's own marks — as Link carries them. -->
      <div
        v-if="tab === 'Task'"
        class="flex h-10 items-center gap-3.5 px-5"
      >
        <span class="w-[90px] shrink-0 text-base text-ink-gray-6">
          Organisation
        </span>
        <Select
          v-model="organisation"
          :options="orgOptions"
          size="sm"
          variant="ghost"
          :disabled="locked"
          :class="field"
          placeholder="Select option"
          @update:model-value="touch"
          aria-label="Organisation"
        >
          <template v-if="orgLogo" #prefix>
            <img
              :src="orgLogo"
              alt=""
              class="size-4 shrink-0 rounded-1 object-cover"
            />
          </template>
          <template #item-prefix="{ item }">
            <img
              v-if="(item as { logo?: string }).logo"
              :src="(item as { logo?: string }).logo"
              alt=""
              class="size-4 shrink-0 rounded-1 object-cover"
            />
          </template>
        </Select>
      </div>
    </div>

    <!--
      The rule belongs to the section it opens, not to the panel: left on its
      own when the Task face hid the section below it, it stacked against the
      next one and read as a 2px line.
    -->
    <template v-if="tab === 'Event'">
    <div class="mx-5 shrink-0 border-t border-outline-gray-1" />

    <!-- ── What it is attached to ───────────────────────────────────────── -->
    <div class="flex flex-col py-2.5">
      <div class="flex h-10 items-center gap-3.5 px-5">
        <span class="w-[90px] shrink-0 text-base text-ink-gray-6">Link</span>
        <Select
          v-model="link"
          :options="linkOptions"
          size="sm"
          variant="ghost"
          :disabled="locked"
          :class="field"
          @update:model-value="touch"
          aria-label="Link"
        >
          <template v-if="linkLogo" #prefix>
            <img
              :src="linkLogo"
              alt=""
              class="size-4 shrink-0 rounded-1 object-cover"
            />
          </template>
          <template #item-prefix="{ item }">
            <img
              v-if="(item as { logo?: string }).logo"
              :src="(item as { logo?: string }).logo"
              alt=""
              class="size-4 shrink-0 rounded-1 object-cover"
            />
          </template>
        </Select>
      </div>

      <!--
        People, as the settings modal does it: frappe-ui's MultiSelect with
        Espresso's menu — a filled search at the top, 32px rows on a 10px
        radius, an avatar at the lead and a check on the chosen ones — and
        the picked people as tags inside the field rather than a list
        stacked under it.
      -->
      <div class="flex min-h-10 items-start gap-3.5 px-5 py-1.5">
        <span class="mt-1.5 w-[90px] shrink-0 text-base text-ink-gray-6">
          People
        </span>
        <!--
          MultiSelect hugs its contents: its root is an unclassed wrapper and
          the class goes to the trigger inside it, so an empty field came to
          127 against the 211 the Link select above it takes and the two right
          edges disagreed. The wrapper is what has to fill the row, so it is
          given the width and the trigger told to fill it.
        -->
        <div class="min-w-0 flex-1 [&>div]:w-full">
        <MultiSelect
          v-model="attendees"
          :disabled="locked"
          @update:model-value="touch"
          class="h-auto min-h-7 w-full py-1 !pl-2 [&>button]:!w-full [&_[data-slot=item-prefix]>span>div:first-child]:hidden"
          size="sm"
          variant="ghost"
          placeholder="Add attendee"
          :options="people"
          hide-search
          aria-label="Add attendee"
        >
          <template #prefix><span class="hidden" /></template>

          <template #summary="{ selectedOptions }">
            <span
              v-if="!selectedOptions.length"
              class="text-base text-ink-gray-4"
            >
              Add attendee
            </span>
            <span v-else class="flex min-w-0 flex-wrap items-center gap-1">
              <span
                v-for="option in selectedOptions"
                :key="option.value"
                class="flex h-6 shrink-0 items-center gap-1 rounded-3 bg-surface-gray-2 py-[4.5px] pl-1.5 pr-1 dark:bg-surface-gray-4"
              >
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
                  @click.stop.prevent="removeAttendee(option.value)"
                />
              </span>
            </span>
          </template>

          <template #footer><span /></template>

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
      </div>
    </div>
    </template>

    <div class="mx-5 shrink-0 border-t border-outline-gray-1" />

    <!-- ── What it carries ──────────────────────────────────────────────── -->
    <!--
      The same rhythm as the rows above: a 28-tall field with 12 between one
      and the next, and 16 from the rule either side — which is what a 40px
      row with a 28px field in it comes to. The fields were 32 with 4
      between them, so the section read tighter to its rules than every
      other section on the panel.
    -->
    <div class="flex flex-col gap-3 px-5 py-4">
      <Select
        v-model="meet"
        :disabled="locked"
        @update:model-value="touch"
        :options="[
          { label: 'Google meet', value: 'meet' },
          { label: 'Zoom', value: 'zoom' },
        ]"
        placeholder="Add video conference"
        size="sm"
        variant="ghost"
        class="!h-7 w-full"
        aria-label="Video conference"
      >
        <template #prefix>
          <span
            class="lucide-video size-4 shrink-0 text-ink-gray-5"
            aria-hidden="true"
          />
        </template>
      </Select>

      <TextInput
        v-model="location"
        size="sm"
        variant="ghost"
        :disabled="locked"
        :class="`!h-7 w-full ${readable}`"
        @update:model-value="touch"
        placeholder="Add location"
      >
        <template #prefix>
          <span
            class="lucide-map-pin size-4 shrink-0 text-ink-gray-5"
            aria-hidden="true"
          />
        </template>
      </TextInput>
    </div>

    <div class="mx-5 shrink-0 border-t border-outline-gray-1" />

    <div class="px-5 py-4">
      <Textarea
        v-model="description"
        size="sm"
        variant="ghost"
        :disabled="locked"
        @update:model-value="touch"
        :rows="2"
        :class="`w-full ${readable}`"
        placeholder="Add description"
      />
    </div>

    <!--
      The file's footer: one solid button, full width, always in view. Making
      and changing are the same panel, so it is the same button — "Create" on
      a new one, "Save changes" on one being edited, and nothing at all on one
      only being read.
    -->
    <div
      v-if="creating || editing"
      class="mt-auto shrink-0 border-t border-outline-gray-1 p-5"
    >
      <Button
        variant="solid"
        class="w-full"
        :disabled="editing && !dirty"
        :label="creating ? `Create ${tab.toLowerCase()}` : 'Save changes'"
        @click="creating ? submit() : save()"
      />
    </div>
  </aside>
</template>

<!--
  Espresso's multiselect menu, the same treatment the settings modal's
  "Invite people" carries. The menu is portalled out of this component, so a
  class on the field cannot reach it — hence a plain (unscoped) block. None of
  it goes to frappe-ui until the team has validated the menu and the tag.
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
