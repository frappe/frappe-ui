// Hand-written types for `frappe-ui/vite`. The plugin itself ships as plain
// JS (see index.js and the sibling sub-plugin files) — this file is wired as
// the `types` condition in package.json so consumers get a typed
// `vite.config.ts` without a `// @ts-expect-error` workaround.
//
// Shapes below are derived from each sub-plugin's own options handling, not
// from the README — check the corresponding `.js` file before changing one.
import type { Plugin, PluginOption } from 'vite'

/** Options for the `frappeProxy` sub-plugin (dev-server → Frappe backend proxy). */
export interface FrappeProxyOptions {
  /**
   * Vite dev server port.
   * @default Auto-calculated from the Frappe webserver port (itself read from
   * `FRAPPE_WEB_SERVER_PORT` or `common_site_config.json`, falling back to `8000`).
   */
  port?: number
  /**
   * Regex (as a string) matching request paths to proxy to the Frappe backend.
   * @default '^/(desk|app|login|api|assets|files|private)'
   */
  source?: string
}

/** Options for the `lucideIcons` sub-plugin (auto-import + `~icons/lucide/*`). */
export interface LucideIconsOptions {
  /**
   * Glob patterns forwarded to `unplugin-vue-components`'s `globs` option,
   * scoping which files are scanned for auto-importable `<LucideName />` tags.
   */
  componentGlobs?: string[]
}

/**
 * Options for the `barrelImports` sub-plugin. Dev-only by default: rewrites
 * `import { X } from 'frappe-ui'` into a deep import of the module that
 * declares `X`, so Vite's dev server never has to serve — and crawl — the
 * whole barrel (echarts, TipTap, CodeMirror included) for one component.
 */
export interface BarrelImportsOptions {
  /**
   * Bare specifiers to rewrite. Each must resolve to a pure re-export barrel.
   * @default ['frappe-ui']
   */
  packages?: string[]
  /** Extensions whose source may contain rewritable imports. */
  include?: RegExp
  /**
   * Files to skip. Installed dependencies are excluded by default, but not
   * the target packages' own sources — those are the bulk of the rewrite
   * when one is symlinked into `node_modules`.
   */
  exclude?: RegExp
  /**
   * Only rewrite when a target package resolves to a working copy (the
   * library's own source, or a directory symlinked into `node_modules`)
   * rather than an installed dependency — rewriting an installed package is
   * a net loss, since Vite already pre-bundles it as one optimized chunk.
   * @default true
   */
  linkedOnly?: boolean
  /**
   * Vite's `apply`. The rewrite is dev-only by default: a production build
   * resolves and tree-shakes the barrel anyway, and the rewrite would bake
   * absolute filesystem paths into the graph, changing chunking and
   * bypassing `rollupOptions.external`. Pass `'build'` or `null` to override.
   * @default 'serve'
   */
  apply?: Plugin['apply'] | null
}

/**
 * Options for the `frappeTypes` sub-plugin — generates TypeScript interfaces
 * from Frappe DocType JSON files, regenerating only when the source DocType
 * changes.
 */
export interface FrappeTypesOptions {
  /** Map of app name to the doctype names to generate interfaces for. */
  input: Record<string, string[]>
  /**
   * Output file for the generated interfaces.
   * @default 'src/types/doctypes.ts'
   */
  output?: string
}

/**
 * Options for the `buildConfig` sub-plugin — production build output paths
 * for Frappe's directory structure.
 */
export interface BuildConfigOptions {
  /**
   * Build output directory.
   * @default Auto-detected as `../<app_name>/public/frontend`.
   */
  outDir?: string
  /**
   * Base URL for built assets, applied in production builds only.
   * @default Auto-detected from `outDir` as `/assets/<app_name>/<subdir>/`.
   */
  baseUrl?: string
  /**
   * Where the built `index.html` is copied to. Required in production builds
   * — inferred from the top-level `frontendRoute` option when omitted.
   */
  indexHtmlPath?: string | null
  /**
   * Clear the output directory before building.
   * @default true
   */
  emptyOutDir?: boolean
  /**
   * Generate source maps. Sourcemaps are the single largest build cost:
   * generating them makes builds 18-25% slower and uses 7-31% more memory.
   * @default false
   */
  sourcemap?: boolean
}

/**
 * The `jinjaBootData` sub-plugin currently accepts no options — passing an
 * object only toggles the plugin on, the same as passing `true`.
 */
export type JinjaBootDataOptions = Record<string, never>

export interface FrappeuiPluginOptions {
  /**
   * The route your app is served on (e.g. `/g`). Shared across sub-plugins:
   * drives the dev-server site banner and the auto-inferred
   * `buildConfig.indexHtmlPath`.
   */
  frontendRoute?: string
  /**
   * Lucide icon auto-import support, plus explicit `~icons/lucide/*` imports.
   * @default true
   */
  lucideIcons?: boolean | LucideIconsOptions
  /**
   * Rewrites `from 'frappe-ui'` into deep imports in dev, so a single
   * component doesn't drag the whole barrel into the dev module graph.
   * @default true
   */
  barrelImports?: boolean | BarrelImportsOptions
  /**
   * Dev-server proxy to a Frappe backend.
   * @default true
   */
  frappeProxy?: boolean | FrappeProxyOptions
  /**
   * Injects a Jinja block that reads `boot` context keys onto `window` in
   * production builds.
   * @default true
   */
  jinjaBootData?: boolean | JinjaBootDataOptions
  /**
   * Production build output paths for Frappe's directory structure.
   * @default true
   */
  buildConfig?: boolean | BuildConfigOptions
  /**
   * Generates TypeScript interfaces from Frappe DocType JSON files. Off by
   * default. Unlike the other sub-plugins, `true` is not accepted here: the
   * plugin needs an `input` map to do anything, and passing `true` alone
   * silently bails at runtime ("No type generation input specified"). Pass
   * an options object to enable it, or `false` (the default) to leave it off.
   * @default false
   */
  frappeTypes?: FrappeTypesOptions | false
}

/**
 * Frappe UI's Vite plugin. Bundles dev-server proxying, Lucide icon
 * auto-imports, barrel-import rewriting, TypeScript type generation, boot
 * data injection, and production build configuration.
 *
 * Every sub-plugin except `frappeTypes` is enabled by default — pass `false`
 * to disable one, or an options object to override its defaults.
 */
declare function frappeuiPlugin(options?: FrappeuiPluginOptions): PluginOption[]
export default frappeuiPlugin

/** The `lucideIcons` sub-plugin, importable standalone instead of via `frappeuiPlugin`'s `lucideIcons` option. */
export declare function lucideIcons(
  options?: LucideIconsOptions,
): PluginOption[]

/** The `barrelImports` sub-plugin, importable standalone instead of via `frappeuiPlugin`'s `barrelImports` option. */
export declare function barrelImports(options?: BarrelImportsOptions): Plugin
