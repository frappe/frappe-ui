<template>
  <!-- One listed event in the Agenda, read as a row rather than a pill. -->
  <CalendarEventPopover
    v-model:open="isPopoverOpen"
    side="bottom"
    :calendar-event="calendarEvent"
    :date="date"
    @open="registerDeleteShortcut"
    @close="unregisterDeleteShortcut"
    @edit="handleEventEdit"
    @delete="handleEventDelete"
  >
    <!-- A row is a pill lying down: the same tinted block the grid views
         draw, with the calendar's colour as its fill and the pill's own bar
         of that colour inside its left edge — 2px, rounded, a pixel short of
         the text at either end, so it reads as a mark set in the block and
         not as a border the block was given — so the Agenda and the Week
         read as one set of events at two ranges rather than two lists that
         happen to agree. It is an `.event` in the stylesheet's terms — fill,
         bar, muted ink, draft outline, hover, open and past are the pill's
         rules — with the pill's `mx-px` and grid geometry left off. The block
         carries its own edges, which is what lets the hairlines go — between
         rows, and down the gutter's side — and lets the rows stand 4px apart
         instead of flush.

         Wide, one line: the time in a column, then the title with what the
         row can add about it, then who is coming. Narrow, the row is two
         lines: the title and its tags on the first, the time and the
         description on the second, and the faces at the far end centred on
         the pair. The time column went under the title because it is the
         widest thing on the row that is not the title — 132px of a phone's
         390 — and a column is only worth its width when there is a title
         beside it to align. Under the title the time is still the first
         thing on its line, so a reader scanning for "when" finds it in the
         same place on every row: the left, one line down.

         Radius and padding step with the layout: the wide row is one line
         and takes the pill's own 6px corner and a tight 6px of vertical
         padding, so a day of rows stays a list; the narrow block is two
         lines tall and takes a size up of both, so a block does not read as
         a cramped card. -->
    <div
      class="event calendar-row flex w-full gap-1.5 pl-1.5 pr-3 text-left"
      :class="{
        narrow: props.narrow,
        'rounded-4 py-2.5': props.narrow,
        'rounded-3 py-1.5': !props.narrow,
        active: activeEvent == (props.event?.id || props.event?.name),
        past: isPast,
        'event-draft': !!props.event.isDraft,
      }"
      :style="eventBgStyle"
      role="button"
      tabindex="0"
      @click.prevent="onClick($event)"
      @dblclick.prevent="handleEventEdit($event)"
      @keydown.enter.prevent="onKeydown($event)"
      @keydown.space.prevent="onKeydown($event)"
    >
      <!-- The bar, as the pill draws it: 2px, rounded, stretched to the
           row's content and a pixel short of it at either end. Not drawn on
           a draft — a draft's dashed outline is its mark, and a draft has
           no calendar to be barred in yet — but its room is kept: the times
           down a day are a column, and a draft whose time started where
           the others' bars do was the one row out of line. The pill leaves
           the bar out altogether, but a pill's title is aligned to nothing
           beside it. -->
      <span
        class="event-border my-px w-[2px] shrink-0 self-stretch rounded-4"
        :class="{ invisible: props.event.isDraft }"
      />
      <!-- What the row says, in a flex line of its own so the bar stands
           6px off it, the pill's gap, while the things on the line keep the
           wider gaps a line of text needs between its parts. Wide, one line
           on a baseline; narrow, two lines with the faces centred on them. -->
      <div
        class="flex min-w-0 flex-1"
        :class="props.narrow ? 'items-center gap-3' : 'items-baseline gap-2.5'"
      >
        <!-- The time, in a column of its own against the block's left edge:
           the titles line up under each other whatever each row's label says,
           which is what makes a day read as a day rather than as three
           sentences. In the calendar's own muted ink, as a pill's subtitle
           is, rather than the list's gray: on a tinted ground gray reads as
           dirt.

           132px holds the widest label ("11:30 am – 12:45 pm", 128px). A
           column sized to the common "2:30 – 3:30 pm" would let that one
           overrun the bar it is supposed to stop short of.

           Only where the row is wide: narrow, the time moves under the
           title, further down.

           gray-7, a step over the description's gray-6 and a step short of
           the title's gray-8: the time is the second thing a reader looks
           up, and the first when scanning down a day for "what is at
           four", and at the description's ink it ranked with "Studio" and
           "4 people", which are read once. Ink rather than weight — a
           medium time beside a medium title competed with it, where a
           darker regular one sits under it. -->
        <span
          v-if="!props.narrow"
          class="calendar-row-time w-33 shrink-0 whitespace-nowrap text-xs tabular-nums text-ink-gray-7"
        >
          {{ timeLabel }}
        </span>
        <!-- Title, then what the row can add about it, on one line: a row is
           wide and a title is short, so a second line spends the height of
           two rows to say what fits beside the first.

           Narrow, two lines, each a flex row of its own: the title with its
           tags, then the time with the description. Not one wrapping row —
           a flex line breaks on what its items would measure unshrunk, so a
           long title took a line to itself, the tag after it fell to a
           second, and the time to a third. Explicit lines put the tag on
           the title's line whatever the title's length, and the title is
           the one thing on that line that gives, truncating where the
           description used to for it.

           Wide, the first line's wrapper is `contents` and the description
           stays in it between the title and the tags, as it always was;
           narrow, the description moves to the second line, so it is
           rendered in one place or the other and the slot filled once. -->
        <span
          class="flex min-w-0 flex-1"
          :class="props.narrow ? 'flex-col gap-0.5' : 'items-baseline gap-2'"
        >
          <span
            :class="
              props.narrow ? 'flex min-w-0 items-baseline gap-2' : 'contents'
            "
          >
            <!-- Declined reads the same here as on a pill: struck through and
               muted, still plainly the event you said no to. -->
            <!-- leading-5 and leading-4 below, rather than the sizes' own 1.15: at
               13px that leaves a 14.95px line box for glyphs that stand 16px, and
               truncate's overflow-hidden then slices the descender off a g or a y.
               The line box has to clear the ink before it can be clipped for width. -->
            <span
              class="calendar-row-title truncate leading-5"
              :class="[
                props.narrow
                  ? 'min-w-0 text-base-medium'
                  : 'shrink-0 text-sm-medium',
                props.event.isDeclined
                  ? 'line-through text-ink-gray-5'
                  : 'text-ink-gray-8',
              ]"
            >
              {{ props.event.title || '[No title]' }}
            </span>
            <span
              v-if="!props.narrow && hasDescription"
              class="calendar-row-description event-subtitle min-w-0 truncate text-xs leading-4"
            >
              <slot name="event-description" v-bind="slotProps">
                {{ description }}
              </slot>
            </span>
            <!-- Nothing of the library's own goes here — the slot is where a
               consumer's tags go. The one tag a row used to derive said
               "Draft", which the block already says by being an outline
               rather than a fill; a word for it as well spent the row's most
               valuable end on something the block had said all over.

               Gone when nothing fills it: the slot is always handed down from
               the calendar, filled or not, and an empty box is still a flex
               item — a gap either side of nothing, which put the tag after it
               twice as far from the description as the description is from
               the title. -->
            <span class="flex shrink-0 items-center gap-1 empty:hidden">
              <slot name="event-suffix" v-bind="slotProps" />
            </span>
            <!-- Where it stands against the clock, right after what the row
               says about the event: it is one more thing said about it, and
               read in the same pass. It used to sit beside the time, which is
               where a reader scanning for "when" is looking — but a card gives
               the time a fixed column, and a badge in front of it pushes one
               row's time out of line with the rest. And it used to stand at
               the row's far end, which put the one word that changes what a
               reader does the width of the card away from the event it is
               about. -->
            <Badge
              v-if="timing"
              :theme="timing.theme"
              :variant="timing.variant"
              :label="timing.label"
              size="sm"
              class="shrink-0"
            />
          </span>
          <!-- The second line: the time, then what the row adds about the
             event, in the ink and size the description has on a wide row.
             The time leads it so a reader scanning for "when" finds it in
             the same place on every row — the left, one line down. -->
          <span
            v-if="props.narrow"
            class="event-subtitle flex min-w-0 items-baseline gap-1.5 text-sm leading-4"
          >
            <!-- The same step over the description it has in its column. -->
            <span
              class="calendar-row-time shrink-0 whitespace-nowrap tabular-nums text-ink-gray-7"
            >
              {{ timeLabel }}
            </span>
            <span
              v-if="hasDescription"
              class="calendar-row-description min-w-0 truncate"
            >
              <slot name="event-description" v-bind="slotProps">
                {{ description }}
              </slot>
            </span>
          </span>
        </span>
        <!-- Who is coming, at the row's far end: a count, which is a column's
           worth of fact rather than a sentence's, and the card's right edge
           is the one place other than the time column that a row is aligned
           on — so the counts of a day's rows line up under each other the
           way their times do. The slot is for a consumer that can put faces
           to the count — it has the participants, the library has a string —
           and the count is what it gets when nothing fills it. Centred on
           the row rather than on its baseline: a face has no baseline, and a
           stack of them hung off the title's dropped below the line. -->
        <span
          v-if="hasParticipant"
          class="calendar-row-participant event-subtitle flex shrink-0 items-center gap-1.5 self-center whitespace-nowrap text-xs leading-4"
        >
          <slot name="event-participant" v-bind="slotProps">
            {{ props.event.participant }}
          </slot>
        </span>
      </div>
    </div>
    <template #event-popover-content="slotProps">
      <slot name="event-popover-content" v-bind="slotProps" />
    </template>
  </CalendarEventPopover>
