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

// Mirror this repo's own tailwind.config.js content globs for the supported
// surfaces (`./src/**`, `./icons/**`) — for those, two lists that are
// supposed to agree must not be able to drift apart. The repo config
// also globs all of `./experimental/**`; this list does not (see below). Broad
// `src/**` also covers files like src/utils/dialog.ts, which builds markup
// with `h('div', { class: '...' })` outside any component tree.
//
// `experimental/**` is deliberately excluded: frappe-ui/experimental carries
// no P14 promise and first-party consumers are told not to depend on it, so
// it isn't part of the supported public content contract this list covers.
// The explicit exceptions are migration parking spots for previously
// supported surfaces, covered until they are removed:
// - `experimental/SpriteIcons` (moved out of `frappe-ui/icons` in #904;
//   IconPicker emits classes)
// - `experimental/TextEditor` (the v0 editor family, a supported root
//   surface until #974, parked in #1007 while apps migrate to
//   `frappe-ui/editor`)
// - `experimental/Calendar` (a supported root surface until #1020, parked
//   with its API unchanged until a redesigned calendar family replaces it)
// - `experimental/Charts` (the v1 chart family, a supported root surface
//   until #942, parked while apps migrate to `frappe-ui/charts`)
// - `experimental/CommandPalette` (a supported root surface until its removal
//   in `1.0.0`; the seven-part family here is where its consumers port to)
/**
 * Source globs that emit Tailwind classes in frappe-ui. Spread into your
 * app's `tailwind.config.js` `content` array:
 *
 *   import { content } from 'frappe-ui/tailwind'
 *   export default { content: [...content, './src/**\/*.vue'] }
 */
export const content = [
  glob('src/**/*.{vue,js,ts,jsx,tsx}'),
  glob('icons/**/*.{vue,js,ts,jsx,tsx}'),
  glob('experimental/SpriteIcons/**/*.{vue,js,ts,jsx,tsx}'),
  glob('experimental/TextEditor/**/*.{vue,js,ts,jsx,tsx}'),
  glob('experimental/Calendar/**/*.{vue,js,ts,jsx,tsx}'),
  glob('experimental/Charts/**/*.{vue,js,ts,jsx,tsx}'),
  glob('experimental/CommandPalette/**/*.{vue,js,ts,jsx,tsx}'),
]
