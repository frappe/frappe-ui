import { onBeforeUnmount, ref, type Ref } from 'vue'

/** What a click or a drag on the grid asked the panel to open with. */
export interface CalendarDraft {
  fromDate: string
  toDate: string
  fromTime: string
  toTime: string
  allDay: boolean
}

/**
 * A live band drawn over the grid while the pointer is down, in viewport
 * coordinates — so it can be rendered `fixed` and needs no containing block
 * inside the component's own tree.
 */
export interface DragBand {
  left: number
  top: number
  width: number
  height: number
}

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * The column's `data-date-attr` is a `Date` stringified by the DOM — "Sun Sep
 * 27 2026 00:00:00 GMT+0530 (India Standard Time)" — not an ISO day. Parsed
 * and re-formatted rather than sliced, which is what gave "Invalid Date".
 */
const isoDay = (attr: string) => {
  const d = new Date(attr)
  return Number.isNaN(d.getTime())
    ? ''
    : `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
const hhmm = (minutes: number) =>
  `${pad(Math.floor(minutes / 60) % 24)}:${pad(minutes % 60)}`

/**
 * Drag a span of time open.
 *
 * The component takes a click on an hour and reports it through `onCellClick`;
 * it has nothing for a drag, so this listens on the grid itself. Nothing about
 * the component changes — the handlers are added to the element it renders,
 * and removed again when the page goes.
 *
 * What a drag reads:
 *   · the column under the pointer carries `data-date-attr`, which is the day
 *   · how far down the column the pointer is, over `hourHeight`, is the time
 *   · dragging across columns takes the days in between with it
 *
 * Times snap to the half hour, which is the grain the component's own click
 * handler works in, and a drag that never leaves its starting cell is a click:
 * one hour from where it landed.
 */
export function useDragToCreate(
  root: Ref<HTMLElement | null>,
  hourHeight: number,
  onDone: (draft: CalendarDraft) => void,
) {
  const band = ref<DragBand | null>(null)

  const SNAP = 30
  let active = false
  let startDate = ''
  let startMin = 0
  let startCol: HTMLElement | null = null
  let grid: HTMLElement | null = null

  /**
   * The day columns of the time grid, in either view. `[data-time-grid]` is
   * the one hook both draw: the Week view puts it on each of seven columns
   * with the day's own `data-date-attr` beside it, the Day view on its single
   * column with the date kept elsewhere. Reading the columns off that rather
   * than off `data-date-attr` is what makes a drag work in the Day view — and
   * it also keeps the all-day band out of it, since those cells carry neither.
   */
  const columns = () =>
    grid ? [...grid.querySelectorAll<HTMLElement>('[data-time-grid]')] : []

  /** The day a column stands for, wherever the view chose to record it. */
  function dateOf(col: HTMLElement) {
    const attr =
      col.getAttribute('data-date-attr') ??
      col.closest('[data-date-attr]')?.getAttribute('data-date-attr') ??
      root.value?.querySelector('[data-date-attr]')?.getAttribute('data-date-attr')
    return isoDay(String(attr ?? ''))
  }

  /** The column the pointer is over, and the minute within it. */
  function read(e: PointerEvent) {
    const cols = columns()
    if (!cols.length) return null
    // The column under the pointer, or the nearest one when the pointer has
    // run off the end of the week.
    let col = cols.find((c) => {
      const r = c.getBoundingClientRect()
      return e.clientX >= r.left && e.clientX < r.right
    })
    if (!col) {
      col = e.clientX < cols[0]!.getBoundingClientRect().left ? cols[0]! : cols[cols.length - 1]!
    }
    const r = col.getBoundingClientRect()
    const minutes = ((e.clientY - r.top) / hourHeight) * 60
    const snapped = Math.max(0, Math.min(24 * 60, Math.round(minutes / SNAP) * SNAP))
    return { date: dateOf(col), minutes: snapped, rect: r, col }
  }

  function paint(a: ReturnType<typeof read>, b: ReturnType<typeof read>) {
    if (!a || !b || !grid) return
    const gridTop = grid.getBoundingClientRect().top
    const left = Math.min(a.rect.left, b.rect.left)
    const right = Math.max(a.rect.right, b.rect.right)
    const top = gridTop + (Math.min(a.minutes, b.minutes) / 60) * hourHeight
    const bottom = gridTop + (Math.max(a.minutes, b.minutes) / 60) * hourHeight
    band.value = {
      left,
      top,
      width: right - left,
      height: Math.max(bottom - top, 2),
    }
  }

  function onPointerDown(e: PointerEvent) {
    if (e.button !== 0) return
    const target = e.target as HTMLElement
    // Only the empty grid starts a drag. Not an event, and not the handles
    // it hangs off itself: a pill's resize grip is an absolutely-positioned
    // strip that reaches a few pixels past its own bottom edge, so the hour
    // under a pill starts with the pill's grip, not with the grid.
    if (
      target.closest('[data-slot=calendar-event], .event') ||
      target.classList.contains('cursor-ns-resize') ||
      target.closest('.cursor-ns-resize, .cursor-move, [draggable=true]')
    )
      return
    // The column's own parent, whichever view drew it — and nothing at all
    // when the pointer is in the all-day band or the header.
    grid = target.closest<HTMLElement>('[data-time-grid]')?.parentElement ?? null
    if (!grid) return

    const at = read(e)
    if (!at) return
    active = true
    startDate = at.date
    startMin = at.minutes
    startCol = at.col
    paint(at, at)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp, { once: true })
  }

  /**
   * In the time grid a drag stays in the day it started in: the hours are the
   * point of it, and an event whose end is on a later day is laid out as one
   * bar across the days it covers rather than as a block at those hours on
   * each of them.
   *
   * Days are dragged across in the Month view, where a cell *is* a day — see
   * `onMonthMove`.
   */
  function onPointerMove(e: PointerEvent) {
    if (!active || !startCol) return
    const at = read(e)
    if (!at) return
    const rect = startCol.getBoundingClientRect()
    paint(
      { date: startDate, minutes: startMin, rect, col: startCol },
      { ...at, date: startDate, rect, col: startCol },
    )
  }

  function onPointerUp(e: PointerEvent) {
    window.removeEventListener('pointermove', onPointerMove)
    if (!active) return
    active = false
    band.value = null
    const at = read(e)
    if (!at) return

    let [a, b] =
      at.minutes < startMin ? [at.minutes, startMin] : [startMin, at.minutes]
    // A drag that never moved is a click: one hour from where it landed.
    if (a === b) b = a + 60

    onDone({
      fromDate: startDate,
      toDate: startDate,
      fromTime: hhmm(a),
      toTime: hhmm(Math.min(b, 24 * 60)),
      allDay: false,
    })
  }

  function attach(el: HTMLElement | null) {
    el?.addEventListener('pointerdown', onPointerDown)
  }
  function detach(el: HTMLElement | null) {
    el?.removeEventListener('pointerdown', onPointerDown)
    window.removeEventListener('pointermove', onPointerMove)
  }

  onBeforeUnmount(() => detach(root.value))

  return { band, attach, detach }
}

/**
 * Drag a span of days open in the Month view.
 *
 * A month cell *is* a day, so dragging across cells is the natural way to ask
 * for a span of them — and a span of days is an all-day event, which is what
 * the Month grid draws anyway. The time grid has no business with this: an
 * event whose end is on a later day is laid out as one bar across the days it
 * covers, not as a block at those hours on each of them.
 *
 * The component puts no date on a cell, so the day is worked out from the two
 * things it does put there: the week's own `data-strip-date` on the row, and
 * the cell's place in it.
 */
export function useMonthDragToCreate(
  root: Ref<HTMLElement | null>,
  onDone: (draft: CalendarDraft) => void,
) {
  /** The days swept, and the bar drawn across them while the pointer is down. */
  const marked = ref<string[]>([])
  const bands = ref<DragBand[]>([])

  /** A month cell's own insets: its pills sit 4 in, under the date row. */
  const CARD_INSET = 4
  const DATE_ROW = 28
  const CARD_HEIGHT = 24

  let active = false
  let startIso = ''

  const cellsOf = (row: HTMLElement) =>
    [...row.children] as HTMLElement[]

  /** The day a month cell stands for: its week's first day, plus its column. */
  function dayOf(cell: HTMLElement): string {
    const row = cell.closest<HTMLElement>('[data-week-row]')
    const key = row?.getAttribute('data-strip-date')
    if (!row || !key) return ''
    const start = new Date(key)
    if (Number.isNaN(start.getTime())) return ''
    const col = cellsOf(row).indexOf(cell)
    if (col < 0) return ''
    const d = new Date(start)
    d.setDate(d.getDate() + col)
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  }

  const cellAt = (e: PointerEvent) => {
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
    const row = el?.closest<HTMLElement>('[data-week-row]')
    if (!row) return null
    return cellsOf(row).find((c) => c.contains(el!)) ?? null
  }

  /** Every day between the two ends, inclusive — the row may wrap a week. */
  function span(a: string, b: string) {
    const [from, to] = a <= b ? [a, b] : [b, a]
    const out: string[] = []
    const d = new Date(from)
    const end = new Date(to)
    while (d <= end) {
      out.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`)
      d.setDate(d.getDate() + 1)
    }
    return out
  }

  function onPointerDown(e: PointerEvent) {
    if (e.button !== 0) return
    const target = e.target as HTMLElement
    // A pill in a cell is its own thing; so is the "N more" line.
    if (target.closest('[data-slot=calendar-event], .event, button')) return
    const cell = cellAt(e)
    if (!cell) return
    const iso = dayOf(cell)
    if (!iso) return
    active = true
    startIso = iso
    marked.value = [iso]
    paintBands(marked.value)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp, { once: true })
  }

  /**
   * The card being drawn, not the cells it covers: a bar the width of the
   * days swept, sitting where a bar across those days would sit. Washing the
   * whole of each cell said "these days are selected" where what is being
   * made is one thing laid across them.
   *
   * One bar per row, because a span that runs past Saturday continues on the
   * next row — which is how the Month grid draws a real multi-day event too.
   */
  function paintBands(days: string[]) {
    const host = root.value
    if (!host || !days.length) {
      bands.value = []
      return
    }
    const out: DragBand[] = []
    for (const row of host.querySelectorAll<HTMLElement>('[data-week-row]')) {
      const hits = cellsOf(row).filter((c) => days.includes(dayOf(c)))
      if (!hits.length) continue
      const first = hits[0]!.getBoundingClientRect()
      const last = hits[hits.length - 1]!.getBoundingClientRect()
      out.push({
        left: first.left + CARD_INSET,
        // Under the date, where a bar in a month cell starts.
        top: first.top + DATE_ROW,
        width: last.right - first.left - CARD_INSET * 2,
        height: CARD_HEIGHT,
      })
    }
    bands.value = out
  }

  function onPointerMove(e: PointerEvent) {
    if (!active) return
    const cell = cellAt(e)
    const iso = cell ? dayOf(cell) : ''
    if (!iso) return
    marked.value = span(startIso, iso)
    paintBands(marked.value)
  }

  function onPointerUp(e: PointerEvent) {
    window.removeEventListener('pointermove', onPointerMove)
    if (!active) return
    active = false
    const days = marked.value
    marked.value = []
    paintBands([])
    if (!days.length) return
    /**
     * The Month grid cannot capture an hour, but the panel can take one — so
     * what is picked here is the day or the days, and the hours are left to
     * be typed. All day stays off and the Time row shows, for one day and
     * for a span alike; switching All day on is how you say you meant the
     * whole of them.
     */
    onDone({
      fromDate: days[0]!,
      toDate: days[days.length - 1]!,
      fromTime: '09:00',
      toTime: '10:00',
      allDay: false,
    })
  }

  function attach(el: HTMLElement | null) {
    el?.addEventListener('pointerdown', onPointerDown)
  }
  function detach(el: HTMLElement | null) {
    el?.removeEventListener('pointerdown', onPointerDown)
    window.removeEventListener('pointermove', onPointerMove)
  }

  onBeforeUnmount(() => detach(root.value))

  return { marked, bands, attach, detach }
}

