// Code editor styles ship with the package: importing from
// `frappe-ui/code-editor` pulls in the frappe chrome rules so the family is
// self-contained. The rules are scoped under the class `codeChrome` adds, so
// loading this stylesheet still styles nothing until that extension is in the
// extension array.
import './style.css'

// Engine
export { useCodeEditor, type CodeEditorOptions } from './useCodeEditor'

// The component, and the one part. There are no menu parts: CodeMirror renders
// its own gutters, panels, tooltips and completion popups inside `view.dom`.
export { default as CodeEditor } from './CodeEditor.vue'
export { default as CodeEditorContent } from './CodeEditorContent.vue'

// Kit — one configurable extension bundle
export { CodeKit, type CodeKitOptions, type CodeKitExtension } from './kit'

// Individual extensions (each also a CodeKit member). No placeholder wrapper:
// `@codemirror/view` already exports `placeholder()`, so one would add a name
// frappe-ui owns until 2.0.0 and nothing else.
//
// The list is written out rather than re-exported with `export *`: a wildcard
// from an implementation module publishes whatever that file exports next
// (PHILOSOPHY.md, P15).
export { codeChrome, codeHighlight, codeKeymap } from './extensions'

// Languages
export { loadLanguage, type LanguageKey } from './languages'

// Types
export type { CodeEditorExposed } from './types'
