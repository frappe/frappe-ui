import type { ShallowRef } from 'vue'
import type { EditorView } from '@codemirror/view'

/**
 * What `<CodeEditor>` exposes on a template ref (ADR-0012).
 *
 * One member, and it is the view ref itself rather than a set of verbs — so
 * reaching the editor from a parent's script adds nothing to the imperative
 * surface. Every recipe is then raw CodeMirror: `view.focus()`,
 * `view.dispatch(view.state.replaceSelection(text))`, `openSearchPanel(view)`.
 */
export interface CodeEditorExposed {
  editor: ShallowRef<EditorView | null>
}
