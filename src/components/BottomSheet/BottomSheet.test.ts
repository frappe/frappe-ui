/**
 * @vitest-environment jsdom
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createApp,
  createBlock,
  createElementVNode,
  nextTick,
  openBlock,
  ref,
  withCtx,
  type App,
} from 'vue'
import BottomSheet from './BottomSheet.vue'

/**
 * These specs assert the gesture state machine, not pixels: whether a gesture
 * was claimed by the sheet (the touch move is prevented and a transform is
 * written) or left to the content, and how a claimed gesture settles.
 *
 * jsdom has no layout, so every measurement the machine reads - `offsetHeight`,
 * `scrollHeight`, `clientHeight`, `scrollTop`, `overflow-y` - is stubbed here.
 */

const SHEET_HEIGHT = 400
/** 0.25 * SHEET_HEIGHT. A drag past this closes the sheet on release. */
const CLOSE_DISTANCE = 100

let clock = 0

function measure(el: HTMLElement, values: Record<string, number>) {
  for (const [key, value] of Object.entries(values)) {
    Object.defineProperty(el, key, { value, configurable: true })
  }
}

/** jsdom pins `scrollTop` to 0, so make it a plain writable property. */
function makeScrollable(el: HTMLElement, scrollTop = 0) {
  measure(el, { scrollHeight: 1000, clientHeight: 200 })
  Object.defineProperty(el, 'scrollTop', {
    value: scrollTop,
    writable: true,
    configurable: true,
  })
  // getComputedStyle has no stylesheet to read in jsdom, so declare it inline.
  el.style.overflowY = 'auto'
}

/**
 * jsdom exposes `TouchEvent` but not `Touch`, and its init dictionary cannot
 * build a touch list. Only `touches`, `type` and `cancelable` are read by the
 * component, so a plain event with a touch list attached is enough.
 */
function touch(
  type: 'touchstart' | 'touchmove' | 'touchend' | 'touchcancel',
  target: Element,
  x = 0,
  y = 0,
) {
  const event = new Event(type, {
    bubbles: true,
    cancelable: type === 'touchmove',
  })
  const touches =
    type === 'touchend' || type === 'touchcancel'
      ? []
      : [{ clientX: x, clientY: y }]
  Object.defineProperty(event, 'touches', { value: touches })
  target.dispatchEvent(event)
  return event
}

function pointer(
  type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel',
  target: Element,
  x = 0,
  y = 0,
) {
  const event = new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerType: 'mouse',
    pointerId: 1,
    button: 0,
    clientX: x,
    clientY: y,
  })
  target.dispatchEvent(event)
  return event
}

/** Advance both the fake timers and the clock the gesture measures speed with. */
function advance(ms: number) {
  clock += ms
  vi.advanceTimersByTime(ms)
}

/**
 * jsdom implements neither capture method, so they are stubbed for every spec
 * here. Real browsers have them, and whether they are called is the whole
 * subject of the capture specs below.
 */
const captures: HTMLElement[] = []
const releases: HTMLElement[] = []

function installPointerCapture() {
  captures.length = 0
  releases.length = 0
  HTMLElement.prototype.setPointerCapture = function (this: HTMLElement) {
    captures.push(this)
  }
  HTMLElement.prototype.releasePointerCapture = function (this: HTMLElement) {
    releases.push(this)
  }
  HTMLElement.prototype.hasPointerCapture = function (this: HTMLElement) {
    return captures.includes(this) && !releases.includes(this)
  }
}

function removePointerCapture() {
  // @ts-expect-error restoring jsdom's own (missing) implementation
  delete HTMLElement.prototype.setPointerCapture
  // @ts-expect-error restoring jsdom's own (missing) implementation
  delete HTMLElement.prototype.releasePointerCapture
  // @ts-expect-error restoring jsdom's own (missing) implementation
  delete HTMLElement.prototype.hasPointerCapture
}

interface Harness {
  app: App
  sheet: HTMLElement
  handle: HTMLElement
  /** The sheet's own scroll region. */
  scroller: HTMLElement
  /** A node inside the scroll region: the realistic place a gesture starts. */
  content: HTMLElement
  openUpdates: boolean[]
  /** Drive the open state from outside, the way a consumer does. */
  setOpen: (value: boolean) => Promise<Harness>
}

