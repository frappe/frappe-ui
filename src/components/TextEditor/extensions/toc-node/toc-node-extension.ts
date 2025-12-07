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
    return [
      'div',
      { ...HTMLAttributes, 'data-type': 'toc-node' },
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




