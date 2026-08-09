// @ts-nocheck -- frozen v0 code, kept out of type-check (see tsconfig.app.json)
// v0 TextEditor family. Moved out of root (#974) — `frappe-ui/editor` is the
// composition-based replacement. Parked here (#1007), unstable, as an interim
// import path while apps migrate. Deletion stays human-gated (spec/editor.md
// §12).
//
// This is a dedicated entry (`frappe-ui/experimental/text-editor`), not part
// of the shared `frappe-ui/experimental` barrel: it keeps TipTap and the rest
// of the heavy editor graph out of every other experimental importer's module
// graph (ADR-0004's wall), and makes eventual deletion a one-line `exports`
// removal.

/** @deprecated Use `Editor` from `frappe-ui/editor` instead. */
export { default as TextEditor } from './TextEditor.vue'

/** @deprecated Use `EditorBubbleMenu` from `frappe-ui/editor` instead. */
export { default as TextEditorBubbleMenu } from './components/TextEditorBubbleMenu.vue'

/** @deprecated Use `EditorFixedMenu` from `frappe-ui/editor` instead. */
export { default as TextEditorFixedMenu } from './components/TextEditorFixedMenu.vue'

/** @deprecated Use `EditorFloatingMenu` from `frappe-ui/editor` instead. */
export { default as TextEditorFloatingMenu } from './components/TextEditorFloatingMenu.vue'

/** @deprecated Use `EditorContent` from `frappe-ui/editor` instead. */
export { EditorContent as TextEditorContent } from '@tiptap/vue-3'

/** @deprecated Use toolbar presets and menu items from `frappe-ui/editor` instead. */
export { createEditorButton } from './utils'

/** @deprecated Use extensions from `frappe-ui/editor` instead. */
export { ImageExtension, type SetImageOptions } from './extensions/image'

/** @deprecated Use extensions from `frappe-ui/editor` instead. */
export {
  createSuggestionExtension,
  type BaseSuggestionItem,
  type CreateSuggestionExtensionOptions,
} from './extensions/suggestion'
