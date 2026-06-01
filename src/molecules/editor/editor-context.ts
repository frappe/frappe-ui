import { computed, inject, provide, type ComputedRef, type InjectionKey, type Ref } from 'vue'
import type { Editor } from './useEditor'

/**
 * Editor context.
 *
 * `<Editor>` provides its live editor ref through this key so the building
 * blocks rendered in its slot (`EditorContent`, the menu components) can pull it
 * via `inject` instead of having `:editor` threaded down by hand. An explicit
 * `:editor` prop always wins, which is what keeps the primitives usable WITHOUT
 * `<Editor>` (composed directly on a `useEditor` ref — see the Primitives
 * recipe).
 */
export const EditorContextKey: InjectionKey<Ref<Editor | null>> = Symbol(
  'frappe-ui-editor-context',
)

/** Publish an editor ref to descendant building blocks. Called by `<Editor>`. */
export function provideEditor(editor: Ref<Editor | null>): void {
  provide(EditorContextKey, editor)
}

/**
 * Resolve the editor a building block should use: the explicit `:editor` prop
 * when one was passed (even `null`), otherwise the injected context. Returns a
 * reactive `ComputedRef` so the block tracks the editor coming online.
 */
export function useResolvedEditor(
  getProp: () => Editor | null | undefined,
): ComputedRef<Editor | null> {
  const injected = inject(EditorContextKey, null)
  return computed(() => {
    const fromProp = getProp()
    if (fromProp !== undefined) return fromProp
    return injected?.value ?? null
  })
}
