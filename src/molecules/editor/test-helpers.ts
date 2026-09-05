/**
 * Shared mount helpers for the editor's jsdom tests.
 *
 * Not part of the public API: nothing re-exports it from `index.ts`, so it is
 * neither bundled nor documented. It stays extension-agnostic: each test
 * passes its own kit through `extensions`.
 */
import { createApp, h, nextTick, reactive } from 'vue'
import Editor from './Editor.vue'
import EditorContent from './EditorContent.vue'
import type { Editor as TiptapEditor } from './useEditor'

type EditorProps = InstanceType<typeof Editor>['$props']

/**
 * Every mount records how to take itself back down here. A failed assertion
 * skips the rest of the test body, so cleanup cannot live at the end of a
 * test. Without this registry a broken test leaks a mounted editor, and the
 * root element it was mounted into, straight into the next test.
 */
const teardowns: Array<() => void> = []

/**
 * Adds a teardown for something a test mounted itself, so it drains in the
 * same pass, and in the same order, as the ones `mount` registers.
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
 * Mounts `Editor` with `EditorContent` in its default slot and hands back the
 * tiptap instance the slot receives. `modelValue` is reactive so the editor
 * behaves like a controlled one; everything else is passed through as static.
 *
 * The returned `destroy` is already registered with `cleanupMounted`; call it
 * directly only when a test needs the editor gone before the hook runs.
 */
export function mount(staticProps: EditorProps) {
  const state = reactive({ modelValue: '' })
  let editor: TiptapEditor | null = null
  const root = document.createElement('div')
  document.body.appendChild(root)
  const app = createApp({
    render() {
      return h(
        Editor,
        { ...staticProps, ...state },
        {
          default: ({ editor: e }: { editor: TiptapEditor | null }) => {
            editor = e
            return h(EditorContent, { editor: e })
          },
        },
      )
    },
  })
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
  return { getEditor: () => editor!, app, root, destroy }
}

/** Drains the microtask queue and Vue's render queue a few times over. */
export const flush = async () => {
  for (let i = 0; i < 5; i++) {
    await Promise.resolve()
    await nextTick()
  }
}
