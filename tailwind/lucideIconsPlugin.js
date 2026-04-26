import path from 'node:path'
import { createRequire } from 'node:module'
import { iconPackPlugin } from './iconPackPlugin.js'

// Resolve lucide-static's icons directory once per plugin init. Works whether
// frappe-ui is consumed locally or installed as a dependency of another app.
const require = createRequire(import.meta.url)
const ICONS_DIR = path.join(
  path.dirname(require.resolve('lucide-static/package.json')),
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
