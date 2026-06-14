// Lazy language loading for CodeEditor.
//
// `loadLanguage` dynamically imports the matching `@codemirror/lang-*` package
// so each language tree-shakes into its own async chunk (apps that never render
// a code field pay nothing).
//
// Mapping a Frappe FormLayout fieldtype to a language key (`fieldtypeToLanguage`)
// is FormLayout-specific glue and lives in `@framework/ui` alongside the field
// wrapper, not here — this primitive stays framework-agnostic.

import type { Extension } from '@codemirror/state'

/**
 * Dynamically import the CodeMirror language extension for `key`.
 * Returns `null` for plain text / unknown keys (no highlighting).
 */
export async function loadLanguage(key?: string): Promise<Extension | null> {
  switch (key) {
    case 'json': {
      const { json } = await import('@codemirror/lang-json')
      return json()
    }
    case 'html': {
      const { html } = await import('@codemirror/lang-html')
      return html()
    }
    case 'javascript': {
      const { javascript } = await import('@codemirror/lang-javascript')
      return javascript()
    }
    case 'python': {
      const { python } = await import('@codemirror/lang-python')
      return python()
    }
    case 'sql': {
      const { sql } = await import('@codemirror/lang-sql')
      return sql()
    }
    case 'markdown': {
      const { markdown } = await import('@codemirror/lang-markdown')
      return markdown()
    }
    case 'css': {
      const { css } = await import('@codemirror/lang-css')
      return css()
    }
    case 'scss': {
      // `lang-sass` covers both — `indented: false` selects SCSS (brace) syntax.
      const { sass } = await import('@codemirror/lang-sass')
      return sass({ indented: false })
    }
    case 'yaml': {
      const { yaml } = await import('@codemirror/lang-yaml')
      return yaml()
    }
    case 'xml': {
      const { xml } = await import('@codemirror/lang-xml')
      return xml()
    }
    default:
      return null
  }
}
