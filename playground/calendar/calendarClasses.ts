/**
 * The Espresso treatment for frappe-ui's experimental `Calendar`, measured off
 * the week view (node 35208:100256).
 *
 * What the file sets, and where it goes:
 *
 *   hour row 70 ······· `config.hourHeight`
 *   day column 164 ···· the width it is given, ÷ 7
 *   hour gutter 72 ···· here (the component's own is 56)
 *   day strip 32 ······ `h-8` already; the 4px under it is taken back here
 *   all-day row 34 ···· a floor set here; the row still grows for its bars
 *   no outer box ······ `config.noBorder` — the file draws rules, not a card
 *
 * Nothing is shaded: the file marks no weekend, and neither does the
 * component. Every class is spelled out, because Tailwind reads this file as
 * text and a name assembled from a variable would never be generated.
 */
export const espressoCalendar = [
  // The grid's own lines, at the file's weight and colour (#EDEDED).
  '[&_[class*=border]]:border-outline-gray-1',

  // The gutter: 72 in the file, and the same 72 in all three places the
  // component sets it — the day strip's spacer, the all-day label's column
  // and the hour column — so the left edge stays one line.
  // `shrink-0` with it: the day strip's spacer has none of its own, so the
  // grid beside it squeezed the one gutter that heads the dates out of line
  // with the two below.
  '[&_.w-14]:!w-[72px]',
  '[&_.w-14]:!shrink-0',

  // The hours hang off the first day column. The component pins them 45px
  // left of it, which was 11px inside a 56 gutter; the file sets them against
  // the gutter's right edge instead, 10px off the rule.
  // `nowrap` with them: pinned by its right edge alone, the label's room is
  // what is left of the column, which is nothing — "3 pm" broke over two
  // lines.
  '[&_.calendar-column_*::before]:!left-auto',
  '[&_.calendar-column_*::before]:!right-[calc(100%+10px)]',
  '[&_.calendar-column_*::before]:!whitespace-nowrap',

  // The file's day strip is 32 and the all-day row starts where it ends. The
  // component pads 4 under it; `>div>` is the week view's own root, so the
  // phone's stacked header (which pads for a reason) is left alone.
  '[&>div>.pb-1]:!pb-0',

  // …and the rule that closes it sits inside those 32, not under them. The
  // box below draws it as a top border, which added a 33rd pixel; pulled up
  // one, the strip and the rule together are the 32 the file draws — the
  // same 32 the Day view's band comes to.
  '[&>div>.overflow-hidden]:!-mt-px',

  // A date in the week's header is a label here, not a way into its day: the
  // file has no day-view jump on it, so the header takes no clicks — which
  // also takes away the hover bubble on the numeral and the hand cursor.
  '[&_.grid-cols-7>span]:!pointer-events-none',

  // ── The day cell (node 35235:67217) ──────────────────────────────────────
  //
  // The file sets an ordinary day as one line of text — "Sun 17", 14/regular
  // in #525252, a plain word space between the name and the number. The
  // component gives the number a 24px disc and stands it 6px off the name,
  // which reads as two things rather than one. The disc comes off, the gap
  // comes down to a space's worth, and the ink comes back a step: the
  // component sets ink-gray-7, which is #383838 here.
  '[&_.grid-cols-7>span]:!gap-1',
  '[&_.grid-cols-7>span]:!text-ink-gray-6',
  '[&_.grid-cols-7>span>span:last-child:not(.bg-surface-gray-10)]:!size-auto',

  // …and the same red on the month grid's own mark for today, which the
  // component draws in the near-black it uses for a selection. The shape is
  // the month grid's: a disc, where the week's label carries a tag.
  '[&_[data-week-row]_.bg-surface-gray-10]:!bg-surface-red-7',
  '[&_[data-week-row]_.bg-surface-gray-10]:hover:!bg-surface-red-7',
  '[&_[data-week-row]_.bg-surface-gray-10]:!text-white',

  // Today is the one day that is marked, and the file marks it with a tag,
  // not a disc: 26x24, radius 6, solid `surface-red-7` — Badge's own red —
  // with the name beside it a step darker and 8px away.
  '[&_.grid-cols-7>span:has(.bg-surface-gray-10)]:!gap-2',
  '[&_.grid-cols-7>span:has(.bg-surface-gray-10)]:!text-ink-gray-7',
  '[&_.grid-cols-7>span>span.bg-surface-gray-10]:!bg-surface-red-7',
  '[&_.grid-cols-7>span>span.bg-surface-gray-10]:!text-white',
  '[&_.grid-cols-7>span>span.bg-surface-gray-10]:!rounded-3',
  '[&_.grid-cols-7>span>span.bg-surface-gray-10]:!h-6',
  '[&_.grid-cols-7>span>span.bg-surface-gray-10]:!w-auto',
  '[&_.grid-cols-7>span>span.bg-surface-gray-10]:!px-[5px]',

  // The all-day band: 34 in the file with nothing in it. A floor, not a
  // height — a week with bars in the row still gets its lanes.
  '[&_.h-fit]:!min-h-[34px]',

  // …and it is one band, not seven cells. The component rules between the
  // days up here as it does in the grid below; the file draws the row
  // unbroken, with only the gutter's rule at its left and its own underneath.
  '[&_.h-fit_.cell]:!border-r-0',

  // ── Now (node 35208:100256, `Group 482586`) ──────────────────────────────
  //
  // The file draws three things at the current time, not one:
  //
  //   a 1px hairline in #F79596 across the whole week   → surface-red-5
  //   a 2px line in #E03636 over today alone            → surface-red-6
  //   a 2px x 12 tick at today's left edge, same red
  //
  // The component draws the middle one and heads it with an 8px dot, both
  // inside today's column — so there is nothing across the other six days.
  //
  // The hairline is a pseudo-element on the week's grid, which spans all
  // seven; `--now-top` is set on the calendar from the clock, because that
  // one value cannot be a class. `.z-0>` picks the time grid out from the
  // all-day band, which carries the same `data-day-columns`.
  '[&_.z-0>[data-day-columns]]:before:content-[""]',
  '[&_.z-0>[data-day-columns]]:before:absolute',
  '[&_.z-0>[data-day-columns]]:before:inset-x-0',
  // Half a pixel down, so the two lines are concentric rather than sharing a
  // top edge. The file strokes both on one axis — a 1px hairline and a 2px
  // segment centred on the same y — where a top-aligned 1px and 2px differ by
  // half a pixel, which is exactly the sliver of pale red that showed above
  // today's line.
  '[&_.z-0>[data-day-columns]]:before:top-[calc(var(--now-top)+0.5px)]',
  '[&_.z-0>[data-day-columns]]:before:h-px',
  '[&_.z-0>[data-day-columns]]:before:bg-surface-red-5',
  // Over the cards, the way today's line already runs over them. A
  // `::before` is its element's first child in paint order, so the hairline
  // was going under every pill it crossed — visible on an empty day and gone
  // behind the next event. The pills sit at 1 and up (100 while one is being
  // dragged, which should stay on top of both lines), so 10 clears them.
  '[&_.z-0>[data-day-columns]]:before:z-10',

  // …and the dot at today's head becomes the file's tick: a 2px bar with
  // round ends — the file draws it as a stroked vector with a ROUND cap, so
  // its 12 is painted as 14 with a half-round at each end.
  //
  // It stands at the line's head rather than on it. The file puts the tick
  // at the column's 3rd pixel and starts the line at its 6th, so the two
  // touch and no line runs out to the tick's left; the component's line
  // starts at the column's 1st, which left a stub sticking out before the
  // mark.
  // The line starts under the tick, not after it: a tick that ends where the
  // line begins leaves a pixel of white between them. The tick stands at the
  // column's 3rd and 4th pixels and the line runs from its 4th, so they
  // overlap by one and read as one mark.
  // …and today's line above the hairline, so the pale one does not show as a
  // stripe down the middle of it.
  '[&_.current-time]:!z-20',
  '[&_.current-time]:!ml-[2px]',
  // …and the same air at the other end. The segment is a block, so it ran to
  // the column's edge while the tick held it 4 off the left — a line that is
  // centred in its cell everywhere except where it starts.
  '[&_.current-time]:!mr-[1px]',
  '[&_.current-time]:before:!left-[-1px]',
  '[&_.current-time]:before:!top-[-6px]',
  '[&_.current-time]:before:!h-[14px]',
  '[&_.current-time]:before:!w-0.5',
  '[&_.current-time]:before:!rounded-full',

  // ── The month grid ───────────────────────────────────────────────────────
  //
  // A week's row is a fixed share of the strip, not its contents. The rows are
  // `flex-1 basis-0` already, but a flex item's `min-height` is `auto`, so a
  // day with six events on it grew its whole row and every other row shrank.
  '[&_[data-week-row]]:!min-h-0',

  // …and the card a month drag leaves where it was picked up from, at the
  // weight the week's leaves: the component fades its own to a half, the
  // week draws a copy at 40, and the same gesture in two views should not
  // leave two different marks behind.
  '[&_[data-week-row]_.opacity-50]:!opacity-40',

  // ── The cards' colours (harsha file, node 35406:63902) ───────────────────
  //
  // Every fill and ink in the file is already a frappe-ui token, and the
  // component's own `colorMap` already reaches for them: `surface-{c}-1` for
  // the fill, `ink-{c}-6` for the title and the bar, `surface-{c}-2` for the
  // hover. Measured against the file — #F8F8F8/#525252 gray, #F7F6FE/#6E57D1
  // violet, #FFF5F5/#CE2C2C red, #FDF8ED/#CA7E0E amber, #F1F8FE/#077DDF blue,
  // #F0FAF3/#258C5C green — all six match to the pixel.
  //
  // Two things do not. The title is set in no colour at all — `colorMap` has
  // a `color` for it, but `useEventBase` writes out `--bg`, `--subtext`,
  // `--bg-active` and `--border` and never that one, so the title inherits
  // the page's ink and a violet card carried a black name. And the time under
  // it is `ink-gray-6`, where the file sets it in the card's own ink at 70%.
  //
  // `--border` holds that same ink and the component does write it, so both
  // hang off it: the title at full strength, the time at 70%.
  '[&_.event-title]:![color:var(--border)]',
  // …and the task glyph with it. It draws in `currentColor`, which without
  // this is whatever the page's ink happens to be — so a task's mark stayed
  // black beside its own amber name.
  '[&_.event_svg]:![color:var(--border)]',

  // The glyph is 14 in a 16 box, 6 from the text (node 35402:112647): the
  // file puts a 16px prefix frame on the title's own 16px line and sets a
  // 14px icon 1px inside it, so the mark is centred on the first line rather
  // than hung from the top of it. The component draws it at 16 and stands it
  // 8 away, which read as a size too big and a hair too high.
  '[&_.event_svg]:!size-3.5',
  '[&_.event_svg]:!mt-px',
  '[&_.event_.gap-2]:!gap-1.5',
  '[&_.event-subtitle]:![color:color-mix(in_srgb,var(--border)_70%,transparent)]',

  // A draft — the span waiting on the panel — carries no edge at all: no
  // dash, nothing. Its fill is the event's own, so picking blue in the panel
  // turns the block blue, ground and ink together.
  //
  // The component gives a draft `surface-base` on purpose, to hold its
  // dashed outline off the grid — two classes' worth, which beats the one
  // that paints `--bg`. Without this the block stayed white whatever was
  // picked.
  '[&_.event-draft]:![background-color:var(--bg)]',
  '[&_.event-draft]:!outline-none',

  // The pill the component is carrying goes invisible while it is held.
  //
  // It snaps the pill to the day column and the quarter hour under the
  // pointer, which is where the card would land — the right place for the
  // blank slot, and the wrong place for the card, which belongs under the
  // cursor. So the snapped pill lends the slot its shape and stops being
  // drawn; `useDragShadow` draws all three copies. `cursor: grabbing` is the
  // one mark the component leaves on it while it is held.
  '[&_[style*=grabbing]]:!opacity-0',

  // …and the same 1px off the top and the bottom, which the component does
  // not give a timed pill: it runs the full height of its hours, so an event
  // ending at three and one starting at three met on a single line and read
  // as one block whenever they shared a colour. The height comes down by the
  // two so the pill still ends on its own hour (node 35208:100278 — a 161×67
  // card in a 164×70 cell, 2/1/1/1). The all-day band is left alone: its
  // bars are a row of a list, not a span of hours.
  '[&_[data-time-grid]_.event]:!my-px',
  '[&_[data-time-grid]_.event]:!h-[calc(100%-2px)]',

  // Event cards: the file draws a tinted block with a 2px bar down its lead
  // edge, sitting 2px in from the column's left and 1px from the others.
  '[&_[data-slot=calendar-event]]:!rounded-4',
  '[&_[data-slot=calendar-event]]:!ml-0.5',
  '[&_[data-slot=calendar-event]]:!mr-px',
].join(' ')

