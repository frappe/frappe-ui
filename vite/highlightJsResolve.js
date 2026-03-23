import path from 'path'
import { createRequire } from 'module'

// highlight.js is a CJS module used by lowlight (a frappe-ui dependency).
// With pnpm strict isolation, it may not be resolvable from the consumer's
// project root. We use resolveId to resolve it from frappe-ui's context,
// allowing Vite's dep optimizer to pre-bundle it (CJS → ESM conversion).
export function highlightJsResolve() {
  let highlightJsDir
  try {
    const require = createRequire(import.meta.url)
    highlightJsDir = path.dirname(require.resolve('highlight.js/package.json'))
  } catch {
    return null
  }

  return {
    name: 'frappeui-highlight-resolve',
    enforce: 'pre',
    resolveId(source) {
      if (source === 'highlight.js/lib/core') {
        return path.join(highlightJsDir, 'lib', 'core.js')
      }
    },
  }
}
