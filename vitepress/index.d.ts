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