/**
 * The three parts of a card being moved in Week or Day view.
 *
 * The same picture the month view gets, built by hand because the time grid
 * is dragged by the component rather than by the browser: the card it came
 * from stays put at low opacity, the slot it would drop into is drawn blank,
 * and the card itself rides the pointer with nothing changed about it.
 *
 * The component's own pill is what says where the drop would land — it snaps
 * to the day column and the quarter hour under the pointer — so it is hidden
 * and its rectangle becomes the blank slot.
 */
export function useDragShadow(root: Ref<HTMLElement | null>) {
  /** A: where it was. */
  const ghost = ref<{ html: string; rect: DragBand } | null>(null)
  /** B: where it would land, drawn blank. */
  const slot = ref<DragBand | null>(null)
  /** The card in hand, under the pointer. */
  const carrying = ref<{ html: string; rect: DragBand } | null>(null)
  /** True while the card in hand is travelling the last bit on its own. */
  const landing = ref(false)

  let watching: HTMLElement | null = null
  let origin: DragBand | null = null
  /** Where in the card the pointer took hold, so it does not jump on lift. */
  let grabX = 0
  let grabY = 0
  /** The grid scrolls under a long drag, and a fixed ghost would not follow. */
  let scroller: HTMLElement | null = null
  let scrolledFrom = 0

  function rectOf(el: HTMLElement): DragBand {
    const r = el.getBoundingClientRect()
    return { left: r.left, top: r.top, width: r.width, height: r.height }
  }

  function scrollerOf(el: HTMLElement) {
    let n: HTMLElement | null = el
    while (n && n !== document.body) {
      if (n.scrollHeight > n.clientHeight + 1) return n
      n = n.parentElement
    }
    return null
  }

  /**
   * The pill's markup, with the mark that hides it taken back out.
   *
   * `cursor: grabbing` is what the overrides key the held pill's invisibility
   * on, and the copies carry the same inline style. They are drawn outside
   * the calendar, where that rule cannot reach them, but not by much — so the
   * mark comes off rather than resting on where a copy happens to sit.
   */
  function markupOf(el: HTMLElement) {
    return el.outerHTML.replace(/cursor:\s*grabbing/g, 'cursor: grab')
  }

  function onPointerDown(e: PointerEvent) {
    const target = e.target as HTMLElement
    const pill = target.closest<HTMLElement>('.event')
    // A pill, but not one being resized from its grip: that stays where it is.
    if (!pill || target.closest('.cursor-ns-resize')) return
    // Month bars are dragged by the browser itself, which swallows every
    // pointer event after `dragstart` — including the `pointerup` that would
    // clear these. `useMonthDragSkeleton` covers that view instead.
    if (pill.closest('[data-week-row]')) return
    watching = pill
    origin = rectOf(pill)
    grabX = e.clientX - origin.left
    grabY = e.clientY - origin.top
    scroller = scrollerOf(pill)
    scrolledFrom = scroller?.scrollTop ?? 0
    window.addEventListener('pointermove', onFirstMove)
    window.addEventListener('pointerup', onUp, { once: true })
  }

  /**
   * Only once the pointer actually moves. A click on an event opens it, and
   * a card lifting off under every click would be noise.
   *
   * `v-html` of the pill's `outerHTML`, so a copy carries the card itself —
   * cloning only the inside left the title floating with no card under it,
   * because the fill, the radius and the bar are all on the pill's own
   * element.
   */
  function onFirstMove(e: PointerEvent) {
    window.removeEventListener('pointermove', onFirstMove)
    if (!watching || !origin) return
    const html = markupOf(watching)
    ghost.value = { html, rect: origin }
    slot.value = origin
    carrying.value = {
      html,
      rect: { ...origin, left: e.clientX - grabX, top: e.clientY - grabY },
    }
    window.addEventListener('pointermove', onMove)
  }

  function onMove(e: PointerEvent) {
    if (!watching || !origin) return
    // The blank slot sits where the component has snapped the pill to — read
    // on the next frame, because the component moves the pill on its own
    // `mousemove` and Vue writes the transform after that. Read here and the
    // slot trails the card by a step, and stops a step short at the end.
    const held = watching
    requestAnimationFrame(() => {
      if (watching === held) slot.value = rectOf(held)
    })
    const drift = (scroller?.scrollTop ?? 0) - scrolledFrom
    if (ghost.value)
      ghost.value = { ...ghost.value, rect: { ...origin, top: origin.top - drift } }
    if (carrying.value)
      carrying.value = {
        ...carrying.value,
        rect: {
          ...carrying.value.rect,
          left: e.clientX - grabX,
          top: e.clientY - grabY,
        },
      }
  }

  /**
   * Letting go: the card travels the last bit rather than appearing there.
   *
   * The component puts its pill on the hour the drop landed on the moment
   * the button comes up, which after a card has followed the pointer across
   * the grid reads as the card being cut from one place to another. So the
   * copy in hand keeps going — to the slot, over 180ms — and the pill it
   * becomes is held out of sight until it arrives.
   *
   * The transition is turned on a frame before the move, because a property
   * that gains its transition in the same breath as its value does not
   * animate: the browser compares against a style that had no transition.
   */
  const LANDING = 180

  function onUp() {
    window.removeEventListener('pointermove', onFirstMove)
    window.removeEventListener('pointermove', onMove)
    const held = watching
    const to = slot.value
    watching = null
    origin = null
    scroller = null
    ghost.value = null
    slot.value = null

    if (!held || !to || !carrying.value) {
      carrying.value = null
      return
    }
    landing.value = true
    held.style.opacity = '0'
    requestAnimationFrame(() => {
      if (carrying.value) carrying.value = { ...carrying.value, rect: to }
      setTimeout(() => {
        carrying.value = null
        landing.value = false
        held.style.opacity = ''
      }, LANDING)
    })
  }

  function attach(el: HTMLElement | null) {
    el?.addEventListener('pointerdown', onPointerDown)
  }
  function detach(el: HTMLElement | null) {
    el?.removeEventListener('pointerdown', onPointerDown)
    window.removeEventListener('pointermove', onFirstMove)
    window.removeEventListener('pointermove', onMove)
  }

  onBeforeUnmount(() => detach(root.value))

  return { ghost, slot, carrying, landing, attach, detach }
}

