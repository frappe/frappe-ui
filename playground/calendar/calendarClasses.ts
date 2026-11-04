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

  // Event cards: the file draws a tinted block with a 2px bar down its lead
  // edge, sitting 2px in from the column's left and 1px from the others.
  '[&_[data-slot=calendar-event]]:!rounded-4',
  '[&_[data-slot=calendar-event]]:!ml-0.5',
  '[&_[data-slot=calendar-event]]:!mr-px',
].join(' ')

/** Hour height, day-column width and gutter, straight from the file. */
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
 * off `.w-56`, which is DatePicker's own wrapper: a Select's menu lands in
 * the same target and has none of it, so nothing else is touched.
 */
export const espressoDatePicker = [
  '[&_.w-56]:!w-[196px]',

  // The header's row is 180, like the grid under it. The component's comes
  // to 190 — 28-square movers and a padded label — and a flex item will not
  // shrink below that, so the panel was 196 with its right edge clipped off.
  // 24 for the movers and no padding on the label brings it to 174.
  '[&_.w-56_.p-2.pb-0_button]:!h-6',
  '[&_.w-56_.p-2.pb-0>div>button:first-child]:!w-6',
  '[&_.w-56_.p-2.pb-0>div>button:last-child]:!w-6',
  '[&_.w-56_.p-2.pb-0>button]:!px-0',

  // 6 between the header and the grid; the other three sides keep their 8.
  '[&_.w-56_.p-2:not(.pb-0)]:!pt-1.5',

  // Every cell — the weekday letters and the dates alike — 24 square on a
  // radius of 5, which is what puts seven of them across 180.
  '[&_.w-56_.size-7]:!size-6',
  '[&_.w-56_.size-7]:!rounded-2',

  // 2 under the weekday letters, the same 2 that separates the weeks.
  '[&_.w-56_.mb-1]:!mb-0.5',

  // 12/regular throughout: the component sets the dates a size up and the
  // weekday letters a weight up.
  '[&_.w-56_.text-sm]:!text-xs',
  '[&_.w-56_.text-xs-medium]:!text-xs',

  // Only the weeks the month actually has. `generateWeeks` always emits six
  // rows, on purpose — a constant height means the panel does not jiggle when
  // you page between months, and in a dual-pane range picker the two panes
  // line up. The file draws a five-row June, so the trailing row goes when
  // every date in it belongs to the next month; the component marks those
  // with `data-outside-view`, and a row with no cell lacking it is a row of
  // nothing but spill-over. The panel then changes height between months —
  // which is the thing the six were avoiding — but it hangs off a label at
  // the top left and grows downwards, so what moves is its bottom edge.
  '[&_.w-56_.flex-col>div:last-child:not(:has(button:not([data-outside-view])))]:!hidden',

  // …and the dates in #383838, where the component sets ink-gray-8 (#171717).
  // The weekday letters are ink-gray-4 already, which is the file's #999999,
  // and the selected fill is surface-gray-9, which is the file's #383838.
  '[&_.w-56_.size-7.text-ink-gray-8]:!text-ink-gray-7',
].join(' ')
