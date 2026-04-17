import * as LucideIcons from 'lucide-static'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'

const VIRTUAL_PREFIX = '~icons/lucide/'
const RESOLVED_PREFIX = '\0~icons/lucide/'
const TEMPLATE_OPEN_RE = /<template\b[^>]*>/
const BUTTON_TAG_RE = /<Button(?=[\s>/])/g
const BUTTON_ICON_ATTR_RE =
  /(\s)(icon|iconLeft|iconRight|icon-left|icon-right)\s*=\s*(['"])([^'"`\s<>]+)\3/g
const STATIC_BUTTON_ICON_ATTR_RE =
  /\s(?:icon|iconLeft|iconRight|icon-left|icon-right)\s*=\s*(['"])[^'"]+\1/

export function lucideIcons() {
  const resolver = {
    resolvers: [
      IconsResolver({
        prefix: false,
        enabledCollections: ['lucide'],
      }),
    ],
  }

  const icons = getIcons()

  return [
    AutoImport(resolver),
    Components(resolver),
    buttonIconPropsPlugin(icons),
    lucideIconsPlugin(icons),
  ]
}

function buttonIconPropsPlugin(icons) {
  return {
    name: 'frappe-ui-button-lucide-icon-props',
    enforce: 'pre',
    transform(code, id) {
      const filepath = id.split('?')[0]
      if (!isVueFile(filepath) || !hasStaticButtonIconAttrs(code)) {
        return null
      }

      const transformedCode = transformButtonIconPropsSfc(code, icons)
      if (!transformedCode) return null

      return {
        code: transformedCode,
        map: null,
      }
    },
  }
}

function isVueFile(filepath) {
  return filepath.endsWith('.vue')
}

function hasStaticButtonIconAttrs(code) {
  return code.includes('<Button') && STATIC_BUTTON_ICON_ATTR_RE.test(code)
}

function transformButtonIconPropsSfc(code, icons) {
  const templateBlock = findTemplateBlock(code)
  if (!templateBlock) return null

  const template = code.slice(templateBlock.start, templateBlock.end)
  const transformedTemplate = transformButtonIconPropsTemplate(template, icons)
  if (!transformedTemplate) return null

  const nextCode =
    code.slice(0, templateBlock.start) +
    transformedTemplate.template +
    code.slice(templateBlock.end)

  return injectScriptSetupImports(
    nextCode,
    createIconImportStatements(transformedTemplate.imports),
  )
}

function createIconImportStatements(imports) {
  return Array.from(imports.entries()).map(
    ([iconName, bindingName]) =>
      `import ${bindingName} from '${VIRTUAL_PREFIX}${iconName}'`,
  )
}

function findTemplateBlock(code) {
  const openMatch = code.match(TEMPLATE_OPEN_RE)
  if (!openMatch || openMatch.index == null) return null

  const start = openMatch.index + openMatch[0].length
  const end = code.indexOf('</template>', start)
  if (end === -1) return null

  return { start, end }
}

function transformButtonIconPropsTemplate(template, icons) {
  let match
  let lastIndex = 0
  let changed = false
  let output = ''
  const imports = new Map()

  BUTTON_TAG_RE.lastIndex = 0

  while ((match = BUTTON_TAG_RE.exec(template))) {
    const tagStart = match.index
    const tagEnd = findTagEnd(template, tagStart)

    if (tagEnd === -1) {
      break
    }

    const tag = template.slice(tagStart, tagEnd + 1)
    const transformedTag = transformButtonTag(tag, icons, imports)

    output += template.slice(lastIndex, tagStart)
    output += transformedTag
    lastIndex = tagEnd + 1
    changed ||= transformedTag !== tag

    BUTTON_TAG_RE.lastIndex = tagEnd + 1
  }

  if (!changed) return null

  output += template.slice(lastIndex)

  return {
    template: output,
    imports,
  }
}

function findTagEnd(template, startIndex) {
  let quote = null

  for (let index = startIndex + 1; index < template.length; index++) {
    const char = template[index]

    if (quote) {
      if (char === quote && template[index - 1] !== '\\') {
        quote = null
      }
      continue
    }

    if (char === '"' || char === "'") {
      quote = char
      continue
    }

    if (char === '>') {
      return index
    }
  }

  return -1
}

function transformButtonTag(tag, icons, imports) {
  let changed = false

  const transformedTag = tag.replace(
    BUTTON_ICON_ATTR_RE,
    (full, leadingWhitespace, attrName, _quote, iconName) => {
      if (!icons[iconName]) {
        return full
      }

      changed = true

      let bindingName = imports.get(iconName)
      if (!bindingName) {
        bindingName = `__FrappeUiLucideIcon${imports.size}`
        imports.set(iconName, bindingName)
      }

      return `${leadingWhitespace}:${attrName}="${bindingName}"`
    },
  )

  return changed ? transformedTag : tag
}

function injectScriptSetupImports(code, importStatements) {
  if (!importStatements.length) return code

  const importBlock = `\n${importStatements.join('\n')}`
  const scriptSetupMatch = code.match(/<script\b(?=[^>]*\bsetup\b)[^>]*>/)

  if (scriptSetupMatch && scriptSetupMatch.index != null) {
    const insertAt = scriptSetupMatch.index + scriptSetupMatch[0].length
    return code.slice(0, insertAt) + importBlock + code.slice(insertAt)
  }

  const lang = getFirstScriptLang(code)
  const scriptSetupBlock = `\n<script setup${lang ? ` lang="${lang}"` : ''}>${importBlock}\n</script>\n`
  const templateEnd = code.indexOf('</template>')

  if (templateEnd !== -1) {
    const insertAt = templateEnd + '</template>'.length
    return code.slice(0, insertAt) + scriptSetupBlock + code.slice(insertAt)
  }

  return scriptSetupBlock + code
}

function getFirstScriptLang(code) {
  const scriptLangMatch = code.match(
    /<script\b[^>]*\blang=(['"])([^'"]+)\1[^>]*>/,
  )
  return scriptLangMatch?.[2] || ''
}

function lucideIconsPlugin(icons) {
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
  const innerHTML = innerMatch
    ? innerMatch[1].replace(/>\s+</g, '><').trim()
    : ''

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
  const icons = {}

  for (const icon in LucideIcons) {
    if (icon === 'default') {
      continue
    }

    let iconSvg = LucideIcons[icon]

    if (typeof iconSvg === 'string' && iconSvg.includes('stroke-width')) {
      iconSvg = iconSvg.replace(/stroke-width="2"/g, 'stroke-width="1.5"')
    }

    icons[icon] = iconSvg

    const dashKeys = camelToDash(icon)
    for (const dashKey of dashKeys) {
      if (dashKey !== icon) {
        icons[dashKey] = iconSvg
      }
    }
  }

  return icons
}

function camelToDash(key) {
  let withNumber = key.replace(
    /[A-Z0-9]/g,
    (match) => `-${match.toLowerCase()}`,
  )
  if (withNumber.startsWith('-')) {
    withNumber = withNumber.slice(1)
  }

  let withoutNumber = key.replace(
    /[A-Z]/g,
    (match) => `-${match.toLowerCase()}`,
  )
  if (withoutNumber.startsWith('-')) {
    withoutNumber = withoutNumber.slice(1)
  }

  if (withNumber !== withoutNumber) {
    return [withNumber, withoutNumber]
  }

  return [withNumber]
}
