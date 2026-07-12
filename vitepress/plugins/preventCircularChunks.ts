import type { Plugin } from 'vite'

/**
 * Keep Vue ecosystem packages in VitePress's `framework` chunk.
 *
 * Why: reka-ui ≥2.9 depends on @vueuse 14, same major as VitePress. VitePress
 * `manualChunks` only pins `@vue/{runtime,shared,reactivity}` into `framework`
 * and dumps anything statically imported by the theme entry into `theme`. Shared
 * @vueuse modules can land in `theme` while `framework` still needs them →
 * framework→theme cycle → TDZ at runtime (`can't access lexical declaration
 * before initialization` on ui.frappe.io after the reka-ui 2.9.9 bump).
 *
 * VitePress overwrites user `manualChunks`, so we wrap its function in
 * `outputOptions` and run first. `generateBundle` fails the build if a cycle
 * still appears.
 */
const FRAMEWORK_PKG_RE =
  /[/\\]node_modules[/\\](?:vue|@vue[/\\]|vue-router|@vueuse[/\\])/

export default function preventCircularChunks(): Plugin {
  return {
    name: 'frappe-ui:prevent-circular-chunks',
    apply: 'build',
    outputOptions(options) {
      const previous = options.manualChunks
      options.manualChunks = (id, meta) => {
        if (FRAMEWORK_PKG_RE.test(id)) return 'framework'
        if (typeof previous === 'function') return previous(id, meta)
        return undefined
      }
      return options
    },
    generateBundle(_options, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type !== 'chunk') continue
        if (
          chunk.name !== 'framework' &&
          !/[/\\]framework\.[^/\\]+\.js$/.test(fileName)
        ) {
          continue
        }
        const bad = chunk.imports.filter(
          (imp) => /theme\.[^/]+\.js$/.test(imp) || imp.includes('/theme.'),
        )
        if (bad.length) {
          this.error(
            `Circular VitePress chunks: ${fileName} imports ${bad.join(', ')}. ` +
              'framework must not import theme (TDZ on load).',
          )
        }
      }
    },
  }
}
