import { effectScope, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { usePlotKeyboard, type PlotKeyboardReturn } from './usePlotKeyboard'
import { markName } from '../utils'

type Move = { index: number; previous: number | null }

/**
 * The composable behind a plot, with the marks under test's control and every
 * callback recorded. A scope stands in for the component: the mark watcher
 * needs one to live in. A mark names itself here, as an app's rows do.
 */
function setup(count = 4) {
  const marks = ref(Array.from({ length: count }, (_, i) => `mark ${i}`))
  const moves: Move[] = []
  const cleared: (number | null)[] = []
  const activated: number[] = []
  const scope = effectScope()
  let keyboard!: PlotKeyboardReturn

  scope.run(() => {
    keyboard = usePlotKeyboard({
      marks: () => marks.value,
      key: (mark) => mark,
      move: (index, previous) => moves.push({ index, previous }),
      activate: (index) => activated.push(index),
      clear: (previous) => cleared.push(previous),
    })
  })

  const handlers = () => keyboard.attrs.value as Record<string, any>
  return {
    marks,
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
    pressEvent: (key: string) => {
      const event = { key, prevented: false, preventDefault() {
        event.prevented = true
      } }
      handlers().onKeydown(event)
      return event
    },
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

  // A plot inside a dialog: the dialog closes on Escape unless something has
  // already prevented the event. With no cursor the plot has nothing to
  // dismiss, so it leaves the key alone.
  it('leaves Escape alone when it has no cursor to drop', () => {
    const plot = setup()
    plot.focus()
    expect(plot.pressEvent('Escape').prevented).toBe(true)
    expect(plot.pressEvent('Escape').prevented).toBe(false)
    expect(plot.cleared).toEqual([0])
  })

  // Alt or Cmd with an arrow is browser back, Ctrl with Home is the top of the
  // page. The plot answers none of them and keeps its hands off the event.
  it('leaves a key with a modifier held to the browser', () => {
    const plot = setup()
    plot.focus()
    const handlers = () => plot.keyboard.attrs.value as Record<string, any>
    for (const modifier of ['altKey', 'metaKey', 'ctrlKey']) {
      const event = {
        key: 'ArrowRight',
        [modifier]: true,
        prevented: false,
        preventDefault() {
          event.prevented = true
        },
      }
      handlers().onKeydown(event)
      expect(event.prevented).toBe(false)
    }
    expect(plot.keyboard.index.value).toBe(0)
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

  // A press that ends outside the plot never sends the release back to it, so
  // leaving the plot has to clear the flag as well.
  it('takes the next focus after a press that ended elsewhere', () => {
    const plot = setup()
    plot.focus()
    plot.pointerdown()
    plot.blur()
    plot.focus()
    expect(plot.moves).toEqual([
      { index: 0, previous: null },
      { index: 0, previous: null },
    ])
  })

  // Fewer marks under a focused plot, and a cursor left past the end would make
  // Enter do nothing at all.
  it('follows the marks that remain when the data shrinks', async () => {
    const plot = setup()
    plot.focus()
    plot.press('End')
    expect(plot.keyboard.index.value).toBe(3)

    plot.marks.value = ['mark 0', 'mark 1']
    await nextTick()
    expect(plot.keyboard.index.value).toBe(1)

    plot.press('Enter')
    expect(plot.activated).toEqual([1])
  })

  // Same count, new values: the tooltip and the reading are taken at the move,
  // so without this the plot announces a number that has gone.
  it('reads the mark again when the data is replaced', async () => {
    const plot = setup()
    plot.focus()
    plot.marks.value = ['new 0', 'new 1', 'new 2', 'new 3']
    await nextTick()
    expect(plot.moves).toEqual([
      { index: 0, previous: null },
      { index: 0, previous: 0 },
    ])
  })

  // A filter or a sort moves a mark along the list. The cursor is on a mark,
  // not on a slot, so Enter still fires for the one that was read out.
  it('follows its own mark when earlier ones go', async () => {
    const plot = setup()
    plot.focus()
    plot.press('End')
    plot.marks.value = ['mark 1', 'mark 2', 'mark 3']
    await nextTick()
    expect(plot.keyboard.index.value).toBe(2)
  })

  it('follows its own mark when one is inserted before it', async () => {
    const plot = setup()
    plot.focus()
    plot.press('ArrowRight')
    plot.marks.value = ['new', 'mark 0', 'mark 1', 'mark 2', 'mark 3']
    await nextTick()
    expect(plot.keyboard.index.value).toBe(2)
  })

  // A refetch answers with rows that are equal and not the same, so the name
  // has to be a value rather than the row object.
  it('finds its mark again in rows a refetch rebuilt', async () => {
    const rows = ref([{ id: 'a' }, { id: 'b' }, { id: 'c' }])
    const scope = effectScope()
    let keyboard!: PlotKeyboardReturn
    scope.run(() => {
      keyboard = usePlotKeyboard({
        marks: () => rows.value,
        key: (row) => row.id,
        move: () => {},
        activate: () => {},
        clear: () => {},
      })
    })

    keyboard.goTo(2)
    // Rebuilt objects, reordered, and c is now first: the cursor is on the
    // mark, so it follows.
    rows.value = [{ id: 'c' }, { id: 'b' }, { id: 'a' }]
    await nextTick()
    expect(keyboard.index.value).toBe(0)

    rows.value = [{ id: 'c' }]
    await nextTick()
    expect(keyboard.index.value).toBe(0)
  })

  // Two rows can carry the same category. The one beside the old slot is the
  // one the reader was on, so a name that repeats is resolved by nearness.
  it('picks the nearer of two marks with the same name', async () => {
    const plot = setup()
    plot.marks.value = ['a', 'b', 'a', 'c']
    plot.keyboard.goTo(2)
    // Two marks called a: at 0, and at 3 beside the slot the cursor was in.
    plot.marks.value = ['a', 'b', 'x', 'a', 'c']
    await nextTick()
    expect(plot.keyboard.index.value).toBe(3)
  })

  // Escape leaves the focus on the plot. The cross keys have no mark to cross
  // from then, so they place the cursor like the others rather than doing
  // nothing or crossing from an assumed first mark.
  it('places the cursor when a cross key comes with none', () => {
    const crossed: number[] = []
    const scope = effectScope()
    let keyboard!: PlotKeyboardReturn
    scope.run(() => {
      keyboard = usePlotKeyboard({
        marks: () => ['a', 'b', 'c'],
        key: (mark) => mark,
        move: () => {},
        activate: () => {},
        clear: () => {},
        cross: (delta) => crossed.push(delta),
      })
    })
    const press = (key: string) =>
      (keyboard.attrs.value as Record<string, any>).onKeydown({
        key,
        preventDefault: () => {},
      })

    press('ArrowDown')
    expect(keyboard.index.value).toBe(0)
    expect(crossed).toEqual([])

    press('ArrowDown')
    expect(crossed).toEqual([1])
    expect(keyboard.index.value).toBe(0)
  })

  // The same key has to answer the same way whether or not the chart crosses,
  // so ArrowUp with no cursor lands on the last mark either way.
  it('steps a cross key by its own direction when there is no cursor', () => {
    const scope = effectScope()
    let keyboard!: PlotKeyboardReturn
    scope.run(() => {
      keyboard = usePlotKeyboard({
        marks: () => ['a', 'b', 'c'],
        key: (mark) => mark,
        move: () => {},
        activate: () => {},
        clear: () => {},
        cross: () => {},
      })
    })
    ;(keyboard.attrs.value as Record<string, any>).onKeydown({
      key: 'ArrowUp',
      preventDefault: () => {},
    })
    expect(keyboard.index.value).toBe(2)

    const plain = setup(3)
    plain.press('ArrowUp')
    expect(plain.keyboard.index.value).toBe(2)
  })

  it('reads the mark again when a chart asks', () => {
    const plot = setup()
    plot.focus()
    plot.keyboard.refresh()
    expect(plot.moves).toHaveLength(2)
  })

  it('does nothing on a refresh with no cursor', () => {
    const plot = setup()
    plot.keyboard.refresh()
    expect(plot.moves).toEqual([])
    expect(plot.cleared).toEqual([])
  })

  it('drops the cursor when the last mark goes', async () => {
    const plot = setup()
    plot.focus()
    plot.marks.value = []
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

// What a chart hands the cursor as a name. Names are compared with `===`, so a
// value a refetch rebuilds has to read the same each time.
describe('markName', () => {
  it('leaves a category and a number as they are', () => {
    expect(markName('Jan')).toBe('Jan')
    expect(markName(12)).toBe(12)
  })

  it('reads a date as its instant', () => {
    const at = '2026-01-01T00:00:00.000Z'
    expect(markName(new Date(at))).toBe(markName(new Date(at)))
    expect(markName(new Date(at))).toBe(Date.parse(at))
  })

  it('has no name for a blank cell', () => {
    expect(markName(null)).toBe(undefined)
    expect(markName(undefined)).toBe(undefined)
  })
})
