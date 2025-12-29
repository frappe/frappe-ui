import type { MarkdownEnv, MarkdownRenderer } from 'vitepress'
import { dirname, resolve } from 'node:path'

export default function (md: MarkdownRenderer) {
  md.core.ruler.after('inline', 'component-preview', (state) => {
    const regex =
      /<ComponentPreview\s+name=["']([^"']+)["'](?:\s+title=["']([^"']*)["'])?(?:\s+description=["']([^"']*)["'])?(?:\s+csr=["'](true|false)["'])?\s*\/>/g

    state.src = state.src.replace(regex, (_, name, title, description, csr) => {
			const componentPath = `../../../src/components/${name}/${name}.story.vue`
      const scriptIdx = state.tokens.findIndex(
        (i) => i.type === 'html_block' && /<script setup>/.test(i.content),
      )
      const importStr = `import Preview from '${componentPath}'`

      if (scriptIdx === -1) {
        const token = new state.Token('html_block', '', 0)
        token.content = `<script setup>\n${importStr}\n</script>\n`
        state.tokens.unshift(token)
      } else {
        state.tokens[scriptIdx].content = state.tokens[
          scriptIdx
        ].content.replace('</script>', `${importStr}\n</script>`)
      }

      const idx = state.tokens.findIndex((i) => i.content.match(regex))
      const { realPath, path: _path } = state.env as MarkdownEnv
      const props = [
        name && `name="${name}"`,
        title && `title="${title}"`,
        description && `description="${description}"`,
      ]
        .filter(Boolean)
        .join(' ')

      const open = csr ? '<ClientOnly>' : ''
      state.tokens[idx].content =
        `${open}<ComponentPreview ${props}><Preview /><template #code>`

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
  })
}
