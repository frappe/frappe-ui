/**
 * Shared mount helpers for the code editor's jsdom tests.
 *
 * Not part of the public API: nothing re-exports it from `index.ts`, so it is
 * neither bundled nor documented. It stays extension-agnostic — every test
 * passes its own array through `extensions`, the same way a consumer does.
 */
import { createApp, defineComponent, h, nextTick } from 'vue'
import { EditorState, type Extension } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'

// jsdom runs no layout engine, so its Range carries no getClientRects at all.
// CodeMirror's drawSelection asks every range for one on each measure cycle,
// the TypeError is caught inside the cycle, and the logged stack trace buries
// the real assertion output. An empty rect list is the honest answer in a
// document that has no boxes. Scoped to this family rather than to the global
// vitest.setup.ts: only the CodeMirror tests reach that code path.
if (typeof Range !== 'undefined' && !Range.prototype.getClientRects) {
  const noRects = Object.assign([], {
    item: () => null,
  }) as unknown as DOMRectList
  Range.prototype.getClientRects = () => noRects
  Range.prototype.getBoundingClientRect = () => new DOMRect(0, 0, 0, 0)
}

/**
 * Every mount records how to take itself back down here. A failed assertion
 * skips the rest of the test body, so cleanup cannot live at the end of a
 * test. Without this registry a broken test leaks a live `EditorView`, and the
 * root element it was mounted into, straight into the next test.
 */
const teardowns: Array<() => void> = []

/**
 * Adds a teardown for something a test mounted itself, so it drains in the
 * same pass, and in the same order, as the ones the mount helpers register.
 */
export function registerCleanup(teardown: () => void) {
  teardowns.push(teardown)
}

/**
 * Drains the registry, last registered first. Hand it to `afterEach`.
 *
 * A throwing teardown must not strand the rest — that is the one thing this
 * registry exists to guarantee — so the drain finishes and the first failure
 * is rethrown afterwards. Swallowing it would hide a broken unmount.
 */
export function cleanupMounted() {
  let failure: unknown
  let failed = false
  while (teardowns.length) {
    try {
      teardowns.pop()!()
    } catch (error) {
      if (!failed) {
        failed = true
        failure = error
      }
    }
  }
  if (failed) throw failure
}

/**
 * Runs `setup` inside a real mounted component and hands back what it
 * returned, so a composable gets the owner instance its lifecycle hooks need.
 *
 * The returned `destroy` is already registered with `cleanupMounted`; call it
 * directly only when a test needs the component gone before the hook runs.
 */
export function mountSetup<T>(setup: () => T) {
  let result!: T
  const root = document.createElement('div')
  document.body.appendChild(root)
  const app = createApp(
    defineComponent({
      setup() {
        result = setup()
        return () => h('div')
      },
    }),
  )
  app.mount(root)

  // Idempotent, and it takes itself out of the registry: a test may destroy
  // early, and the afterEach hook must not then unmount a second time.
  let destroyed = false
  const destroy = () => {
    if (destroyed) return
    destroyed = true
    const i = teardowns.indexOf(destroy)
    if (i !== -1) teardowns.splice(i, 1)
    app.unmount()
    root.remove()
  }
  registerCleanup(destroy)
  return { result, app, root, destroy }
}

/**
 * Puts `view.dom` in the document. The engine builds the view detached, and a
 * gutter, a placeholder or a focus event needs it attached to behave.
 */
export function attachView(view: EditorView) {
  const parent = document.createElement('div')
  document.body.appendChild(parent)
  parent.appendChild(view.dom)
  registerCleanup(() => parent.remove())
  return parent
}

/**
 * A standalone attached view built from `extensions`. Used where a test needs
 * the rendered DOM of an extension array and not the engine around it.
 */
export function mountEditorView(extensions: Extension[], doc = '') {
  const parent = document.createElement('div')
  document.body.appendChild(parent)
  const view = new EditorView({
    state: EditorState.create({ doc, extensions }),
    parent,
  })
  registerCleanup(() => {
    view.destroy()
    parent.remove()
  })
  return view
}

/** Every binding in a state's keymap facet, flattened. */
export function keyBindings(state: EditorState) {
  return state.facet(keymap).flatMap((bindings) => [...bindings])
}

/** Every key a state's keymap facet binds. */
export function boundKeys(state: EditorState) {
  const keys = new Set<string>()
  for (const binding of keyBindings(state)) {
    if (binding.key) keys.add(binding.key)
    if (binding.mac) keys.add(binding.mac)
    if (binding.win) keys.add(binding.win)
    if (binding.linux) keys.add(binding.linux)
  }
  return keys
}

/** Drains the microtask queue and Vue's render queue a few times over. */
export const flush = async () => {
  for (let i = 0; i < 5; i++) {
    await Promise.resolve()
    await nextTick()
  }
}
