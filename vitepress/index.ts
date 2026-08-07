// Browser / SSR barrel for the reusable VitePress docs theme — the
// `frappe-ui/vitepress` entry as seen by Vue code (theme, components,
// composables). It pulls in Vue SFCs, so it can only be evaluated by Vite,
// never by Node's config loader.
//
// The config builder (`defineDocsConfig`) lives in the sibling
// `index.node.ts`, exposed through the package's `node` export condition.
// Named exports only. Importing `theme` also loads the stylesheet as a side
// effect (via ./theme), so consumers don't need a separate style.css import.
//
// UNSTABLE (P14) — no backward-compatibility promise. This barrel's only
// consumer today is frappe-ui's own docs site, so it can change shape or
// disappear in any release, including a patch, with no deprecation window.
// Do not import this subpath from product apps or third-party code.
export { theme } from './theme'

// Shared components (Layout, CommandPalette, Search, Sidebar, …) plus the
// `isActiveLink` / `getSidebarList` helpers and Sidebar* types.
export * from './components'
export { state } from './state'
