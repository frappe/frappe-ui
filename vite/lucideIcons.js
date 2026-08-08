import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { getIcons, lucideIconsPlugin } from './lucideIconsPlugin.js'

// The resolver plus the unplugins, so `<LucideStar />` needs no import at all.
export function lucideIcons(options = {}) {
  const resolverObj = {
    resolvers: [
      IconsResolver({
        prefix: false,
        enabledCollections: ['lucide'],
      }),
    ],
  }
  const icons = getIcons()
  const componentOptions = options.componentGlobs
    ? {
        ...resolverObj,
        globs: options.componentGlobs,
      }
    : resolverObj

  return [
    AutoImport(resolverObj),
    Components(componentOptions),
    lucideIconsPlugin(icons),
  ]
}
