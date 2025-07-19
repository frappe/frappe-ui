import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'

export function lucideIcons() {
  const resolverObj = {
    resolvers: [
      IconsResolver({
        prefix: false,
        enabledCollections: ['lucide'],
      }),
    ],
  }
  return [
    AutoImport(resolverObj),
    Components(resolverObj),
    Icons({
      iconCustomizer: (collection, icon, props) => {
        if (collection === 'lucide') {
          props['data-lucide'] = icon
        }
      },
    }),
  ]
}