</template>

<script setup lang="ts">
import './style.css'

import { computed, ref, useSlots } from 'vue'
import { Badge } from '#components/Badge'
import CalendarEventPopover from './CalendarEventPopover.vue'
import { useEventBase } from './useEventBase'
import { useNow } from './composables/useNow'
import { hasEnded, rowDescription, rowTimeLabel, rowTiming } from './eventRow'
import type { CalendarEvent, CalendarRowSlotProps } from './types'

const props = defineProps<{
  event: CalendarEvent
  /** The day the row belongs to; a multi-day event has one row per day. */
  date: Date
  /**
   * Drawn as two lines rather than one, the time under the title: the list's
   * call, made from its own width, for every row at once.
   */
  narrow?: boolean
}>()

const slots = useSlots()
const now = useNow()

const {
  activeEvent,
  config,
  calendarActions,
  calendarEvent,
  eventBgStyle,
  markActive,
  handleEventClick,
  handleEventEdit,
  handleEventDelete,
  registerDeleteShortcut,
  unregisterDeleteShortcut,
} = useEventBase(props)

const isPopoverOpen = ref(false)

const timeLabel = computed(() =>
  rowTimeLabel(props.event, config.timeFormat, props.date),
)
const description = computed(() => rowDescription(props.event, props.date))
const timing = computed(() => rowTiming(props.event, props.date, now.value))
const isPast = computed(() => hasEnded(props.event, props.date, now.value))

