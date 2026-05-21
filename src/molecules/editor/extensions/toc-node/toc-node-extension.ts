import { Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import TocNodeView from './TocNodeView.vue'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tocNode: {
      insertTableOfContentsNode: () => ReturnType
    }
  }
}

export const TocNodeExtension = Node.create({
  name: 'tocNode',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: false,

  addAttributes() {
    return {
      placeholder: {
        default: 'Table of Contents',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="toc-node"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const headings: Array<{ level: number; text: string }> = []
    let tabStart: number | null = null
    let tabEnd: number | null = null

    let activeTabId: string | null = null
    try {
      if (this.editor?.commands?.getCurrentTab) {
        activeTabId = this.editor.commands.getCurrentTab() || null
      }
    } catch (e) {
    }

    if (this.editor?.state?.doc) {
      const doc = this.editor.state.doc

      if (activeTabId) {
        doc.descendants((node, pos) => {
          if (node.type.name === 'tab' && node.attrs?.id === activeTabId) {
            tabStart = pos
            tabEnd = pos + node.nodeSize
            return false
          }
        })
      }

      doc.descendants((node, pos) => {
        if (node.type.name === 'tocNode') return false
        if (node.type.name !== 'heading') return false

        if (tabStart !== null && tabEnd !== null) {
          if (pos < tabStart || pos >= tabEnd) {
            return false
          }
        }

        const level = node.attrs?.level
        const text = node.textContent?.trim()
        if (text && level && level >= 1 && level <= 6) {
          headings.push({ level, text })
        }
      })
    }

    if (headings.length === 0) {
      return [
        'div',
        { ...HTMLAttributes, 'data-type': 'toc-node', class: 'table-of-contents-node' },
        'No headings found in this document.',
      ]
    }

    const buildNestedList = (items: typeof headings): any[] => {
      if (!items.length) return []

      type TreeNode = {
        level: number
        text: string
        children: TreeNode[]
      }

      const roots: TreeNode[] = []
      const stack: TreeNode[] = []

      items.forEach((item) => {
        const node: TreeNode = {
          level: item.level,
          text: item.text,
          children: [],
        }

        while (stack.length && stack[stack.length - 1].level >= node.level) {
          stack.pop()
        }

        if (!stack.length) {
          roots.push(node)
        } else {
          stack[stack.length - 1].children.push(node)
        }

        stack.push(node)
      })

      const convertToHTML = (nodes: TreeNode[]): any[] => {
        return nodes.map((node) => [
          'li',
          {},
          ['p', { style: 'margin: 0' }, node.text],
          ...(node.children.length > 0
            ? [['ol', { style: 'list-style-type: decimal; padding-left: 1.5em' }, ...convertToHTML(node.children)]]
            : []),
        ])
      }

      return convertToHTML(roots)
    }

    const listItems = buildNestedList(headings)

    return [
      'div',
      { ...HTMLAttributes, 'data-type': 'toc-node', class: 'table-of-contents-node' },
      ['ol', { style: 'list-style-type: decimal; margin: 0.5em 0; padding-left: 1.5em' }, ...listItems],
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(TocNodeView)
  },

  addCommands() {
    return {
      insertTableOfContentsNode:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              placeholder: 'Table of Contents',
            },
          })
        },
    }
  },
})

export default TocNodeExtension



