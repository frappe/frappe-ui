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
export { CodeEditor, CodePreview, loadLanguage } from './experimental/CodeEditor'
export type {
  CodeLanguage,
  CodeEditorProps,
  CodeEditorEmits,
  CodePreviewProps,
} from './experimental/CodeEditor'
// ListView family. Moved out of root (#985) — `frappe-ui/list` is
// composition-based by design (P3) and doesn't replicate ListView's
// config-driven columns (resizable widths, per-column getLabel/prefix
// functions, tooltips, disabled-row exclusion, the select banner), so this
// stays here, unstable, until `frappe-ui/list` reaches parity.
export * from './experimental/ListView'
// Sprite icon trio. Moved out of `frappe-ui/icons` (#904) as a parking spot
// while apps migrate — `lucide-*` classes (and the root `Icon` component)
// are the canonical way to render icons. Unstable; will be removed.
export * from './experimental/SpriteIcons'
