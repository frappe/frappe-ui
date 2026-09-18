import path from 'node:path'
import { createRequire } from 'node:module'
import { iconPackPlugin } from './iconPackPlugin.js'

// Resolve lucide-static's icons directory once per plugin init. Works whether
// frappe-ui is consumed locally or installed as a dependency of another app.
//
// Named `nodeRequire`, not `require`. A loader that transpiles this module to
// CJS with sucrase puts it in a wrapper that already declares a `require`
// parameter, so a top-level `const require` throws `SyntaxError: Identifier
// 'require' has already been declared`. tailwindcss 3.4.0 and 3.4.1 load the
// config that way. Babel renames the binding instead, which is why tailwindcss
// 3.4.2 and later are unaffected: they route any source with `import.meta`
// through jiti's babel transform.
const nodeRequire = createRequire(import.meta.url)
const ICONS_DIR = path.join(
  path.dirname(nodeRequire.resolve('lucide-static/package.json')),
  'icons',
)

// Lucide ships every icon at stroke-width="2". Override to 1.5 for a lighter,
// more balanced look that matches the rest of the design system.
//
// No `defaultColor` — icons inherit the parent's text color the same way an
// inline <svg stroke="currentColor"> would. Add `text-ink-*` at the call
// site when a specific tint is needed.
export default iconPackPlugin({
  prefix: 'lucide',
  iconsDir: ICONS_DIR,
  normalizeStrokeWidth: 1.5,
})
