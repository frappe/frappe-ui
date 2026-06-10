import type { MarkdownEnv, MarkdownRenderer } from 'vitepress'
import type StateCore from 'markdown-it/lib/rules_core/state_core'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

import {
  baseParse,
  NodeTypes,
  type AttributeNode,
  type DirectiveNode,
  type ElementNode,
  type SimpleExpressionNode,
  type TextNode,
} from '@vue/compiler-dom'

interface ParsedTag {
  /** Static attributes: `foo="bar"` */
  attrs: Record<string, string>
  /** Bound attributes: `:foo="expr"` — value is the expression text */
  binds: Record<string, string>
}

function parseSingleTag(source: string, tagName: string): ParsedTag | null {
  let ast
  try {
    ast = baseParse(source)
  } catch {
    return null
  }
  for (const child of ast.children) {
    if (child.type !== NodeTypes.ELEMENT) continue
    const element = child as ElementNode
    if (element.tag !== tagName) continue

    const attrs: Record<string, string> = {}
    const binds: Record<string, string> = {}
    for (const prop of element.props) {
      if (prop.type === NodeTypes.ATTRIBUTE) {
        const attr = prop as AttributeNode
        attrs[attr.name] = (attr.value as TextNode | undefined)?.content ?? ''
      } else if (prop.type === NodeTypes.DIRECTIVE) {
        const dir = prop as DirectiveNode
        if (
          dir.name === 'bind' &&
          dir.arg?.type === NodeTypes.SIMPLE_EXPRESSION
        ) {
          const argName = (dir.arg as SimpleExpressionNode).content
          const expr = (dir.exp as SimpleExpressionNode | undefined)?.content
          binds[argName] = expr ?? ''
        }
      }
    }
    return { attrs, binds }
  }
  return null
}

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
  const normalized = storyFileName.replace(/[^a-zA-Z0-9_$]+/g, ' ')
  const pascal = normalized
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
  return /^[A-Za-z_$]/.test(pascal) ? pascal : `Story${pascal}`
}

function applyImports(state: StateCore, imports: string[]) {
  if (imports.length === 0) return
  const combined = imports.join('\n')
  const scriptIdx = state.tokens.findIndex(
    (t) => t.type === 'html_block' && /<script\s+setup>/.test(t.content),
  )
  if (scriptIdx === -1) {
    const token = new state.Token('html_block', '', 0)
    token.content = `<script setup>\n${combined}\n</script>\n`
    // Unshifting earlier would shift every other token's index — do it
    // after the main transform loop so its `tokenIdx` values stay valid.
    state.tokens.unshift(token)
  } else {
    state.tokens[scriptIdx].content = state.tokens[scriptIdx].content.replace(
      '</script>',
      `${combined}\n</script>`,
    )
  }
}

function getStoryPath(mdDir: string, componentName: string, storyFileName: string) {
  const moleculeName = componentName.charAt(0).toLowerCase() + componentName.slice(1)
  const candidates = [
    `../../../../src/components/${componentName}/stories/${storyFileName}.vue`,
    `../../../../src/molecules/${moleculeName}/stories/${storyFileName}.vue`,
    `../../../../frappe/${componentName}/stories/${storyFileName}.vue`,
  ]

  return candidates.find((candidate) => existsSync(resolve(mdDir, candidate))) ?? candidates[0]
}

function transformPreview(
  state: StateCore,
  tokenIdx: number,
  tag: ParsedTag,
  mdDir: string,
): string | null {
  const name = tag.attrs.name
  if (!name) return null

  const csr = tag.attrs.csr === 'true'
  const { componentName, storyFileName } = getPreviewParts(name)
  const storyImportName = getStoryImportName(storyFileName)
  const componentPath = getStoryPath(mdDir, componentName, storyFileName)

  // Forward every static attr except `csr`, which this plugin consumes
  // itself (it's not a Vue prop). `name` is still a prop on the Demo
  // component so it gets forwarded along with the rest.
  const forwardedStatic = Object.entries(tag.attrs)
    .filter(([key]) => key !== 'csr')
    .map(([key, value]) => ` ${key}="${value}"`)
    .join('')
  const forwardedBinds = Object.entries(tag.binds)
    .map(([key, expr]) => ` :${key}="${expr}"`)
    .join('')

  const openWrap = csr ? '<ClientOnly>' : ''
  const closeWrap = csr ? '</ClientOnly>' : ''

  state.tokens[tokenIdx].content =
    `${openWrap}<ComponentPreview${forwardedStatic}${forwardedBinds}><${storyImportName} /><template #code>`

  const code = new state.Token('fence', 'code', 0)
  code.info = 'vue'
  code.content = `<<< ${componentPath}`
  // @ts-expect-error snippets plugin reads `src` for the absolute path
  code.src = [resolve(mdDir, componentPath)]

  const close = new state.Token('html_inline', '', 0)
  close.content = `</template></ComponentPreview>${closeWrap}`

  state.tokens.splice(tokenIdx + 1, 0, code, close)

  return `import ${storyImportName} from '${componentPath}'`
}

export default function componentTransformer(md: MarkdownRenderer) {
  md.core.ruler.after('inline', 'component-preview', (state) => {
    const env = state.env as MarkdownEnv
    const mdDir = dirname(env.realPath ?? env.path)
    const imports: string[] = []

    // Walk in reverse so splicing in new tokens doesn't shift indices
    // we haven't visited yet.
    for (let i = state.tokens.length - 1; i >= 0; i--) {
      const token = state.tokens[i]
      if (token.type !== 'html_block' && token.type !== 'html_inline') continue

      // Cheap text prefilter — Vue's parser is fast but no point invoking
      // it on tokens that clearly don't contain our tags.
      if (token.content.includes('<ComponentPreview')) {
        const tag = parseSingleTag(token.content, 'ComponentPreview')
        if (tag) {
          const importStmt = transformPreview(state, i, tag, mdDir)
          if (importStmt) imports.push(importStmt)
        }
      }
    }

    applyImports(state, imports)
  })
}