/** Hour height, day-column width and gutter, straight from the file. */
/**
 * The one case the event's own fill cannot serve: a draft nobody has chosen a
 * colour for. `colorMap` has no `gray`, so that one arrives as a hex and the
 * component derives a 10% wash from it — noticeably darker than the
 * `surface-gray-1` the drag band wore a moment earlier. Applied only while
 * the colour is still the default, so the moment one is picked the event's
 * own ground takes over.
 */
export const espressoGreyDraft =
  '[&_.event.event-draft]:!bg-surface-gray-1'

export const grid = {
  hourHeight: 70,
  dayWidth: 164,
  gutterWidth: 72,
  dayStripHeight: 32,
  allDayHeight: 34,
}

/**
 * The file's month picker (node 35247:71977), cell by cell:
 *
 *   panel ······ 196 wide, radius 12, padding 8
 *   header ····· 24 tall — the month at 13/500 with a chevron, and three
 *                22x24 movers 4 apart
 *   grid ······· 180 wide, 6 to the header. Every cell 24 square, radius 5,
 *                2 apart both ways; the weekday letters 12/regular
 *                ink-gray-4, the dates 12/regular, the selected one filled
 *                ink-gray-8.
 *
 * 8 + 180 + 8 = 196 across. Down, the file's 200 is a five-row June; the
 * component always draws six, which is 8 + 24 + 6 + 180 + 8 = 226.
 *
 * frappe-ui's DatePicker draws this at a roomier size — 224 wide, every cell
 * 28 square on a radius of 8 — and exposes no way to size its panel, so the
 * panel is sent to a target this page owns and sized there. Everything hangs
 * off the calendar panel's own root, which the single picker and the range
 * picker are both built from: a Select's menu lands in the same target and
 * has none of it, so nothing else is touched.
 */
