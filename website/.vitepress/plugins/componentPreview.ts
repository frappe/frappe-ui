import type { MarkdownEnv, MarkdownRenderer } from 'vitepress'
import { dirname, resolve } from 'node:path'
import { readFileSync } from 'node:fs'

export default function (md: MarkdownRenderer) {
  md.core.ruler.after('inline', 'component-preview', (state) => {
    const insertComponentImport = (importString: string) => {
      const index = state.tokens.findIndex(
        (i) => i.type === 'html_block' && i.content.match(/<script setup>/g),
      )
      if (index === -1) {
        const importComponent = new state.Token('html_block', '', 0)
        importComponent.content = `<script setup>\n${importString}\n</script>\n`
        state.tokens.splice(0, 0, importComponent)
      } else {
        const content = state.tokens[index].content
        state.tokens[index].content = content.replace(
          '</script>',
          `${importString}\n</script>`,
        )
      }
    }
    const regex =
      /<ComponentPreview\s+name=["']([^"']+)["'](?:\s+title=["']([^"']*)["'])?(?:\s+description=["']([^"']*)["'])?(?:\s+csr=["'](true|false)["'])?\s*\/>/g

    state.src = state.src.replace(regex, (fullMatch, name, title, _, csr) => {
      const importStr = `import ${name} from '@/components/${name}/${name}.story.vue'`
      insertComponentImport(importStr)

      const index = state.tokens.findIndex((i) => i.content.match(regex))
      const { realPath, path: _path } = state.env as MarkdownEnv

      const componentPath = `../../src/components/${name}/${name}.story.vue`
      const resolvedPath = resolve(dirname(realPath ?? _path), componentPath)

      const fileContent = readFileSync(resolvedPath, 'utf-8')
      const highlighted =
        md.options.highlight?.(fileContent, 'vue', '') || fileContent
      const encodedCode = encodeURIComponent(fileContent)
      const encodedHighlighted = encodeURIComponent(highlighted)

      const componentProps = [
        `code="${encodedCode}"`,
        `hlcode="${encodedHighlighted}"`,
        title ? `title="${title}"` : ''
        // description ? `description="${description}"` : '',
      ]
        .filter(Boolean)
        .join(' ')

      const componentTag = `<ComponentPreview ${componentProps}><${name} /></ComponentPreview>`

      state.tokens[index].content =
        csr === 'true'
          ? `<ClientOnly>${componentTag}</ClientOnly>`
          : componentTag

      return ''
    })
  })
}
