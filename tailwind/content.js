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
// supposed to agree must not be able to drift apart. Broad `src/**` also
// covers files like src/utils/dialog.ts, which builds markup with
// `h('div', { class: '...' })` outside any component tree.
//
// `experimental/**` is not globbed whole. One rule decides what is listed:
// every directory `experimental.ts` re-exports is covered, because importing
// anything from `frappe-ui/experimental` pulls that directory's classes into
// the app build, and an app that scans only this list would render it
// unstyled. `content.test.js` derives the expected set from that barrel and
// fails when the two drift. Directories under `experimental/` that the barrel
// does not re-export stay out: nothing a consumer can import reaches them.
//
// `vitepress/**` (the shared docs theme) is listed for the same reason on its
// own subpath: every class it renders, including its `lucide-*` icons, comes
// from this package, and a docs site on `frappe-ui/vitepress` has no other way
// to emit them.
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
  // Every directory `experimental.ts` re-exports, in the barrel's own order.
  glob('experimental/Accordion/**/*.{vue,js,ts,jsx,tsx}'),
  glob('experimental/FloatingWindow/**/*.{vue,js,ts,jsx,tsx}'),
  glob('experimental/MultiEmailInput/**/*.{vue,js,ts,jsx,tsx}'),
  glob('experimental/Calendar/**/*.{vue,js,ts,jsx,tsx}'),
  glob('experimental/Charts/**/*.{vue,js,ts,jsx,tsx}'),
  glob('experimental/CommandPalette/**/*.{vue,js,ts,jsx,tsx}'),
  glob('experimental/ListView/**/*.{vue,js,ts,jsx,tsx}'),
  glob('experimental/TextEditor/**/*.{vue,js,ts,jsx,tsx}'),
  glob('experimental/ThemeSwitcher/**/*.{vue,js,ts,jsx,tsx}'),
  glob('experimental/SpriteIcons/**/*.{vue,js,ts,jsx,tsx}'),
  glob('vitepress/**/*.{vue,js,ts}'),
  '!' + glob('**/stories/**'),
]