/**
 * Eight rows of a Select's menu, and the rest scrolled to.
 *
 * Every quarter hour of the day is 96 rows, which drew a panel taller than
 * the window. The list is already a scroller — it only ever wanted a ceiling:
 * eight 28-tall rows on the panel's own 4 above and below.
 */
/**
 * What a copy of a card needs to look like the card.
 *
 * The overlays a drag draws are rendered beside the calendar rather than in
 * it, so none of the overrides above reach them — and the first thing to go
 * was the title's ink, which is written from the card's own `--border` and
 * fell back to whatever it inherited. Grey, in the middle of a drag, on a
 * card that is meant to be unchanged.
 */
/**
 * The agenda, brought into the page's own measure.
 *
 * The list is the component's, and most of it already reads as Espresso: a
 * card per week, a rule between days, a tinted block per event with the
 * calendar's 2px bar down its lead edge. What it does not know is the page
 * it is on — it draws to the panel's edges where every other view on this
 * one is held 20 in — and it leaves an event's title in the page's own ink
 * where the grids take it from the calendar the event belongs to.
 */
export const espressoAgenda = [
  // The 20 either side the sub-header and the grid both keep, and the same
  // again at the foot so a scroll does not end on a card's border.
  '[&_.overflow-y-auto.bg-surface-base]:!px-5',
  '[&_.overflow-y-auto.bg-surface-base]:!pb-5',

  // An event reads as the card it is in the grids: the same 8px corner…
  '[&_.calendar-row]:!rounded-4',
  // …and the same ink, which is the calendar's own rather than the page's.
  '[&_.calendar-row-title]:![color:var(--border)]',

  // …and no list of who is on it. The row keeps a block for the people an
  // event is with, and with no faces to put there it falls back to the
  // string the panel wrote — every address in full, in the calendar's own
  // colour, which read as a second title rather than as a detail. Who is
  // coming is what the card opens to say; the line a day is scanned down is
  // not the place for it.
  '[&_.calendar-row-participant]:!hidden',
].join(' ')

