// Props/emits for the CodeEditor writer primitive. Kept here so the field
// wrapper and stories can share the same contract without importing the .vue.

import type { InputLabelingProps } from '../../composables/useInputLabeling'
import type { InputSize } from '../../composables/inputTypes'

/** A language key understood by `loadLanguage`. */
export type CodeLanguage =
  | 'json'
  | 'html'
  | 'javascript'
  | 'python'
  | 'sql'
  | 'markdown'
  | 'css'
  | 'scss'
  | 'yaml'
  | 'xml'
  | 'plain'

/**
 * Visual style variant, mirroring frappe-ui's input convention
 * (`InputVariant`): `subtle` is the filled default that sits flush with the
 * TextInput/Textarea fields around it, `outline` is a bordered-on-white box,
 * `ghost` is borderless.
 */
export type CodeEditorVariant = 'subtle' | 'outline' | 'ghost'

export interface CodeEditorProps extends InputLabelingProps {
  /** The editor's text content (controlled, two-way via `v-model`). */
  modelValue: string
  /** CodeMirror language key; falls through to plain text when unset/unknown. */
  language?: string
  /** If true, the content is read-only and not editable. */
  readonly?: boolean
  /** Placeholder shown when the editor is empty. */
  placeholder?: string
  /** Surface style; mirrors frappe-ui inputs. Defaults to `subtle`. */
  variant?: CodeEditorVariant
  /**
   * Size token, mirroring frappe-ui inputs. Scales the editor's font size and
   * minimum height (`sm | md | lg | xl`). Defaults to `md`.
   */
  size?: InputSize
  /**
   * CSS length capping the editor's scroll height (e.g. `"13.5rem"`). When the
   * content exceeds it the editor scrolls internally; unset means it grows to
   * fit. Pairs with the `overflow` emit so a wrapper can offer expand/collapse.
   */
  maxHeight?: string
}

export type CodeEditorEmits = {
  /** Live document text on every change — mirrors the textarea field contract. */
  'update:modelValue': [value: string]
  /** Commit (blur). The field wrapper normalizes (e.g. JSON pretty-print) here. */
  change: [value: string]
  /** Whether the content currently exceeds `maxHeight` (only changes are emitted). */
  overflow: [overflowing: boolean]
}

export interface CodePreviewProps {
  /** The source text to render as sanitized preview output. */
  modelValue: string
  /** Only `markdown` / `html` render a preview; anything else renders nothing. */
  language?: string
}
