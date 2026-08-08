import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Tailwind v3 does not merge `content` from a preset (see preset.js) — every
// consuming app must list frappe-ui's source globs in its own `content`.
// Resolve them relative to this file so they work whether frappe-ui sits in
// node_modules, a monorepo symlink, or a local workspace checkout.
const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)

function glob(pattern) {
  return path.join(packageRoot, pattern)
}

/**
 * Source globs that emit Tailwind classes in frappe-ui. Spread into your
 * app's `tailwind.config.js` `content` array:
 *
 *   import { content } from 'frappe-ui/tailwind'
 *   export default { content: [...content, './src/**\/*.vue'] }
 */
export const content = [
  glob('src/components/**/*.{vue,js,ts,jsx,tsx}'),
  glob('src/molecules/**/*.{vue,js,ts,jsx,tsx}'),
  glob('src/composables/**/*.{vue,js,ts,jsx,tsx}'),
  glob('icons/**/*.{vue,js,ts,jsx,tsx}'),
]
