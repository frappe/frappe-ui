import {
  computed,
  inject,
  provide,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from 'vue'
import type { EditorView } from '@codemirror/view'

/**
 * Code editor context.
 *
 * `<CodeEditor>` provides its live `EditorView` ref through this key so the
 * parts rendered in its slot (`CodeEditorContent`) can pull it via `inject`
 * instead of having `:editor` threaded down by hand. An explicit `:editor`
 * prop always wins, which is what keeps the parts usable WITHOUT
 * `<CodeEditor>` (composed directly on a `useCodeEditor` ref).
 *
 * The shape mirrors `frappe-ui/editor`'s `editor-context.ts`. The two families
 * keep separate keys: a code editor nested inside a rich-text editor must not
 * inject the TipTap instance, and vice versa.
 */
export const CodeEditorContextKey: InjectionKey<Ref<EditorView | null>> =
  Symbol('frappe-ui-code-editor-context')

/** Publish a view ref to descendant parts. Called by `<CodeEditor>`. */
export function provideCodeEditor(editor: Ref<EditorView | null>): void {
  provide(CodeEditorContextKey, editor)
}

/**
 * Resolve the view a part should use: the explicit `:editor` prop when one was
 * passed (even `null`), otherwise the injected context. Returns a reactive
 * `ComputedRef` so the part tracks the view coming online.
 */
export function useResolvedCodeEditor(
  getProp: () => EditorView | null | undefined,
): ComputedRef<EditorView | null> {
  const injected = inject(CodeEditorContextKey, null)
  return computed(() => {
    const fromProp = getProp()
    if (fromProp !== undefined) return fromProp
    return injected?.value ?? null
  })
}
