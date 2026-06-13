// Code-editor primitives: a CodeMirror 6 writer (`CodeEditor`) and a sanitized
// read-only `CodePreview`, kept as two independent pieces. CodeMirror is
// lazy-loaded inside `CodeEditor`, so importing this barrel pulls in no editor
// code until a field actually mounts.
//
// Published from frappe-ui under its own `frappe-ui/code-editor` subpath (not the
// root barrel) so the CodeMirror dependency only loads for apps that opt in —
// the same isolation pattern as `frappe-ui/editor`.
export { default as CodeEditor } from './CodeEditor.vue'
export { default as CodePreview } from './CodePreview.vue'
export { loadLanguage } from './languages'
export type {
  CodeLanguage,
  CodeEditorVariant,
  CodeEditorProps,
  CodeEditorEmits,
  CodePreviewProps,
} from './types'
