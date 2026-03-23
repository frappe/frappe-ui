import path from 'path'
import fs from 'fs'
import { createRequire } from 'module'

const VIRTUAL_ID = '\0frappeui:highlight-core'

// highlight.js is a CJS module used by lowlight (a frappe-ui dependency).
// With pnpm strict isolation, it may not be resolvable from the consumer's
// project root. We resolve it from frappe-ui's context and wrap it as ESM
// so Vite can serve it to the browser without needing CJS interop.
export function highlightJsResolve() {
  let corePath
  try {
    const require = createRequire(import.meta.url)
    const highlightJsDir = path.dirname(
      require.resolve('highlight.js/package.json'),
    )
    corePath = path.join(highlightJsDir, 'lib', 'core.js')
  } catch {
    return null
  }

  return {
    name: 'frappeui-highlight-resolve',
    enforce: 'pre',
    resolveId(source) {
      if (source === 'highlight.js/lib/core') {
        return VIRTUAL_ID
      }
    },
    load(id) {
      if (id !== VIRTUAL_ID) return
      const cjs = fs.readFileSync(corePath, 'utf8')
      return `var module = { exports: {} };\nvar exports = module.exports;\n${cjs}\nexport default module.exports;\nexport var HighlightJS = module.exports;`
    },
  }
}