async function openSheet(
  props: Record<string, unknown> = {},
  /**
   * Mount the sheet closed and open it afterwards. This is how every real
   * consumer uses it, and it is a different code path: the sheet's content is
   * not in the DOM at mount time.
   */
  { startClosed = false } = {},
): Promise<Harness> {
  const openUpdates: boolean[] = []
  const host = document.createElement('div')
  document.body.appendChild(host)
  const open = ref(!startClosed)

  /*
   * Mounted the way the template compiler emits it - a block vnode with a patch
   * flag and a stable slot - rather than with a plain `h()`. An unoptimized
   * vnode makes Vue re-patch the whole reka-ui subtree on every parent update,
   * which re-runs refs that a real, compiled consumer runs only once. The drag
   * binding lives or dies on that difference, so the harness has to match what
   * a real app produces.
   */
  const app = createApp({
    render: () => (
      openBlock(),
      createBlock(
        BottomSheet,
        {
          open: open.value,
          title: 'Sheet',
          'onUpdate:open': (value: boolean) => openUpdates.push(value),
          ...props,
        },
        {
          default: withCtx(() => [
            createElementVNode('div', { id: 'content' }, 'body'),
            createElementVNode('div', { id: 'nested' }, 'nested scroller'),
          ]),
          _: 1 /* STABLE */,
        },
        8 /* PROPS */,
        ['open'],
      )
    ),
  })
  app.mount(host)
  await nextTick()
  await nextTick()

  async function setOpen(value: boolean): Promise<Harness> {
    open.value = value
    await nextTick()
    await nextTick()
    return collect()
  }

  function collect(): Harness {
    const sheet = document.querySelector('.bottom-sheet-content') as HTMLElement
    const handle = sheet?.firstElementChild as HTMLElement
    const scroller = sheet?.lastElementChild as HTMLElement
    const content = sheet?.querySelector('#content') as HTMLElement

    if (sheet) {
      measure(sheet, { offsetHeight: SHEET_HEIGHT })
      makeScrollable(scroller)
    }

    return { app, sheet, handle, scroller, content, openUpdates, setOpen }
  }

  return startClosed ? setOpen(true) : collect()
}

/** Whether the sheet claimed the gesture and is moving with the finger. */
function isDragging(sheet: HTMLElement) {
  return sheet.hasAttribute('data-dragged')
}

