// frappe-ui experimental — UNSTABLE. No backward-compatibility promise.

export * from './experimental/Accordion'
export * from './experimental/FloatingWindow'
export * from './experimental/MultiEmailInput'
export { inputFontSizeClasses } from './src/components/Combobox/utils'
export {
  InputLabel,
  InputDescription,
  InputError,
} from './src/components/InputLabeling'
export { useInputLabeling } from './src/composables/useInputLabeling'
export type { FrappeUIError } from './src/composables/useInputLabeling'
export {
  CodeEditor,
  CodePreview,
  loadLanguage,
} from './experimental/CodeEditor'
export type {
  CodeLanguage,
  CodeEditorProps,
  CodeEditorEmits,
  CodePreviewProps,
} from './experimental/CodeEditor'
// Calendar family. Moved out of root (#1020, redirect of #989) — parked
// here, unstable, with its public API unchanged, until a redesigned
// calendar family replaces it. Migration is the import-path change only.
export * from './experimental/Calendar'
// v1 Charts family. Moved out of root (#942) — `frappe-ui/charts` is the
// replacement family and covers everything these drew. Parked here,
// unstable, as an interim import path while apps migrate. Migration is the
// import-path change only.
export * from './experimental/Charts'
// CommandPalette family. The root `CommandPalette` was removed in `1.0.0` and
// rebuilt here as seven composable parts. Unstable: the parts stay here until
// gameplan, helpdesk and this repo's docs site all run on them.
export * from './experimental/CommandPalette'
// ListView family. Moved out of root (#985) — `frappe-ui/list` is
// composition-based by design (P3) and doesn't replicate ListView's
// config-driven columns (resizable widths, per-column getLabel/prefix
// functions, tooltips, disabled-row exclusion, the select banner), so this
// stays here, unstable, until `frappe-ui/list` reaches parity.
export * from './experimental/ListView'
// v0 TextEditor family. Moved out of root (#974) — `frappe-ui/editor` is the
// composition-based replacement. Parked here (#1007), unstable, as an interim
// import path while apps migrate. Deletion stays human-gated (spec/editor.md
// §12).
export {
  TextEditor,
  TextEditorBubbleMenu,
  TextEditorFixedMenu,
  TextEditorFloatingMenu,
  TextEditorContent,
  createEditorButton,
} from './experimental/TextEditor'
export {
  ImageExtension,
  type SetImageOptions,
} from './experimental/TextEditor/extensions/image'
export {
  createSuggestionExtension,
  type BaseSuggestionItem,
  type CreateSuggestionExtensionOptions,
} from './experimental/TextEditor/extensions/suggestion'
// ThemeSwitcher. Moved out of root (#1094) — `Select` bound to
// `useColorScheme()` is the replacement, and it replaces the behavior rather
// than the markup: this renders a reka-ui `RadioGroupRoot` of preview cards.
// Parked here, unstable and still deprecated, while apps migrate.
export * from './experimental/ThemeSwitcher'
// Sprite icon trio. Moved out of `frappe-ui/icons` (#904) as a parking spot
// while apps migrate — `lucide-*` classes (and the root `Icon` component)
// are the canonical way to render icons. Unstable; will be removed.
export * from './experimental/SpriteIcons'