/**
 * The month view's own version of the same three parts, and the same landing.
 *
 * There the component hands the drag to the browser: the bar is `draggable`,
 * so the original fades to half — which is A — and the browser carries a
 * picture of the card under the cursor. That picture is the reason the month
 * read differently from the week: it lags the pointer, it carries no shadow,
 * and on release it vanishes where the cursor is while the bar appears
 * somewhere else, which is the cut the week no longer has.
 *
 * So the browser's picture is taken away — `setDragImage` given a blank — and
 * the card is drawn here instead, out of the bar's own markup, following the
 * pointer with the week's shadow on it. The blank slot marks where it would
 * land, and on release the card travels the last bit to it.
 */
export function useMonthDragSkeleton(root: Ref<HTMLElement | null>) {
  /** B: where it would land, drawn blank. */
  const slot = ref<DragBand | null>(null)
  /** The card in hand, under the pointer. */
  const carrying = ref<{ html: string; rect: DragBand } | null>(null)
  /** True while the card in hand is travelling the last bit on its own. */
  const landing = ref(false)

  /** The bar's size, and where inside it the pointer took hold. */
  let size: { width: number; height: number } | null = null
  let grabX = 0
  let grabY = 0
  /** How far down its own week row the bar sits, so the slot keeps its lane. */
  let lane = 0
  let html = ''
  /** The dragged bar's name, which is how its landing place is found again. */
  let name = ''

  /**
   * A 1×1 transparent pixel, kept off screen, handed to `setDragImage` so the
   * browser draws nothing and the card drawn here is the only one in hand.
   *
   * A real image and not an empty element at `opacity: 0` — nothing to paint
   * is a reason to fall back to the default picture, and the fallback is the
   * very thing being taken away. It is made on the first drag rather than the
   * first render so the page pays nothing for a view it may never open, and
   * kept afterwards so the pixel is decoded by the time it is asked for.
   */
  let blank: HTMLImageElement | null = null
  function blankImage() {
    if (blank) return blank
    blank = new Image()
    blank.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    blank.style.cssText =
      'position:fixed;top:0;left:-10px;width:1px;height:1px;pointer-events:none'
    document.body.appendChild(blank)
    return blank
  }

  /**
   * The bar's markup, with what positions it taken off.
   *
   * A month bar is the absolutely positioned element itself — left, width and
   * top are inline on it, from the row it belongs to — so dropped into a copy
   * drawn `fixed` somewhere else it would fly back to the row's coordinates.
   * The copy fills its wrapper instead, and the wrapper is what is moved.
   */
  function markupOf(bar: HTMLElement) {
    const copy = bar.cloneNode(true) as HTMLElement
    copy.classList.remove('absolute', 'opacity-50')
    copy.style.position = 'static'
    copy.style.left = ''
    copy.style.top = ''
    copy.style.width = '100%'
    copy.style.height = '100%'
    return copy.outerHTML
  }

  function onDragStart(e: DragEvent) {
    const bar = (e.target as HTMLElement)?.closest<HTMLElement>('.event')
    if (!bar) return
    const r = bar.getBoundingClientRect()
    const row = bar.closest<HTMLElement>('[data-week-row]')
    size = { width: r.width, height: r.height }
    grabX = e.clientX - r.left
    grabY = e.clientY - r.top
    lane = row ? r.top - row.getBoundingClientRect().top : 0
    name = bar.textContent?.trim() ?? ''
    // The component's own `dragstart` has already run — this listens on the
    // calendar root, the bar's handler is on the bar — so the data is set and
    // only the picture is left to replace. It is still the same event, which
    // is the only moment the browser will take one.
    e.dataTransfer?.setDragImage(blankImage(), 0, 0)
    // The faded original is A, and it is the component's. The copy in hand is
    // taken before that fade lands, so it carries the card at full weight.
    html = markupOf(bar)
    carrying.value = {
      html,
      rect: {
        left: r.left,
        top: r.top,
        width: r.width,
        height: r.height,
      },
    }
  }

  function onDragOver(e: DragEvent) {
    if (!size) return
    if (carrying.value)
      carrying.value = {
        ...carrying.value,
        rect: {
          ...carrying.value.rect,
          left: e.clientX - grabX,
          top: e.clientY - grabY,
        },
      }
    const row = (e.target as HTMLElement)?.closest<HTMLElement>(
      '[data-week-row]',
    )
    if (!row) {
      slot.value = null
      return
    }
    // Snap the bar's left edge to the day column the cursor is carrying it to,
    // keeping the lane it was picked up from. Where a card actually comes to
    // rest a day sorts for itself, and is not knowable until it has — so this
    // stays a hint, and the landing below reads the answer rather than this.
    const rowRect = row.getBoundingClientRect()
    const cell = rowRect.width / 7
    const col = Math.round((e.clientX - grabX - rowRect.left) / cell)
    const left = rowRect.left + Math.min(Math.max(col, 0), 6) * cell
    slot.value = {
      left,
      top: rowRect.top + lane,
      width: Math.min(size.width, rowRect.right - left),
      height: size.height,
    }
  }

  /** As long as the week's, so a move reads the same in either view. */
  const LANDING = 180

  /**
   * Letting go: the card travels from the cursor to where the card it stands
   * for has come to rest, and that card is held out of sight until it lands.
   *
   * Where it comes to rest is read rather than guessed. The hint drawn during
   * the drag is a good guess and no better — a day sorts what it is given —
   * so the flight waits a frame for the component to lay the month out again
   * and then goes to the real thing.
   *
   * It is looked for again on every frame, since Vue may replace the element
   * underneath us when a move crosses from one week row into another. Nothing
   * found is no harm: the card flies to the hint and goes.
   */
  function fly(cx: number, cy: number, hint: DragBand) {
    const held = carrying.value
    if (!held) return
    landing.value = true

    let started = 0
    const step = () => {
      const landed = landedAt(cx, cy, hint)
      if (landed) landed.style.opacity = '0'
      if (!started) {
        // The clock starts here rather than at the drop: a frame that comes
        // late would otherwise spend the whole landing before the card has
        // been told where it is going, and it would arrive without moving.
        started = performance.now()
        const to = landed ? rectOf(landed) : hint
        if (carrying.value)
          carrying.value = { ...carrying.value, rect: { ...to, width: held.rect.width } }
        requestAnimationFrame(step)
        return
      }
      if (performance.now() - started < LANDING) {
        requestAnimationFrame(step)
        return
      }
      for (const el of document.querySelectorAll<HTMLElement>(
        '[data-week-row] .event',
      ))
        if (el.style.opacity === '0') el.style.opacity = ''
      carrying.value = null
      landing.value = false
    }
    requestAnimationFrame(step)
  }

  function rectOf(el: HTMLElement): DragBand {
    const r = el.getBoundingClientRect()
    return { left: r.left, top: r.top, width: r.width, height: r.height }
  }

  /**
   * The card the drop produced: the one of its name in the week row under the
   * cursor, with the cursor inside it. A name can repeat across a month —
   * a standup is every weekday — so the day is what tells them apart, and the
   * hint breaks a tie between two of a name on one day.
   */
  function landedAt(cx: number, cy: number, hint: DragBand) {
    const row = document
      .elementFromPoint(cx, cy)
      ?.closest<HTMLElement>('[data-week-row]')
    if (!row) return null
    let best: HTMLElement | null = null
    let closest = Infinity
    for (const el of row.querySelectorAll<HTMLElement>('.event')) {
      if (el.textContent?.trim() !== name) continue
      const r = el.getBoundingClientRect()
      if (cx < r.left - 2 || cx > r.right + 2) continue
      const off = Math.abs(r.top - hint.top)
      if (off < closest) {
        closest = off
        best = el
      }
    }
    return best
  }

  function onDrop(e: DragEvent) {
    const hint = slot.value
    const cx = e.clientX
    const cy = e.clientY
    slot.value = null
    size = null
    if (hint && carrying.value) fly(cx, cy, hint)
    else {
      carrying.value = null
      landing.value = false
    }
  }

  /** A drag let go over nothing: the card goes, no flight to make. */
  function onDragEnd() {
    size = null
    slot.value = null
    if (!landing.value) carrying.value = null
  }

  function attach(el: HTMLElement | null) {
    el?.addEventListener('dragstart', onDragStart)
    el?.addEventListener('dragover', onDragOver)
    el?.addEventListener('drop', onDrop)
    el?.addEventListener('dragend', onDragEnd)
  }
  function detach(el: HTMLElement | null) {
    el?.removeEventListener('dragstart', onDragStart)
    el?.removeEventListener('dragover', onDragOver)
    el?.removeEventListener('drop', onDrop)
    el?.removeEventListener('dragend', onDragEnd)
  }

  onBeforeUnmount(() => detach(root.value))

  return { slot, carrying, landing, attach, detach }
}

