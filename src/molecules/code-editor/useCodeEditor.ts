import {
  onBeforeUnmount,
  onMounted,
  shallowRef,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
  type ShallowRef,
} from 'vue'
import { EditorState, StateEffect, type Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

/**
 * Options for `useCodeEditor`.
 *
 * `extensions` is required and carries every capability: languages, keymaps,
 * completion sources, themes. The engine defines none of its own, which is what
 * keeps a consumer free to pass an extension frappe-ui never heard of.
 */
export interface CodeEditorOptions {
  /** The document text, two-way. Mirrors `useEditor`'s `content` binding. */
  content?: Ref<string>
  /**
   * Every extension the view loads. Reactive: a new array is re-applied with a
   * top-level `StateEffect.reconfigure`, so the doc, the selection and the
   * history survive the swap.
   */
  extensions: MaybeRefOrGetter<Extension[]>
  /** Default `true`. Reactive. Sugar over `readOnly` + `EditorView.editable`. */
  editable?: MaybeRefOrGetter<boolean>
  /** One-shot at mount. Not reactive. */
  autofocus?: boolean
  /** Every document change. */
  onUpdate?: (view: EditorView) => void
  /** Blur: the commit point. */
  onChange?: (view: EditorView) => void
  onFocus?: (view: EditorView, event: FocusEvent) => void
  onBlur?: (view: EditorView, event: FocusEvent) => void
}

/**
 * Compute the single change that turns `current` into `next`: skip the longest
 * common prefix, then the longest common suffix, and replace what is left.
 *
 * Replacing the whole document instead would reset the caret to the end,
 * collapse the selection, jump the scroll position and abort an in-flight IME
 * composition. CodeMirror maps the live selection through a narrow change, so
 * an external write that does not touch the caret leaves it where it was.
 *
 * Exported for the tests that pin that contract.
 */
export function diffDocument(current: string, next: string) {
  let from = 0
  const max = Math.min(current.length, next.length)
  while (from < max && current[from] === next[from]) from++

  // The suffix scan stops at `from` on both sides, so the prefix and the suffix
  // can never overlap and produce a backwards range.
  let currentEnd = current.length
  let nextEnd = next.length
  while (
    currentEnd > from &&
    nextEnd > from &&
    current[currentEnd - 1] === next[nextEnd - 1]
  ) {
    currentEnd--
    nextEnd--
  }

  return { from, to: currentEnd, insert: next.slice(from, nextEnd) }
}

/**
 * The engine. Owns the `EditorView` lifecycle, binds content, re-applies
 * `extensions`, and destroys the view on unmount.
 *
 * The view is created without a `parent`, so `view.dom` is detached until a
 * part appends it. `<CodeEditorContent>` does the appending, the same way
 * tiptap's `EditorContent` mounts a `useEditor` instance.
 *
 * Returns the view unwrapped and nothing else: no facade, no helper verbs. The
 * recipes a consumer needs are raw CodeMirror one-liners.
 */
export function useCodeEditor(
  options: CodeEditorOptions,
): ShallowRef<EditorView | null> {
  const editor = shallowRef<EditorView | null>(null)

  // SSR guard — no view without a DOM. The ref stays null until the client
  // takes over, which is the same window a consumer already handles for a view
  // that has not mounted yet.
  if (typeof document === 'undefined') return editor

  // Guards the content watcher against the view's own update listener: when we
  // dispatch an external write we must not echo it straight back out.
  let applyingExternalUpdate = false

  const updateListener = EditorView.updateListener.of((update) => {
    // An external write is already the consumer's own value. Reporting it back
    // as an update would echo it: `update:modelValue` firing in answer to a
    // `v-model` write, and `onChange` handlers running on their own output.
    if (!update.docChanged || applyingExternalUpdate) return
    if (options.content) options.content.value = update.state.doc.toString()
    options.onUpdate?.(update.view)
  })

  const eventHandlers = EditorView.domEventHandlers({
    focus: (event, view) => {
      options.onFocus?.(view, event)
    },
    // Blur is the commit point. CodeMirror's contenteditable fires no native
    // `change` event, so nothing reaches the consumer from the DOM — the commit
    // has to be emitted, and this is where it happens. `onChange` runs first so
    // a consumer that normalizes the value on commit (JSON pretty-print) has
    // done it by the time `onBlur` runs.
    blur: (event, view) => {
      options.onChange?.(view)
      options.onBlur?.(view, event)
    },
  })

  /**
   * The full top-level configuration. Ours goes last so a consumer's extension
   * wins on every facet it also sets.
   *
   * `editable` is folded in here rather than held in a `Compartment`: a
   * top-level reconfigure replaces the whole configuration anyway, so one
   * rebuild path serves both reactive options and no compartment reaches the
   * public API.
   */
  function buildConfiguration(): Extension[] {
    const editable = toValue(options.editable) ?? true
    return [
      ...toValue(options.extensions),
      updateListener,
      eventHandlers,
      EditorState.readOnly.of(!editable),
      EditorView.editable.of(editable),
    ]
  }

  function reconfigure() {
    editor.value?.dispatch({
      effects: StateEffect.reconfigure.of(buildConfiguration()),
    })
  }

  const view = new EditorView({
    doc: options.content?.value ?? '',
    extensions: buildConfiguration(),
  })
  editor.value = view

  // Re-apply the array itself, then the `editable` sugar. Both rebuild the
  // whole configuration, so a change to either carries the other along.
  //
  // The array is compared member by member, not by reference: an inline
  // `:extensions="[CodeKit, json()]"` hands over a fresh array on every render
  // of the parent, and reconfiguring on each one would re-parse the document
  // for nothing.
  let applied = toValue(options.extensions)
  watch(
    () => toValue(options.extensions),
    (next) => {
      if (
        next.length === applied.length &&
        next.every((extension, i) => extension === applied[i])
      ) {
        return
      }
      applied = next
      reconfigure()
    },
  )
  watch(() => toValue(options.editable), reconfigure)

  if (options.content) {
    watch(options.content, (next) => {
      const current = view.state.doc.toString()
      const value = next ?? ''
      if (value === current) return

      applyingExternalUpdate = true
      try {
        view.dispatch({ changes: diffDocument(current, value) })
      } finally {
        applyingExternalUpdate = false
      }
    })
  }

  // `view.dom` is detached at construction, and focusing a detached element
  // does nothing. A part appends it while mounting, and a child mounts before
  // its parent, so by the time this runs the view is in the document.
  if (options.autofocus) onMounted(() => view.focus())

  onBeforeUnmount(() => {
    view.destroy()
    editor.value = null
  })

  return editor
}
