import type { EditorView } from '@codemirror/view'

/**
 * What `<CodeEditor>` exposes on a template ref (ADR-0012).
 *
 * One member, and it is the view itself rather than a set of verbs — so
 * reaching the editor from a parent's script adds nothing to the imperative
 * surface. Every recipe is then raw CodeMirror: `view.focus()`,
 * `view.dispatch(view.state.replaceSelection(text))`, `openSearchPanel(view)`.
 *
 * `EditorView | null`, not `ShallowRef<EditorView | null>`: Vue unwraps a
 * handed-back ref at the proxy boundary, so a caller reads the view, never the
 * ref. Declaring the ref here would compile `el.value?.editor.value?.focus()`
 * and do nothing at runtime, and would hand out a writable ref the engine owns.
 * `useCodeEditor` still returns the ref — a composable crosses no boundary.
 */
export interface CodeEditorExposed {
  editor: EditorView | null
}