/**
 * The agenda again, with the fill held back until the pointer arrives.
 *
 * A list is read down its left edge: the bar and the ink already say which
 * calendar a thing is on, and a tinted band behind every row says it a
 * second time — across the whole width of the card, which is where the eye
 * is trying to run. Held for hover, the colour becomes the answer to
 * "which one am I on" rather than a property of the row.
 *
 * The fill is the event's own `--bg`, which `useEventBase` writes on the
 * row, so each row comes back in its own colour rather than a grey.
 */
export const espressoAgendaFlat = [
  '[&_.calendar-row]:!bg-transparent',
  // One fill for every row, not each row's own: pointing at something is a
  // state of the list, and a colour that changes with the row being pointed
  // at reads as the row saying something rather than as the pointer.
  '[&_.calendar-row:hover]:!bg-surface-gray-1',
  // …and the title in the page's own ink. With no fill behind it, a title in
  // the calendar's colour is the only coloured thing on a line of black
  // text, which puts the weight on what the event is called rather than on
  // what it is about. The bar keeps the colour: it is the one mark on the
  // row whose whole job is to say which calendar this is.
  '[&_.calendar-row_.calendar-row-title]:!text-ink-gray-7',
  // …and what the row adds after the title — "Day 1/3", a location — a step
  // quieter again. It is the least of the three things on the line, and in
  // the calendar's colour it was reading as loud as the bar.
  '[&_.calendar-row_.calendar-row-description]:!text-ink-gray-5',
].join(' ')

