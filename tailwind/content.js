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

// Tailwind's scanner (fast-glob/micromatch) reads backslashes as escape
// characters, not path separators — path.join emits backslashes on Windows,
// which would silently break every glob below. Force forward slashes.
function glob(pattern) {
  return path.join(packageRoot, pattern).split(path.sep).join('/')
}

// Mirror this repo's own tailwind.config.js content globs (`./src/**`,
// `./frappe/**`, `./icons/**`) exactly, rather than curating subdirectories —
// two lists that are supposed to agree must not be able to drift apart. Broad
// `src/**` also covers files like src/utils/dialog.ts, which builds markup
// with `h('div', { class: '...' })` outside any component tree. `frappe/**`
// is the `frappe-ui/frappe` subpath (Link, ShareDialog, TrialBanner, …) and
// ships in `files`, so it needs the same coverage.
//
// `experimental/**` is deliberately excluded: frappe-ui/experimental carries
// no P14 promise and first-party consumers are told not to depend on it, so
// it isn't part of the supported public content contract this list covers.
/**
 * Source globs that emit Tailwind classes in frappe-ui. Spread into your
 * app's `tailwind.config.js` `content` array:
 *
 *   import { content } from 'frappe-ui/tailwind'
 *   export default { content: [...content, './src/**\/*.vue'] }
 */
export const content = [
  glob('src/**/*.{vue,js,ts,jsx,tsx}'),
  glob('frappe/**/*.{vue,js,ts,jsx,tsx}'),
  glob('icons/**/*.{vue,js,ts,jsx,tsx}'),
]
