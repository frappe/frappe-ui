import type { Plugin } from 'vite'

/**
 * VitePress places shared deps into `framework` or `theme` via `manualChunks`.
 * When the graph is large (frappe-ui + vueuse + reka-ui), Rollup can put a
 * module that both chunks need into `theme` while `framework` still depends on
 * it — a cyclic ESM graph that throws at runtime:
 *
 *   ReferenceError: can't access lexical declaration '…' before initialization
 *     at framework.*.js
 *
 * Force the Vue ecosystem into `framework` first (before VitePress's own
 * manualChunks), and fail the build if a framework→theme edge still appears.
 */
const FRAMEWORK_PKG_RE =
  /[/\\]node_modules[/\\](?:vue|@vue[/\\]|vue-router|@vueuse[/\\])/

export default function preventCircularChunks(): Plugin {
  return {
    name: 'frappe-ui:prevent-circular-chunks',
    apply: 'build',
    // Runs after VitePress installs its manualChunks so we can wrap it.
    outputOptions(options) {
      const previous = options.manualChunks
      options.manualChunks = (id, meta) => {
        if (FRAMEWORK_PKG_RE.test(id)) {
          return 'framework'
        }
        if (typeof previous === 'function') {
          return previous(id, meta)
        }
        if (previous && typeof previous === 'object') {
          for (const [name, pattern] of Object.entries(previous)) {
            if (
              pattern instanceof RegExp
                ? pattern.test(id)
                : Array.isArray(pattern) && pattern.some((p) => id.includes(p))
            ) {
              return name
            }
          }
        }
        return undefined
      }
      return options
    },
    generateBundle(_options, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type !== 'chunk') continue
        if (!/[/\\]framework\.[^/\\]+\.js$/.test(fileName) && chunk.name !== 'framework') {
          continue
        }
        const bad = chunk.imports.filter(
          (imp) => /theme\.[^/]+\.js$/.test(imp) || imp.includes('/theme.'),
        )
        if (bad.length) {
          this.error(
            `Circular VitePress chunks: ${fileName} imports ${bad.join(', ')}. ` +
              'framework must not import theme (TDZ at runtime on ui.frappe.io).',
          )
        }
      }
    },
  }
}