// An empty description line would still take its leading, so the row only
// grows one when there is something to put on it.
const hasDescription = computed(
  () => !!description.value || !!slots['event-description'],
)
// Likewise the far end: a consumer with faces to show has them for an event
// the library holds no count for, so the slot alone is reason to render it.
const hasParticipant = computed(
  () => !!props.event.participant || !!slots['event-participant'],
)

const slotProps = computed<CalendarRowSlotProps>(() => ({
  calendarEvent: calendarEvent.value,
  date: props.date,
  description: description.value,
  timing: timing.value,
}))

// What a click does is the pill's business exactly: `handleEventClick` waits
// 200ms for a double click, then hands the event to the host's `onClick` if it
// set one, or opens the popover.
function onClick(e: MouseEvent) {
  handleEventClick(e, togglePopover, isPopoverOpen.value)
}

// Keyboards do not double click, and `handleEventClick` reads `e.detail` — 0
// for a key — so activation from the keyboard takes the short way round rather
// than sitting in a timer that never fires.
function onKeydown(e: KeyboardEvent) {
  markActive()
  if (calendarActions.props.onClick)
    calendarActions.props.onClick({ e, calendarEvent: calendarEvent.value })
  else togglePopover()
}

function togglePopover() {
  isPopoverOpen.value = !isPopoverOpen.value
}
</script>
