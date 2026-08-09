// Code-editor primitives: a CodeMirror 6 writer (`CodeEditor`) and a sanitized
// read-only `CodePreview`, kept as two independent pieces. CodeMirror is
// lazy-loaded inside `CodeEditor`, so importing this barrel pulls in no editor
// code until a field actually mounts.
//
// Re-exported from `frappe-ui/experimental` (ADR-0010) rather than the root
// barrel or its own subpath: CodeMirror is entirely behind `await import()`
// (nothing static to isolate), and `CodePreview`'s static `marked` dependency
// would otherwise re-enter root's dependency graph.
export { default as CodeEditor } from './CodeEditor.vue'
export { default as CodePreview } from './CodePreview.vue'
export { loadLanguage } from './languages'
export type {
  CodeLanguage,
  CodeEditorProps,
  CodeEditorEmits,
  CodePreviewProps,
} from './types'