/** Which end of a month bar is being pulled. */
export type MonthEdge = 'start' | 'end'

export interface MonthResize {
  /** The bar's title, which is what names the event it belongs to. */
  title: string
  /** The span this bar stands for, which is what tells two of a name apart. */
  from: string
  to: string
  edge: MonthEdge
  /** The day the edge is being pulled to. */
  date: string
}

/**
 * Pulling a month bar's edge to lengthen or shorten what it stands for.
 *
 * The time grid has this already — the component puts a grip at the top and
 * the bottom of a timed pill and resizes it by the quarter hour. A month bar
 * has none: it is `draggable`, and the browser's drag moves the whole span
 * and nothing else. So the edges are found here, by where the pointer is
 * rather than by anything drawn, which is how a calendar behaves anyway —
 * the cursor turns at the edge and there is nothing to hit.
 *
 * `draggable` comes off while the pointer is in that band, which is what
 * keeps the browser's drag out of the way: a drag that never starts needs no
 * cancelling. Vue puts it back on the next render, and this puts it back on
 * the way out.
 */
export function useMonthResize(
  root: Ref<HTMLElement | null>,
  onResize: (r: MonthResize) => void,
) {
  /** How close to an edge counts as being on it. */
  const EDGE = 7

  let armed: { bar: HTMLElement; edge: MonthEdge } | null = null
  let pulling: {
    title: string
    from: string
    to: string
    edge: MonthEdge
  } | null = null

  function barAt(e: PointerEvent) {
    const el = e.target as HTMLElement | null
    const bar = el?.closest<HTMLElement>('.event')
    return bar?.closest('[data-week-row]') ? bar : null
  }

  /** The day a point in a week row falls on. */
  function dayAt(row: HTMLElement, clientX: number) {
    const rect = row.getBoundingClientRect()
    const col = Math.floor(((clientX - rect.left) / rect.width) * 7)
    return addDays(row.dataset.stripDate ?? '', Math.min(Math.max(col, 0), 6))
  }

  function addDays(iso: string, days: number) {
    const d = new Date(`${iso}T00:00`)
    if (Number.isNaN(d.getTime())) return iso
    d.setDate(d.getDate() + days)
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
  }

  function disarm() {
    if (!armed) return
    armed.bar.style.cursor = ''
    armed.bar.draggable = true
    armed = null
  }

  /** Hovering: arm the bar whose edge the pointer is on, disarm the rest. */
  function onHover(e: PointerEvent) {
    // A pull whose end was never seen — the button let go past the window's
    // edge, which is where an edge is often pulled to — would otherwise hold
    // every bar on the grid shut until the next click landed somewhere.
    if (pulling && e.buttons === 0) onDrop()
    if (pulling) return
    const bar = barAt(e)
    if (!bar) return disarm()
    const rect = bar.getBoundingClientRect()
    const edge: MonthEdge | null =
      e.clientX - rect.left <= EDGE
        ? 'start'
        : rect.right - e.clientX <= EDGE
          ? 'end'
          : null
    if (!edge) return disarm()
    if (armed && armed.bar !== bar) disarm()
    armed = { bar, edge }
    bar.style.cursor = 'ew-resize'
    bar.draggable = false
  }

  function onPointerDown(e: PointerEvent) {
    if (!armed) return
    const bar = barAt(e)
    if (!bar || bar !== armed.bar) return
    const row = bar.closest<HTMLElement>('[data-week-row]')
    if (!row) return
    e.preventDefault()
    e.stopPropagation()
    // The days this bar covers, read off the row it is drawn on. A title
    // alone is not an event — a week can hold three interviews — and the
    // days it already stands on are what pick it out from among them.
    const rect = bar.getBoundingClientRect()
    const rowRect = row.getBoundingClientRect()
    const cell = rowRect.width / 7
    const col = (x: number) =>
      Math.min(Math.max(Math.round((x - rowRect.left) / cell), 0), 7)
    pulling = {
      title: bar.innerText.trim().split('\n')[0] ?? '',
      from: dayAt(row, rect.left + cell / 2),
      to: addDays(row.dataset.stripDate ?? '', Math.max(col(rect.right) - 1, 0)),
      edge: armed.edge,
    }
    window.addEventListener('pointermove', onPull)
    window.addEventListener('pointerup', onDrop, { once: true })
    window.addEventListener('pointercancel', onDrop, { once: true })
  }

  function onPull(e: PointerEvent) {
    if (!pulling) return
    // The row under the pointer, so an edge can be pulled into another week.
    const under = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement
    const row =
      under?.closest<HTMLElement>('[data-week-row]') ??
      armed?.bar.closest<HTMLElement>('[data-week-row]')
    if (!row) return
    onResize({ ...pulling, date: dayAt(row, e.clientX) })
  }

  function onDrop() {
    window.removeEventListener('pointermove', onPull)
    window.removeEventListener('pointerup', onDrop)
    window.removeEventListener('pointercancel', onDrop)
    pulling = null
    disarm()
  }

  function attach(el: HTMLElement | null) {
    el?.addEventListener('pointermove', onHover)
    el?.addEventListener('pointerdown', onPointerDown, true)
    el?.addEventListener('pointerleave', disarm)
  }
  function detach(el: HTMLElement | null) {
    el?.removeEventListener('pointermove', onHover)
    el?.removeEventListener('pointerdown', onPointerDown, true)
    el?.removeEventListener('pointerleave', disarm)
    window.removeEventListener('pointermove', onPull)
  }

  onBeforeUnmount(() => detach(root.value))

  return { attach, detach }
}
