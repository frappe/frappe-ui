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
    const previewRegex =
      /<ComponentPreview\s+name=["']([^"']+)["'](?:\s+csr=["'](true|false)["'])?(?:\s+css=["']([^"']+)["'])?\s*\/>/g

    state.src = state.src.replace(previewRegex, (_, name, csr, css) => {
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
      const cssAttr = css ? ` css="${css}"` : ''
      state.tokens[idx].content =
        `${open}<ComponentPreview name="${name}"${cssAttr}><${storyImportName} /><template #code>`

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
      /<PropsTable\s+name=["']([^"']+)["']\s+:data='([^']+)'\/>/g

    state.src = state.src.replace(propsRegex, (match, name, data) => {
      const typesPath = `../../../../src/components/${name}/types.ts`
      const idx = state.tokens.findIndex((i) => i.content.includes(match))

      if (idx !== -1) {
        const { realPath, path: _path } = state.env as MarkdownEnv

        state.tokens[idx].content =
          `<PropsTable name="${name}" :data='${data}'><template #code>`

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
