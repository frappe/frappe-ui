import { effectScope, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { usePlotKeyboard, type PlotKeyboardReturn } from './usePlotKeyboard'

type Move = { index: number; previous: number | null }

/**
 * The composable behind a plot, with the marks under test's control and every
 * callback recorded. A scope stands in for the component: the count watcher
 * needs one to live in.
 */
function setup(marks = 4) {
  const count = ref(marks)
  const moves: Move[] = []
  const cleared: (number | null)[] = []
  const activated: number[] = []
  const scope = effectScope()
  let keyboard!: PlotKeyboardReturn

  scope.run(() => {
    keyboard = usePlotKeyboard({
      count: () => count.value,
      move: (index, previous) => moves.push({ index, previous }),
      activate: (index) => activated.push(index),
      clear: (previous) => cleared.push(previous),
    })
  })

  const handlers = () => keyboard.attrs.value as Record<string, any>
  return {
    count,
    moves,
    cleared,
    activated,
    keyboard,
    focus: () => handlers().onFocus(),
    blur: () => handlers().onBlur(),
    pointerdown: () => handlers().onPointerdown(),
    pointerup: () => handlers().onPointerup(),
    press: (key: string) =>
      handlers().onKeydown({ key, preventDefault: () => {} }),
  }
}

describe('usePlotKeyboard', () => {
  it('names the mark the cursor came off, so the plot can downplay it', () => {
    const plot = setup()
    plot.focus()
    plot.press('ArrowRight')
    expect(plot.moves).toEqual([
      { index: 0, previous: null },
      { index: 1, previous: 0 },
    ])
  })

  it('names the mark the cursor was on when it leaves', () => {
    const plot = setup()
    plot.focus()
    plot.press('ArrowRight')
    plot.blur()
    expect(plot.cleared).toEqual([1])
    expect(plot.keyboard.index.value).toBe(null)
  })

  it('holds no cursor to clear after Escape', () => {
    const plot = setup()
    plot.focus()
    plot.press('Escape')
    plot.blur()
    expect(plot.cleared).toEqual([0, null])
  })

  // A press focuses the plot as well. Stepping there would pull the tooltip off
  // the mark under the pointer.
  it('leaves the cursor alone when a pointer caused the focus', () => {
    const plot = setup()
    plot.pointerdown()
    plot.focus()
    expect(plot.moves).toEqual([])
    expect(plot.keyboard.index.value).toBe(null)
  })

  it('puts the cursor on the first mark on the next focus from a key', () => {
    const plot = setup()
    plot.pointerdown()
    plot.focus()
    plot.pointerup()
    plot.blur()
    plot.focus()
    expect(plot.moves).toEqual([{ index: 0, previous: null }])
  })

  // Fewer marks under a focused plot, and a cursor left past the end would make
  // Enter do nothing at all.
  it('follows the marks that remain when the data shrinks', async () => {
    const plot = setup()
    plot.focus()
    plot.press('End')
    expect(plot.keyboard.index.value).toBe(3)

    plot.count.value = 2
    await nextTick()
    expect(plot.keyboard.index.value).toBe(1)

    plot.press('Enter')
    expect(plot.activated).toEqual([1])
  })

  it('drops the cursor when the last mark goes', async () => {
    const plot = setup()
    plot.focus()
    plot.count.value = 0
    await nextTick()
    expect(plot.keyboard.index.value).toBe(null)
    expect(plot.cleared).toEqual([0])
  })

  it('clamps a cursor a chart moves itself', () => {
    const plot = setup()
    plot.keyboard.goTo(99)
    expect(plot.keyboard.index.value).toBe(3)
  })
})
