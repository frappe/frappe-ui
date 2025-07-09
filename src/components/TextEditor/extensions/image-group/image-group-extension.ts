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
    }
  },
})
