import * as LucideIcons from 'lucide-static'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'

const VIRTUAL_PREFIX = '~icons/lucide/'
const RESOLVED_PREFIX = '\0~icons/lucide/'

export function lucideIcons() {
  const resolverObj = {
    resolvers: [
      IconsResolver({
        prefix: false,
        enabledCollections: ['lucide'],
      }),
    ],
  }
  const icons = getIcons()
  return [
    AutoImport(resolverObj),
    Components(resolverObj),
    LucideIconsPlugin(icons),
  ]
}

function LucideIconsPlugin(icons) {
  return {
    name: 'frappe-ui-lucide-icons',
    resolveId(id) {
      if (id.startsWith(VIRTUAL_PREFIX)) {
        return RESOLVED_PREFIX + id.slice(VIRTUAL_PREFIX.length)
      }
    },
    load(id) {
      if (!id.startsWith(RESOLVED_PREFIX)) return
      const iconName = id.slice(RESOLVED_PREFIX.length)
      return generateIconModule(icons, iconName)
    },
  }
}

function generateIconModule(icons, iconName) {
  const svg = icons[iconName]
  if (!svg) return null

  const innerMatch = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/)
  const innerHTML = innerMatch ? innerMatch[1].replace(/>\s+</g, '><').trim() : ''

  return `
import { h } from 'vue'
export default {
  inheritAttrs: false,
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: '24',
      height: '24',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      ...this.$attrs,
      innerHTML: ${JSON.stringify(innerHTML)},
    })
  }
}
`
}

function getIcons() {
  let icons = {}
  for (const icon in LucideIcons) {
    if (icon === 'default') {
      continue
    }
    let iconSvg = LucideIcons[icon]

    // set stroke-width to 1.5
    if (typeof iconSvg === 'string' && iconSvg.includes('stroke-width')) {
      iconSvg = iconSvg.replace(/stroke-width="2"/g, 'stroke-width="1.5"')
    }
    icons[icon] = iconSvg

    let dashKeys = camelToDash(icon)
    for (let dashKey of dashKeys) {
      if (dashKey !== icon) {
        icons[dashKey] = iconSvg
      }
    }
  }
  return icons
}

function camelToDash(key) {
  // barChart2 -> bar-chart-2
  let withNumber = key.replace(/[A-Z0-9]/g, (m) => '-' + m.toLowerCase())
  if (withNumber.startsWith('-')) {
    withNumber = withNumber.substring(1)
  }
  // barChart2 -> bar-chart2
  let withoutNumber = key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())
  if (withoutNumber.startsWith('-')) {
    withoutNumber = withoutNumber.substring(1)
  }

  if (withNumber !== withoutNumber) {
    // both are required because unplugin icon resolver doesn't put a dash before numbers
    return [withNumber, withoutNumber]
  }
  return [withNumber]
}