describe('BottomSheet drag to dismiss', () => {
  beforeEach(() => {
    clock = 0
    vi.useFakeTimers({
      toFake: [
        'setTimeout',
        'clearTimeout',
        'requestAnimationFrame',
        'cancelAnimationFrame',
      ],
    })
    vi.spyOn(performance, 'now').mockImplementation(() => clock)
    installPointerCapture()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    removePointerCapture()
    document.body.innerHTML = ''
  })

  it('drags when the gesture starts in the body and the body is at its top', async () => {
    const { sheet, content, app } = await openSheet()

    touch('touchstart', content, 0, 300)
    const move = touch('touchmove', content, 0, 320)

    expect(move.defaultPrevented).toBe(true)
    expect(isDragging(sheet)).toBe(true)
    expect(sheet.style.transform).toBe('translateY(20px)')
    app.unmount()
  })

  it('leaves the gesture to a body that is already scrolled', async () => {
    const { sheet, scroller, content, app } = await openSheet()
    scroller.scrollTop = 120

    touch('touchstart', content, 0, 300)
    const move = touch('touchmove', content, 0, 320)

    expect(move.defaultPrevented).toBe(false)
    expect(isDragging(sheet)).toBe(false)
    expect(sheet.style.transform).toBe('')
    app.unmount()
  })

  it('ignores an upward gesture even at the top of the body', async () => {
    const { sheet, content, app } = await openSheet()

    touch('touchstart', content, 0, 300)
    const move = touch('touchmove', content, 0, 260)

    expect(move.defaultPrevented).toBe(false)
    expect(isDragging(sheet)).toBe(false)
    app.unmount()
  })

  it('rejects a mostly horizontal gesture', async () => {
    const { sheet, content, app } = await openSheet()

    touch('touchstart', content, 100, 300)
    const move = touch('touchmove', content, 160, 320)

    expect(move.defaultPrevented).toBe(false)
    expect(isDragging(sheet)).toBe(false)
    app.unmount()
  })

  it('keeps the body scrolling even if it reaches its top mid-gesture', async () => {
    const { sheet, scroller, content, app } = await openSheet()
    scroller.scrollTop = 120

    touch('touchstart', content, 0, 300)
    touch('touchmove', content, 0, 320)
    // A fling that hits the top and rubber-bands re-crosses scrollTop 0. The
    // gesture must not change hands because of it.
    scroller.scrollTop = 0
    const later = touch('touchmove', content, 0, 400)

    expect(later.defaultPrevented).toBe(false)
    expect(isDragging(sheet)).toBe(false)
    app.unmount()
  })

  it('uses the scroll position from the start of the gesture, not a live one', async () => {
    const { sheet, scroller, content, app } = await openSheet()
    // Landing a finger on a body that is still gliding to a stop.
    scroller.scrollTop = 120

    touch('touchstart', content, 0, 300)
    // Under the slop, so the gesture is still undecided...
    touch('touchmove', content, 0, 303)
    // ...and now the glide reaches the top. A live read here would hand the
    // gesture to the sheet part-way through a scroll.
    scroller.scrollTop = 0
    const move = touch('touchmove', content, 0, 320)

    expect(move.defaultPrevented).toBe(false)
    expect(isDragging(sheet)).toBe(false)
    app.unmount()
  })

  it('keeps dragging even if the body scrolls away from its top mid-gesture', async () => {
    const { sheet, scroller, content, app } = await openSheet()

    touch('touchstart', content, 0, 300)
    touch('touchmove', content, 0, 320)
    scroller.scrollTop = 200
    const later = touch('touchmove', content, 0, 360)
    advance(20)

    expect(later.defaultPrevented).toBe(true)
    expect(sheet.style.transform).toBe('translateY(60px)')
    app.unmount()
  })

  it('reads the nearest scroller, not the sheet-level one', async () => {
    const { sheet, scroller, app } = await openSheet()
    const nested = sheet.querySelector('#nested') as HTMLElement
    makeScrollable(nested, 150)
    const inner = document.createElement('span')
    nested.appendChild(inner)

    // The sheet's own scroller is at its top, but the nested one is not.
    expect(scroller.scrollTop).toBe(0)
    touch('touchstart', inner, 0, 300)
    const move = touch('touchmove', inner, 0, 320)

    expect(move.defaultPrevented).toBe(false)
    expect(isDragging(sheet)).toBe(false)
    app.unmount()
  })

  it('drags from inside a nested scroller that is at its top', async () => {
    const { sheet, scroller, app } = await openSheet()
    const nested = sheet.querySelector('#nested') as HTMLElement
    makeScrollable(nested, 0)
    scroller.scrollTop = 300
    const inner = document.createElement('span')
    nested.appendChild(inner)

    touch('touchstart', inner, 0, 300)
    const move = touch('touchmove', inner, 0, 320)

    expect(move.defaultPrevented).toBe(true)
    expect(isDragging(sheet)).toBe(true)
    app.unmount()
  })

  it('drags from the handle regardless of scroll position', async () => {
    const { sheet, scroller, handle, app } = await openSheet()
    scroller.scrollTop = 300

    touch('touchstart', handle, 0, 100)
    const move = touch('touchmove', handle, 0, 130)

    expect(move.defaultPrevented).toBe(true)
    expect(isDragging(sheet)).toBe(true)
    app.unmount()
  })

  it('drops the entry animation on the first drag frame', async () => {
    const { sheet, content, app } = await openSheet()

    // Before the drag the entry keyframe is what positions the sheet, and it
    // outranks an inline transform.
    expect(sheet.matches('[data-state="open"]:not([data-dragged])')).toBe(true)

    touch('touchstart', content, 0, 300)
    touch('touchmove', content, 0, 320)

    expect(sheet.matches('[data-state="open"]:not([data-dragged])')).toBe(false)
    // ...and the resting transition is gone, so the first frame lands exactly
    // under the finger instead of easing towards it.
    expect(sheet.style.transition).toBe('none')
    app.unmount()
  })

  it('closes when the drag passes the distance threshold', async () => {
    const { sheet, content, openUpdates, app } = await openSheet()

    touch('touchstart', content, 0, 300)
    touch('touchmove', content, 0, 300 + CLOSE_DISTANCE + 20)
    advance(400)
    touch('touchend', content)

    expect(sheet.style.transform).toBe('translateY(100%)')
    // The exit keyframe must not restart the slide from the resting position.
    expect(sheet.style.animation).toBe('none')
    expect(openUpdates).toEqual([])

    advance(300)
    expect(openUpdates).toEqual([false])
    app.unmount()
  })

  it('closes on a fast flick that never reaches the threshold', async () => {
    const { sheet, content, openUpdates, app } = await openSheet()

    touch('touchstart', content, 0, 300)
    advance(20)
    // 40px in 20ms is 2px/ms, well past the 0.5px/ms flick speed.
    touch('touchmove', content, 0, 340)
    touch('touchend', content)

    expect(sheet.style.transform).toBe('translateY(100%)')
    advance(300)
    expect(openUpdates).toEqual([false])
    app.unmount()
  })

  it('springs back after a short slow drag', async () => {
    const { sheet, content, openUpdates, app } = await openSheet()

    touch('touchstart', content, 0, 300)
    advance(400)
    touch('touchmove', content, 0, 320)
    touch('touchend', content)

    expect(sheet.style.transform).toBe('translateY(0px)')
    advance(400)
    expect(openUpdates).toEqual([])
    app.unmount()
  })

  it('springs back and releases the gesture on touchcancel', async () => {
    const { sheet, content, openUpdates, app } = await openSheet()

    touch('touchstart', content, 0, 300)
    touch('touchmove', content, 0, 300 + CLOSE_DISTANCE + 20)
    touch('touchcancel', content)

    expect(sheet.style.transform).toBe('translateY(0px)')
    advance(400)
    expect(openUpdates).toEqual([])

    // A cancelled gesture must not leave the machine stuck: the next one drags.
    touch('touchstart', content, 0, 300)
    const move = touch('touchmove', content, 0, 320)
    expect(move.defaultPrevented).toBe(true)
    app.unmount()
  })

  it('drags with a mouse and settles on pointercancel', async () => {
    const { sheet, content, openUpdates, app } = await openSheet()

    pointer('pointerdown', content, 0, 300)
    pointer('pointermove', content, 0, 300 + CLOSE_DISTANCE + 20)

    expect(isDragging(sheet)).toBe(true)

    pointer('pointercancel', content, 0, 420)
    expect(sheet.style.transform).toBe('translateY(0px)')

    advance(400)
    expect(openUpdates).toEqual([])
    app.unmount()
  })

  it('closes on a mouse drag past the threshold', async () => {
    const { sheet, content, openUpdates, app } = await openSheet()

    pointer('pointerdown', content, 0, 300)
    pointer('pointermove', content, 0, 300 + CLOSE_DISTANCE + 20)
    pointer('pointerup', content, 0, 420)

    expect(sheet.style.transform).toBe('translateY(100%)')
    advance(300)
    expect(openUpdates).toEqual([false])
    app.unmount()
  })

  it('never drags when the sheet is not dismissible', async () => {
    const { sheet, handle, content, openUpdates, app } = await openSheet({
      dismissible: false,
    })

    touch('touchstart', content, 0, 300)
    const fromBody = touch('touchmove', content, 0, 300 + CLOSE_DISTANCE + 20)
    touch('touchend', content)

    touch('touchstart', handle, 0, 100)
    const fromHandle = touch('touchmove', handle, 0, 100 + CLOSE_DISTANCE + 20)
    touch('touchend', handle)

    expect(fromBody.defaultPrevented).toBe(false)
    expect(fromHandle.defaultPrevented).toBe(false)
    expect(isDragging(sheet)).toBe(false)
    expect(sheet.style.transform).toBe('')

    advance(400)
    expect(openUpdates).toEqual([])
    app.unmount()
  })

  it('leaves a gesture that starts on a text field alone', async () => {
    const { sheet, content, app } = await openSheet()
    const input = document.createElement('input')
    content.appendChild(input)

    touch('touchstart', input, 0, 300)
    const move = touch('touchmove', input, 0, 320)

    expect(move.defaultPrevented).toBe(false)
    expect(isDragging(sheet)).toBe(false)
    app.unmount()
  })

  it('drags a sheet that was mounted closed and opened afterwards', async () => {
    const { sheet, content, openUpdates, app } = await openSheet(
      {},
      { startClosed: true },
    )

    touch('touchstart', content, 0, 300)
    const move = touch('touchmove', content, 0, 300 + CLOSE_DISTANCE + 20)
    advance(400)
    touch('touchend', content)

    expect(move.defaultPrevented).toBe(true)
    expect(isDragging(sheet)).toBe(true)
    expect(sheet.style.transform).toBe('translateY(100%)')

    advance(300)
    expect(openUpdates).toEqual([false])
    app.unmount()
  })

  it('drags again after the sheet is closed and reopened', async () => {
    const first = await openSheet({}, { startClosed: true })
    await first.setOpen(false)
    const { sheet, content, openUpdates, app } = await first.setOpen(true)

    touch('touchstart', content, 0, 300)
    const move = touch('touchmove', content, 0, 300 + CLOSE_DISTANCE + 20)
    advance(400)
    touch('touchend', content)

    expect(move.defaultPrevented).toBe(true)
    expect(sheet.style.transform).toBe('translateY(100%)')

    advance(300)
    expect(openUpdates).toEqual([false])
    app.unmount()
  })

  it('does not move for a gesture smaller than the slop', async () => {
    const { sheet, content, app } = await openSheet()

    touch('touchstart', content, 0, 300)
    const move = touch('touchmove', content, 0, 304)

    expect(move.defaultPrevented).toBe(false)
    expect(isDragging(sheet)).toBe(false)
    app.unmount()
  })

  /*
   * Pointer capture retargets the legacy mouse events too, so a captured sheet
   * receives the `click` that belongs to a button inside it. Capturing on
   * pointerdown therefore swallows clicks on every interactive child. These
   * specs pin down when capture is taken, which is the mechanism behind that.
   * jsdom dispatches no compatibility mouse events, so the retargeting itself
   * cannot be asserted here; the browser check covers that.
   */
  it('does not capture the pointer for a click that never becomes a drag', async () => {
    const { sheet, content, app } = await openSheet()
    const button = document.createElement('button')
    content.appendChild(button)

    pointer('pointerdown', button, 0, 300)
    pointer('pointerup', button, 0, 300)

    expect(captures).toEqual([])
    app.unmount()
  })

  it('captures the sheet only once the drag is committed', async () => {
    const { sheet, content, app } = await openSheet()

    pointer('pointerdown', content, 0, 300)
    // Under the slop: still undecided, so still no capture.
    pointer('pointermove', content, 0, 303)
    expect(captures).toEqual([])

    pointer('pointermove', content, 0, 320)
    expect(captures).toEqual([sheet])

    // A move that keeps dragging must not capture again.
    pointer('pointermove', content, 0, 340)
    expect(captures).toEqual([sheet])

    pointer('pointerup', content, 0, 340)
    expect(releases).toEqual([sheet])
    app.unmount()
  })

  it('releases nothing when a gesture ends without ever capturing', async () => {
    const { content, app } = await openSheet()

    pointer('pointerdown', content, 0, 300)
    pointer('pointerup', content, 0, 300)

    expect(releases).toEqual([])
    app.unmount()
  })

  it('is not wedged by an undecided gesture whose pointerup lands elsewhere', async () => {
    const { sheet, content, app } = await openSheet()

    // No capture yet, so a cursor that leaves the sheet takes its pointerup
    // with it and the sheet never hears the gesture end.
    pointer('pointerdown', content, 0, 300)
    pointer('pointerup', document.body, 0, 300)

    // Started well above the abandoned gesture, so a leftover start point would
    // read this as an upward drag and reject it.
    pointer('pointerdown', content, 0, 100)
    pointer('pointermove', content, 0, 120)

    expect(isDragging(sheet)).toBe(true)
    expect(captures).toEqual([sheet])
    app.unmount()
  })

  it('is not wedged by a committed drag whose capture was refused', async () => {
    const { sheet, content, app } = await openSheet()
    // A browser that refuses the capture. The drag still commits, so it looks
    // live, but it holds nothing and its pointerup can land anywhere.
    HTMLElement.prototype.setPointerCapture = function () {
      throw new Error('capture refused')
    }

    pointer('pointerdown', content, 0, 300)
    pointer('pointermove', content, 0, 320)
    expect(isDragging(sheet)).toBe(true)
    expect(captures).toEqual([])

    pointer('pointerup', document.body, 0, 400)

    installPointerCapture()
    pointer('pointerdown', content, 0, 100)
    pointer('pointermove', content, 0, 120)
    advance(20)

    // The fresh press superseded the stranded drag, so this one starts from
    // y=100 rather than continuing the old one from y=300.
    expect(captures).toEqual([sheet])
    expect(sheet.style.transform).toBe('translateY(20px)')
    app.unmount()
  })

  it('keeps a live touch drag when a stray mouse press arrives', async () => {
    const { sheet, content, app } = await openSheet()

    touch('touchstart', content, 0, 300)
    touch('touchmove', content, 0, 320)
    // Touch never captures, so it is excluded from the recovery above by name.
    // A touchscreen laptop can deliver this while the finger is still down.
    pointer('pointerdown', content, 0, 100)
    const later = touch('touchmove', content, 0, 360)
    advance(20)

    expect(later.defaultPrevented).toBe(true)
    expect(sheet.style.transform).toBe('translateY(60px)')
    app.unmount()
  })
})
