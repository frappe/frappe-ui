import type { MarkdownEnv, MarkdownRenderer } from 'vitepress'
import type StateCore from 'markdown-it/lib/rules_core/state_core'
import { existsSync } from 'node:fs'
import { dirname, isAbsolute, resolve } from 'node:path'
import {
  baseParse,
  NodeTypes,
  type AttributeNode,
  type DirectiveNode,
  type ElementNode,
  type SimpleExpressionNode,
  type TextNode,
} from '@vue/compiler-dom'

export interface ComponentTransformerOptions {
  // Absolute source root dirs, each holding `<Component>/stories/*.vue`,
  // `<Component>/types.ts` and `<Component>/<Component>.playground.vue`. When
  // omitted, defaults resolve relative to each markdown file (backward
  // compatible with the in-repo docs layout).
  sourceRoots?: string[]
}

// Resolve configured source roots; empty when no sourceRoots are provided
// (callers warn rather than silently resolve into nonexistent legacy paths).
function getRoots(mdDir: string, sourceRoots?: string[]): string[] {
  if (sourceRoots && sourceRoots.length) {
    return sourceRoots.map((r) => (isAbsolute(r) ? r : resolve(mdDir, r)))
  }
  return []
}

function warnMissingRoots(tag: string, mdPath: string) {
  console.warn(
    `[componentTransformer] <${tag}> in ${mdPath} but no sourceRoots configured — skipping. Pass sourceRoots to defineDocsConfig.`,
  )
}

function resolveSourcePath(roots: string[], relativePath: string): string {
  for (const root of roots) {
    const candidate = resolve(root, relativePath)
    if (existsSync(candidate)) return candidate
  }
  return resolve(roots[0], relativePath)
}

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

function getStoryPath(
  roots: string[],
  componentName: string,
  storyFileName: string,
) {
  const moleculeName =
    componentName.charAt(0).toLowerCase() + componentName.slice(1)
  const candidates: string[] = []
  for (const root of roots) {
    candidates.push(
      resolve(root, componentName, 'stories', `${storyFileName}.vue`),
    )
    candidates.push(
      resolve(root, moleculeName, 'stories', `${storyFileName}.vue`),
    )
  }
  return candidates.find((candidate) => existsSync(candidate)) ?? candidates[0]
}

function transformPreview(
  state: StateCore,
  tokenIdx: number,
  tag: ParsedTag,
  roots: string[],
): string | null {
  const name = tag.attrs.name
  if (!name) return null

  const csr = tag.attrs.csr === 'true'
  const { componentName, storyFileName } = getPreviewParts(name)
  const storyImportName = getStoryImportName(storyFileName)
  const componentPath = getStoryPath(roots, componentName, storyFileName)

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
  // @ts-ignore snippets plugin reads `src` for the absolute path (Token lacks the field in types)
  code.src = [componentPath]

  const close = new state.Token('html_inline', '', 0)
  close.content = `</template></ComponentPreview>${closeWrap}`

  state.tokens.splice(tokenIdx + 1, 0, code, close)

  return `import ${storyImportName} from '${componentPath}'`
}

function transformPropsTable(
  state: StateCore,
  tokenIdx: number,
  tag: ParsedTag,
  roots: string[],
) {
  const name = tag.attrs.name
  const dataExpr = tag.binds.data
  if (!name || !dataExpr) return

  // The optional `folder` attribute lets a sub-component (e.g.
  // DateTimePicker, which lives inside the DatePicker folder) point at
  // the correct `types.ts`. When omitted, the folder matches `name`.
  const componentFolder = tag.attrs.folder || name
  const typesPath = resolveSourcePath(roots, `${componentFolder}/types.ts`)

  state.tokens[tokenIdx].content =
    `<PropsTable name="${name}" :data="${dataExpr}"><template #code>`

  const code = new state.Token('fence', 'code', 0)
  code.info = 'typescript'
  code.content = `<<< ${typesPath}`
  // @ts-ignore snippets plugin reads `src` for the absolute path (Token lacks the field in types)
  code.src = [typesPath]

  const close = new state.Token('html_inline', '', 0)
  close.content = `</template></PropsTable>`

  state.tokens.splice(tokenIdx + 1, 0, code, close)
}

// `<ComponentPlayground name="Button" />` renders the interactive knobs demo
// that lives at `<root>/Button/Button.playground.vue`. It's rewritten into a
// static import on the page rather than resolved through a globally
// registered component: an async global pops in a beat after the page paints,
// and a static global barrel would drag every component's playground (and with
// them CodeMirror, the charts and the editor) onto every page.
function transformPlayground(
  state: StateCore,
  tokenIdx: number,
  tag: ParsedTag,
  roots: string[],
  mdPath: string,
): string | null {
  const name = tag.attrs.name
  if (!name) return null

  const importName = `${name}Playground`
  const componentPath = resolveSourcePath(
    roots,
    `${name}/${name}.playground.vue`,
  )
  if (!existsSync(componentPath)) {
    console.warn(
      `[componentTransformer] <ComponentPlayground name="${name}"> in ${mdPath} has no playground at ${componentPath} — skipping.`,
    )
    return null
  }

  state.tokens[tokenIdx].content = `<${importName} />`
  return `import ${importName} from '${componentPath}'`
}

function install(md: MarkdownRenderer, options: ComponentTransformerOptions) {
  md.core.ruler.after('inline', 'component-preview', (state) => {
    const env = state.env as MarkdownEnv
    // VitePress calls parseInline with an empty env (e.g. title inference);
    // there's nothing to transform without a source path.
    const mdPath = env.realPath ?? env.path
    if (!mdPath) return
    const mdDir = dirname(mdPath)
    const roots = getRoots(mdDir, options.sourceRoots)
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
          if (!roots.length) {
            warnMissingRoots('ComponentPreview', mdPath)
            continue
          }
          const importStmt = transformPreview(state, i, tag, roots)
          if (importStmt) imports.push(importStmt)
        }
      } else if (token.content.includes('<ComponentPlayground')) {
        const tag = parseSingleTag(token.content, 'ComponentPlayground')
        if (tag) {
          if (!roots.length) {
            warnMissingRoots('ComponentPlayground', mdPath)
            continue
          }
          const importStmt = transformPlayground(state, i, tag, roots, mdPath)
          if (importStmt) imports.push(importStmt)
        }
      } else if (token.content.includes('<PropsTable')) {
        const tag = parseSingleTag(token.content, 'PropsTable')
        if (tag) {
          if (!roots.length) {
            warnMissingRoots('PropsTable', mdPath)
            continue
          }
          transformPropsTable(state, i, tag, roots)
        }
      }
    }

    applyImports(state, imports)
  })
}

// Factory: returns a markdown-it plugin bound to the given source roots.
export function createComponentTransformer(
  options: ComponentTransformerOptions = {},
) {
  return (md: MarkdownRenderer) => install(md, options)
}

// Backward compatible: usable directly as `md.use(componentTransformer)`
// (first arg is the renderer) or as a factory `componentTransformer(opts)`.
export default function componentTransformer(
  mdOrOptions?: MarkdownRenderer | ComponentTransformerOptions,
) {
  if (mdOrOptions && 'core' in (mdOrOptions as MarkdownRenderer)) {
    return install(mdOrOptions as MarkdownRenderer, {})
  }
  return createComponentTransformer(
    (mdOrOptions as ComponentTransformerOptions) ?? {},
  )
}
