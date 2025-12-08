import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageGroupNodeView from './ImageGroupNodeView.vue'
import { UploadedFile } from '../../../../utils/useFileUpload'

export interface ImageGroupOptions {
  /**
   * Function to handle image uploads
   * @default null
   */
  uploadFunction: ((file: File) => Promise<UploadedFile>) | null
  HTMLAttributes: Record<string, any>
}

export interface ImageGroupAttrs {
  columns?: number
  images: {
    src: string
    alt?: string
  }[]
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageGroup: {
      /**
       * Insert an image group/gallery node
       */
      setImageGroup: (attrs: {
        columns?: number
        images: { src: string; alt?: string }[]
      }) => ReturnType
      /**
       * Group selected images into an image group
       */
      groupSelectedImages: (columns?: number) => ReturnType
    }
  }
}

export const ImageGroup = Node.create<ImageGroupOptions>({
  name: 'imageGroup',

  group: 'block',
  content: 'image+', // one or more images
  selectable: true,
  draggable: true,
  isolating: true,

  addOptions() {
    return {
      uploadFunction: null,
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      columns: {
        default: 4,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="image-group"]',
        getAttrs: (element) => {
          if (typeof element === 'string') return {}
          const el = element as HTMLElement
          return {
            columns: el.getAttribute('data-columns')
              ? Number(el.getAttribute('data-columns'))
              : 4,
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      'div',
      mergeAttributes(
        {
          'data-type': 'image-group',
          'data-columns': node.attrs.columns,
        },
        this.options.HTMLAttributes,
        HTMLAttributes,
      ),
      0, // content placeholder for child images
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(ImageGroupNodeView)
  },

  addCommands() {
    return {
      setImageGroup:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              columns: attrs.columns || 4,
            },
            content: attrs.images.map((img) => ({
              type: 'image',
              attrs: img,
            })),
          })
        },

      groupSelectedImages:
        (columns = 4) =>
        ({ state, chain }) => {
          const { selection } = state
          const { from, to } = selection
          
          // Collect all image nodes within the selection
          const images: { src: string; alt?: string; pos: number }[] = []
          
          state.doc.nodesBetween(from, to, (node, pos) => {
            if (node.type.name === 'image') {
              images.push({
                src: node.attrs.src,
                alt: node.attrs.alt,
                pos,
              })
            }
          })

          // Need at least 2 images to create a group
          if (images.length < 2) {
            return false
          }

          // Sort by position (descending) for deletion
          const sortedImages = [...images].sort((a, b) => b.pos - a.pos)
          
          // Find the position to insert the group (start of selection)
          const insertPos = Math.min(...images.map(img => img.pos))

          // Start a chain of commands
          let cmd = chain()

          // Delete all selected images (from end to start to maintain positions)
          sortedImages.forEach((img) => {
            const node = state.doc.nodeAt(img.pos)
            if (node) {
              cmd = cmd.deleteRange({ 
                from: img.pos, 
                to: img.pos + node.nodeSize 
              })
            }
          })

          // Insert the image group at the start position
          cmd = cmd
            .insertContentAt(insertPos, {
              type: this.name,
              attrs: { columns },
              content: images.map((img) => ({
                type: 'image',
                attrs: { src: img.src, alt: img.alt },
              })),
            })
            .run()

          return true
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-g': () => this.editor.commands.groupSelectedImages(),
    }
  },
})

export default ImageGroup