/**
 * @vitest-environment jsdom
 *
 * The engine's contract, pinned against a real `EditorView`: two-way content,
 * the minimal-diff external write, the echo guard, and the reconfigure that
 * keeps the document, the selection and the undo history.
 */

import { describe, it, expect, vi, afterEach } from 'vitest'
import { ref, shallowRef, type Ref } from 'vue'
import { history, undo } from '@codemirror/commands'
import { EditorState, type Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { useCodeEditor, diffDocument } from './useCodeEditor'
import { attachView, cleanupMounted, flush, mountSetup } from './test-helpers'

afterEach(cleanupMounted)

/** Every change a doc update carried, as plain ranges. */
function recordChanges(
  log: Array<{ from: number; to: number; insert: string }>,
) {
  return EditorView.updateListener.of((update) => {
    if (!update.docChanged) return
    update.changes.iterChanges((fromA, toA, _fromB, _toB, inserted) => {
      log.push({ from: fromA, to: toA, insert: inserted.toString() })
    })
  })
}

type EngineOptions = Parameters<typeof useCodeEditor>[0]

/** Mounts the engine and hands back the live view plus the mount's teardown. */
function mountEngine(options: EngineOptions) {
  const mounted = mountSetup(() => useCodeEditor(options))
  const editor = mounted.result
  const view = editor.value!
  attachView(view)
  return { editor, view, destroy: mounted.destroy }
}

describe('diffDocument', () => {
  it('inserts the whole value into an empty document', () => {
    expect(diffDocument('', 'SELECT 1')).toEqual({
      from: 0,
      to: 0,
      insert: 'SELECT 1',
    })
  })

  it('clears a document with one empty insert', () => {
    expect(diffDocument('SELECT 1', '')).toEqual({
      from: 0,
      to: 8,
      insert: '',
    })
  })

  it('skips a shared prefix', () => {
    expect(diffDocument('select a', 'select b')).toEqual({
      from: 7,
      to: 8,
      insert: 'b',
    })
  })

  it('skips a shared suffix', () => {
    expect(diffDocument('a from t', 'b from t')).toEqual({
      from: 0,
      to: 1,
      insert: 'b',
    })
  })

  it('touches nothing when only the middle differs', () => {
    expect(diffDocument('aaa MIDDLE zzz', 'aaa CENTER zzz')).toEqual({
      from: 4,
      to: 10,
      insert: 'CENTER',
    })
  })

  it('clamps the suffix so it cannot overlap the prefix', () => {
    // Both scans would claim the same characters without the clamp, and the
    // range would come out backwards (`to` < `from`).
    expect(diffDocument('aaa', 'aaaaa')).toEqual({
      from: 3,
      to: 3,
      insert: 'aa',
    })
    expect(diffDocument('aaaaa', 'aaa')).toEqual({
      from: 3,
      to: 5,
      insert: '',
    })
  })

  it('never produces a backwards range', () => {
    const pairs: Array<[string, string]> = [
      ['', ''],
      ['abc', 'abc'],
      ['aaa', 'aa'],
      ['ababab', 'abab'],
      ['x', 'xyx'],
      ['hello world', 'world hello'],
    ]
    for (const [current, next] of pairs) {
      const change = diffDocument(current, next)
      expect(change.to).toBeGreaterThanOrEqual(change.from)
      expect(change.to).toBeLessThanOrEqual(current.length)
      // Applying it has to produce exactly `next`.
      const applied =
        current.slice(0, change.from) + change.insert + current.slice(change.to)
      expect(applied).toBe(next)
    }
  })
})

describe('useCodeEditor content binding', () => {
  it('seeds the document from the content ref', () => {
    const content = ref('SELECT 1')
    const { view } = mountEngine({ content, extensions: [] })
    expect(view.state.doc.toString()).toBe('SELECT 1')
  })

  it('writes an internal edit out to the content ref', () => {
    const content = ref('SELECT')
    const { view } = mountEngine({ content, extensions: [] })

    view.dispatch({ changes: { from: 6, insert: ' 1' } })

    expect(content.value).toBe('SELECT 1')
  })

  it('applies an external write to the document', async () => {
    const content = ref('SELECT 1')
    const { view } = mountEngine({ content, extensions: [] })

    content.value = 'SELECT 2'
    await flush()

    expect(view.state.doc.toString()).toBe('SELECT 2')
  })

  it('does not re-dispatch an internal edit that bounces back through the ref', async () => {
    const content = ref('SELECT')
    const changes: Array<{ from: number; to: number; insert: string }> = []
    const { view } = mountEngine({
      content,
      extensions: [recordChanges(changes)],
    })

    view.dispatch({ changes: { from: 6, insert: ' 1' } })
    expect(content.value).toBe('SELECT 1')

    // The ref now holds what the document holds. The watcher runs on the next
    // tick, and the echo guard is what keeps it from dispatching again.
    const dispatch = vi.spyOn(view, 'dispatch')
    await flush()

    expect(dispatch).not.toHaveBeenCalled()
    expect(changes).toEqual([{ from: 6, to: 6, insert: ' 1' }])
    expect(view.state.doc.toString()).toBe('SELECT 1')
  })

  it('dispatches nothing for an external write equal to the document', async () => {
    const content = ref('SELECT 1')
    const { view } = mountEngine({ content, extensions: [] })
    const dispatch = vi.spyOn(view, 'dispatch')

    content.value = 'SELECT 1'
    await flush()

    expect(dispatch).not.toHaveBeenCalled()
  })

  it('changes only the differing middle, leaving a caret outside it alone', async () => {
    const content = ref('aaa MIDDLE zzz')
    const changes: Array<{ from: number; to: number; insert: string }> = []
    const { view } = mountEngine({
      content,
      extensions: [recordChanges(changes)],
    })

    // A caret in the shared prefix, ahead of everything the write touches.
    view.dispatch({ selection: { anchor: 2 } })

    content.value = 'aaa CENTER zzz'
    await flush()

    expect(view.state.doc.toString()).toBe('aaa CENTER zzz')
    expect(changes).toEqual([{ from: 4, to: 10, insert: 'CENTER' }])
    expect(view.state.selection.main.anchor).toBe(2)
    expect(view.state.selection.main.head).toBe(2)
  })

  it('keeps a selection that sits outside the changed span', async () => {
    const content = ref('aaa MIDDLE zzz')
    const { view } = mountEngine({ content, extensions: [] })

    // A range over the shared prefix: both ends are before the change.
    view.dispatch({ selection: { anchor: 0, head: 3 } })

    content.value = 'aaa CENTER zzz'
    await flush()

    expect(view.state.selection.main.anchor).toBe(0)
    expect(view.state.selection.main.head).toBe(3)
  })
})

describe('useCodeEditor reactivity', () => {
  it('reconfigures without recreating the view, keeping doc, selection and history', async () => {
    const content = ref('start')
    // One `history()` instance across both arrays: CodeMirror keys state fields
    // by extension identity, so the undo stack only survives if it is the same
    // extension value on either side of the swap.
    const historyExtension = history()
    // `shallowRef`, not `ref`: `Extension` is recursive
    // (`{extension: Extension} | readonly Extension[]`), and unwrapping it
    // blows TypeScript's instantiation depth.
    const extensions = shallowRef<Extension[]>([historyExtension])
    const { editor, view } = mountEngine({ content, extensions })

    view.dispatch({ changes: { from: 5, insert: ' more' } })
    view.dispatch({ selection: { anchor: 2 } })
    expect(view.state.doc.toString()).toBe('start more')

    extensions.value = [
      historyExtension,
      EditorView.contentAttributes.of({ 'data-reconfigured': 'yes' }),
    ]
    await flush()

    // Same view: a reconfigure is a dispatch, not a rebuild.
    expect(editor.value).toBe(view)
    expect(view.contentDOM.getAttribute('data-reconfigured')).toBe('yes')
    expect(view.state.doc.toString()).toBe('start more')
    expect(view.state.selection.main.anchor).toBe(2)

    undo(view)
    expect(view.state.doc.toString()).toBe('start')
    expect(content.value).toBe('start')
  })

  it('maps editable onto readOnly and the editable facet, reactively', async () => {
    const editable = ref(true)
    const { view } = mountEngine({ extensions: [], editable })

    expect(view.state.readOnly).toBe(false)
    expect(view.state.facet(EditorView.editable)).toBe(true)

    editable.value = false
    await flush()

    expect(view.state.readOnly).toBe(true)
    expect(view.state.facet(EditorView.editable)).toBe(false)

    editable.value = true
    await flush()

    expect(view.state.readOnly).toBe(false)
    expect(view.state.facet(EditorView.editable)).toBe(true)
  })

  it('defaults editable to true', () => {
    const { view } = mountEngine({ extensions: [] })
    expect(view.state.readOnly).toBe(false)
    expect(view.state.facet(EditorView.editable)).toBe(true)
  })

  it('carries editable through an extensions swap', async () => {
    const editable = ref(false)
    const extensions = shallowRef<Extension[]>([])
    const { view } = mountEngine({ extensions, editable })

    extensions.value = [EditorState.tabSize.of(8)]
    await flush()

    expect(view.state.tabSize).toBe(8)
    expect(view.state.readOnly).toBe(true)
  })
})

describe('useCodeEditor callbacks', () => {
  it('calls onUpdate on every document change', () => {
    const onUpdate = vi.fn()
    const { view } = mountEngine({ extensions: [], onUpdate })

    view.dispatch({ changes: { from: 0, insert: 'a' } })
    view.dispatch({ changes: { from: 1, insert: 'b' } })
    // A selection-only dispatch is not a document change.
    view.dispatch({ selection: { anchor: 0 } })

    expect(onUpdate).toHaveBeenCalledTimes(2)
    expect(onUpdate).toHaveBeenLastCalledWith(view)
  })

  it('calls onChange on blur, not on a document change', () => {
    const onChange = vi.fn()
    const { view } = mountEngine({ extensions: [], onChange })

    view.dispatch({ changes: { from: 0, insert: 'SELECT 1' } })
    expect(onChange).not.toHaveBeenCalled()

    view.contentDOM.dispatchEvent(new FocusEvent('blur'))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(view)
    expect(view.state.doc.toString()).toBe('SELECT 1')
  })

  it('forwards the focus and blur events', () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()
    const { view } = mountEngine({ extensions: [], onFocus, onBlur })

    const focusEvent = new FocusEvent('focus')
    view.contentDOM.dispatchEvent(focusEvent)
    expect(onFocus).toHaveBeenCalledWith(view, focusEvent)

    const blurEvent = new FocusEvent('blur')
    view.contentDOM.dispatchEvent(blurEvent)
    expect(onBlur).toHaveBeenCalledWith(view, blurEvent)
  })
})

describe('useCodeEditor lifecycle', () => {
  it('destroys the view and nulls the ref on unmount', () => {
    const content: Ref<string> = ref('SELECT 1')
    const { editor, view, destroy } = mountEngine({ content, extensions: [] })

    expect(view.dom.isConnected).toBe(true)

    destroy()

    expect(editor.value).toBeNull()
    // `EditorView.destroy()` takes its own DOM out of the document. That is the
    // public signal the view was torn down, and not merely dropped from the ref.
    expect(view.dom.isConnected).toBe(false)
  })

  it('stops binding content once the view is gone', async () => {
    const content = ref('SELECT 1')
    const { destroy } = mountEngine({ content, extensions: [] })

    destroy()
    content.value = 'SELECT 2'

    await expect(flush()).resolves.toBeUndefined()
  })
})
