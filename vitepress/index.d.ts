// Combined type surface for `frappe-ui/vitepress`.
//
// At runtime the package resolves to two different files by export condition:
// `index.node.ts` (the Node config builder) for VitePress' config loader, and
// `index.ts` (the browser barrel: theme + components) for Vue code. TypeScript,
// however, doesn't apply the `node` condition — it would otherwise only ever
// see the browser half and flag `defineDocsConfig` as missing in config files.
//
// This declaration (wired as the `types` condition) merges both surfaces so
// editors resolve the full API regardless of context. The node-only names are
// disjoint from the browser names, so there are no `export *` collisions.
//
// UNSTABLE (P14) — no backward-compatibility promise. This is the surface
// TypeScript actually resolves for `frappe-ui/vitepress`; its only consumer
// today is frappe-ui's own docs site, so it can change shape or disappear in
// any release, including a patch, with no deprecation window. Do not import
// this subpath from product apps or third-party code.
export * from './index'
export {
  defineDocsConfig,
  syncColocatedComponentDocs,
  colocatedComponentDocs,
  componentTransformer,
  createComponentTransformer,
} from './index.node'
export type {
  DefineDocsConfigOptions,
  DocsThemeConfig,
} from './index.node'
