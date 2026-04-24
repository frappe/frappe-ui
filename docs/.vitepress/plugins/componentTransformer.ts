import type { MarkdownEnv, MarkdownRenderer } from 'vitepress'
import { dirname, resolve } from 'node:path'

function getPreviewParts(name: string) {
  const separatorIndex = name.indexOf('-')

  if (separatorIndex === -1) {
    return { componentName: name, storyFileName: name }
  }

  return {
    componentName: name.slice(0, separatorIndex),
    storyFileName: name.slice(separatorIndex + 1),
  }
}

function getStoryImportName(storyFileName: string) {
  const normalizedName = storyFileName.replace(/[^a-zA-Z0-9_$]+/g, ' ')
  const pascalName = normalizedName
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

  return /^[A-Za-z_$]/.test(pascalName) ? pascalName : `Story${pascalName}`
}

export default function (md: MarkdownRenderer) {
  md.core.ruler.after('inline', 'component-preview', (state) => {
    // Match `<ComponentPreview ... />` and capture the entire attribute
    // blob so callers can pass arbitrary props (layout, css, csr, future
    // additions) without needing this plugin to know about each one.
    const previewRegex = /<ComponentPreview\s+([^>]*?)\s*\/>/g

    function parseAttrs(raw: string): Record<string, string> {
      const attrRegex = /([a-zA-Z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g
      const out: Record<string, string> = {}
      let match: RegExpExecArray | null
      while ((match = attrRegex.exec(raw)) !== null) {
        out[match[1]] = match[2] ?? match[3] ?? ''
      }
      return out
    }

    state.src = state.src.replace(previewRegex, (_, attrBlob: string) => {
      const attrs = parseAttrs(attrBlob)
      const name = attrs.name
      if (!name) return _

      const csr = attrs.csr === 'true'

      const { componentName, storyFileName } = getPreviewParts(name)
      const storyImportName = getStoryImportName(storyFileName)

      const componentPath = `../../../../src/components/${componentName}/stories/${storyFileName}.vue`

      const scriptIdx = state.tokens.findIndex(
        (i) => i.type === 'html_block' && /<script setup>/.test(i.content),
      )

      const importStr = `import ${storyImportName} from '${componentPath}'`

      if (scriptIdx === -1) {
        const token = new state.Token('html_block', '', 0)
        token.content = `<script setup>\n${importStr}\n</script>\n`
        state.tokens.unshift(token)
      } else {
        state.tokens[scriptIdx].content = state.tokens[
          scriptIdx
        ].content.replace('</script>', `${importStr}\n</script>`)
      }

      const idx = state.tokens.findIndex((i) => i.content.match(previewRegex))
      const { realPath, path: _path } = state.env as MarkdownEnv

      const open = csr ? '<ClientOnly>' : ''
      // Forward every attribute except `csr`, which this plugin consumes
      // itself (it's not a Vue prop).
      const forwardedAttrs = Object.entries(attrs)
        .filter(([key]) => key !== 'csr')
        .map(([key, value]) => ` ${key}="${value}"`)
        .join('')
      state.tokens[idx].content =
        `${open}<ComponentPreview${forwardedAttrs}><${storyImportName} /><template #code>`

      const code = new state.Token('fence', 'code', 0)
      code.info = 'vue'
      code.content = `<<< ${componentPath}`
      // @ts-expect-error snippets plugin
      code.src = [resolve(dirname(realPath ?? _path), componentPath)]

      const close = new state.Token('html_inline', '', 0)
      close.content = `</template></ComponentPreview>${csr ? '</ClientOnly>' : ''}`

      state.tokens.splice(idx + 1, 0, code, close)
      return ''
    })

    // Handle PropsTable
    const propsRegex =
      /<PropsTable\s+name=["']([^"']+)["']\s+:data="([^"]+)"\/>/g

    state.src = state.src.replace(propsRegex, (match, name, dataExpression) => {
      const typesPath = `../../../../src/components/${name}/types.ts`
      const idx = state.tokens.findIndex((i) => i.content.includes(match))

      if (idx !== -1) {
        const { realPath, path: _path } = state.env as MarkdownEnv

        state.tokens[idx].content =
          `<PropsTable name="${name}" :data="${dataExpression}"><template #code>`

        const code = new state.Token('fence', 'code', 0)
        code.info = 'typescript'
        code.content = `<<< ${typesPath}`
        // @ts-expect-error snippets plugin
        code.src = [resolve(dirname(realPath ?? _path), typesPath)]

        const close = new state.Token('html_inline', '', 0)
        close.content = `</template></PropsTable>`

        state.tokens.splice(idx + 1, 0, code, close)
      }

      return ''
    })
  })
}