export const espressoCardCopy = [
  // …and the dashed outline the component gives a draft, which the calendar
  // takes off and a copy drawn outside it puts back on.
  '[&_.event-draft]:!outline-none',
  '[&_.event-draft]:![background-color:var(--bg)]',
  '[&_.event-title]:![color:var(--border)]',
  '[&_.event_svg]:![color:var(--border)]',
  '[&_.event_svg]:!size-3.5',
  '[&_.event_svg]:!mt-px',
  '[&_.event_.gap-2]:!gap-1.5',
].join(' ')

export const espressoMenuHeight = [
  '[&_[role=listbox][data-slot=content]_[role=presentation]]:!max-h-[232px]',

  // …and barely wider than the times in it. A menu sizes itself to its
  // widest row, which came to twice the width of the field it stands on and
  // read as a panel from somewhere else; the field's own width is narrower
  // than "10:30 am" and a check together, and clipped the time it was
  // showing. 120 is the longest of them at 61, the row's 16 either side, the
  // 8 before the check and the check's 20, with a little left over.
  //
  // The `max()` is what keeps this to the time fields. Select publishes its
  // trigger's width only for a menu placed as a popover, which these two are
  // and nothing else here is; where the variable is not set the whole width
  // is void and the menu goes on sizing itself.
  //
  // `[data-slot=content]` as well as the role, because the picker's own year
  // and month lists are listboxes too and they are in this same target: a
  // width keyed on a variable nothing sets is not dropped, it computes to
  // `auto`, which took those two columns down to the width of "2023".
  '[&_[role=listbox][data-slot=content]]:!w-[max(var(--reka-select-trigger-width),120px)]',
  '[&_[data-slot=content-body]]:!w-full',
  '[&_[role=listbox][data-slot=content]_[role=presentation]]:!w-full',
  '[&_[role=listbox][data-slot=content]_[role=option]]:!w-full',
].join(' ')

