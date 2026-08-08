/**
 * Runtime access to the whole Lucide set, for the one case the `lucide-*`
 * Tailwind class form cannot serve: an icon picked at runtime.
 *
 * Tailwind only emits CSS for class names it can read as literal strings in
 * your source. A picker builds its grid from data, so `lucide-${name}` never
 * produces a rule — see `docs/content/docs/other/icons.md`. The picker has to
 * render real SVG markup instead.
 *
 * The set loads through a dynamic `import()`, so bundlers give it its own
 * chunk and an app downloads it the first time a picker needs it. The old
 * `spritePlugin` paid the same cost at startup, in every app, whether or not
 * a picker was ever shown.
 */

export type LucideIconSet = {
  /** Every icon name, kebab-case and sorted. No `lucide-` prefix. */
  names: string[]
  /** Icon name to its `<svg>…</svg>` markup, at the design system's stroke width. */
  markup: Record<string, string>
}

let pending: Promise<LucideIconSet> | null = null

/** Load the Lucide set. The first call fetches it; later calls reuse it. */
export function loadLucideIconSet(): Promise<LucideIconSet> {
  if (!pending) {
    pending = import('lucide-static').then(buildIconSet)
  }
  return pending
}

// Takes the raw module namespace: every icon is a named string export, and
// the CommonJS build adds a `default` object on top, which the type guard
// below drops.
function buildIconSet(icons: Record<string, unknown>): LucideIconSet {
  const markup: Record<string, string> = {}

  for (const value of Object.values(icons)) {
    if (typeof value !== 'string') continue
    // Every export is a full `<svg>` whose class attribute carries the
    // kebab-case name (`lucide lucide-house`). Read the name from there
    // rather than converting the PascalCase export name back — several
    // exports can alias one icon (`Home` and `House` are both `house`).
    const name = value.match(/lucide lucide-([\w-]+)/)?.[1]
    if (!name || markup[name]) continue
    // Lucide draws at stroke-width 2. The rest of the design system uses 1.5.
    markup[name] = value.replace(/stroke-width="[^"]+"/g, 'stroke-width="1.5"')
  }

  return { names: Object.keys(markup).sort(), markup }
}
