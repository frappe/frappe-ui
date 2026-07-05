// Recipe demo slugs in display order — the single source of truth for which
// demo routes exist. Each slug is `<base>-<platform>` (e.g. `discussions-mobile`),
// one per platform variant of a recipe group.
//
// Deliberately free of any component (`.vue`) imports so build-time consumers
// can read it: the demo route's paths loader (demo/[slug].paths.js) is bundled
// by esbuild, which has no Vue loader, so it can import this but not the full
// registry in ./index.ts. Keep this in sync with `recipeGroups` there — the
// guard in ./index.ts throws if they drift.
export const recipeSlugs = [
  'discussions-desktop',
  'discussions-mobile',
  'compose-desktop',
  'compose-mobile',
  'deals-desktop',
  'deals-mobile',
  'tickets-desktop',
  'tickets-mobile',
  'mail-desktop',
  'mail-mobile',
  'files-desktop',
  'files-mobile',
  'tasks-desktop',
  'tasks-mobile',
  'accounting-desktop',
  'accounting-mobile',
] as const