export const espressoDatePicker = [
  // 196 wide (node 35247:71977). The single picker sets its own 224 on a
  // wrapper and the range picker hugs its contents, so the width is put on
  // the panel both of them are built from — and on that wrapper as well, or
  // the panel would sit inside a box wider than itself.
  '[&_.w-56]:!w-[196px]',
  '[&_.select-none.text-ink-gray-9]:!w-[196px]',

  // Every control in the header is an `xs` button, and they are all the
  // same size and the same type — which is what puts their labels on one
  // line. The component builds the row out of `sm`s and then overrides two
  // of the three type scales by hand: the month at `text-sm-medium` (13/500)
  // and Today at `text-xs` (12), on 28-tall buttons.
  //
  // frappe-ui's own `xs`: `h-6 text-xs px-1.5 rounded-3` with a label,
  // `h-6 w-6 rounded-3` icon-only. Applied in that shape:
  '[&_.select-none.text-ink-gray-9_.p-2.pb-0_button]:!h-6',
  '[&_.select-none.text-ink-gray-9_.p-2.pb-0_button]:!rounded-3',
  '[&_.select-none.text-ink-gray-9_.p-2.pb-0_button]:!text-xs',
  // the two that carry a label take xs padding — the month, and Today,
  // which is the one mover that is not an icon
  '[&_.select-none.text-ink-gray-9_.p-2.pb-0>button]:!px-1.5',
  '[&_.select-none.text-ink-gray-9_.p-2.pb-0>div>button:not(:first-child):not(:last-child)]:!px-1.5',
  // and the two that carry a glyph are 24 square
  '[&_.select-none.text-ink-gray-9_.p-2.pb-0>div>button:first-child]:!size-6',
  '[&_.select-none.text-ink-gray-9_.p-2.pb-0>div>button:last-child]:!size-6',

  // 6 between the header and the grid; the other three sides keep their 8.
  '[&_.select-none.text-ink-gray-9_.p-2:not(.pb-0)]:!pt-1.5',

  // Every cell — the weekday letters and the dates alike — 24 tall on a
  // radius of 5, filling its column rather than standing 24 wide inside it.
  //
  // The width is what a range is drawn with: the file runs one unbroken band
  // from the first day to the last with the two ends sitting on it as filled
  // squares (node 35421:113510), and a cell narrower than its column leaves a
  // gap at every date, so the band came out as a row of separate pills.
  '[&_.select-none.text-ink-gray-9_.size-7]:!h-6',
  '[&_.select-none.text-ink-gray-9_.size-7]:!w-full',
  // …which means the 2px the component puts between the days of a week goes
  // as well; the 2 between the weeks stays, which is the file's.
  '[&_.select-none.text-ink-gray-9_.flex-col>.flex]:!gap-0',
  '[&_.select-none.text-ink-gray-9_.size-7]:!rounded-2',

  // …and the band itself: the days between the two ends carry no radius, so
  // one runs into the next, in the file's #F7F7F7 rather than the component's
  // gray-3, which is dark enough to read as a selection of its own.
  // `.size-7` carried along so the radius outranks the one every cell takes
  // above: a tie on specificity is broken by the order Tailwind writes its
  // rules in, not the order they are named in here.
  '[&_.select-none.text-ink-gray-9_.size-7.bg-surface-gray-3]:!rounded-none',
  '[&_.select-none.text-ink-gray-9_.size-7.bg-surface-gray-3]:!bg-surface-gray-1',
  '[&_.select-none.text-ink-gray-9_.size-7.bg-surface-gray-3]:hover:!bg-surface-gray-1',

  // The month and year face fills the panel. The component builds it 208
  // square inside a panel this file has brought down to 196, and its two
  // columns are halves of that 208 — so they hung over the edge and were
  // clipped, which left two lists the width of the words in them against a
  // panel of white. Held to the panel, a half is 98 and each column fills
  // what it is given.
  '[&_.select-none.text-ink-gray-9_.h-52]:!w-full',

  // 2 under the weekday letters, the same 2 that separates the weeks.
  '[&_.select-none.text-ink-gray-9_.mb-1]:!mb-0.5',

  // 12/regular throughout: the component sets the dates a size up and the
  // weekday letters a weight up.
  '[&_.select-none.text-ink-gray-9_.text-sm]:!text-xs',
  '[&_.select-none.text-ink-gray-9_.text-xs-medium]:!text-xs',

  // Only the weeks the month actually has. `generateWeeks` always emits six
  // rows, on purpose — a constant height means the panel does not jiggle when
  // you page between months, and in a dual-pane range picker the two panes
  // line up. The file draws a five-row June, so the trailing row goes when
  // every date in it belongs to the next month; the component marks those
  // with `data-outside-view`, and a row with no cell lacking it is a row of
  // nothing but spill-over. The panel then changes height between months —
  // which is the thing the six were avoiding — but it hangs off a label at
  // the top left and grows downwards, so what moves is its bottom edge.
  '[&_.select-none.text-ink-gray-9_.flex-col>div:last-child:not(:has(button:not([data-outside-view])))]:!hidden',

  // …and the dates in #383838, where the component sets ink-gray-8 (#171717).
  // The weekday letters are ink-gray-4 already, which is the file's #999999,
  // and the selected fill is surface-gray-9, which is the file's #383838.
  '[&_.select-none.text-ink-gray-9_.size-7.text-ink-gray-8]:!text-ink-gray-7',
].join(' ')
