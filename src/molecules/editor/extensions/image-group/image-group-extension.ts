import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageGroupNodeView from './ImageGroupNodeView.vue'
import { buildImageGroupCommands } from './image-group-commands'
import { clampColumns, DEFAULT_COLUMNS } from './image-group-utils'
import type { UploadedFile } from '#utils/useFileUpload'

export interface ImageGroupOptions {
  /**
   * Function to handle image uploads.
   * @default null
   */
  uploadFunction: ((file: File) => Promise<UploadedFile>) | null
  HTMLAttributes: Record<string, unknown>
}

export interface ImageGroupAttrs {
  columns?: number
  images: { src: string; alt?: string }[]
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageGroup: {
      /** Insert an image group/gallery node. */
      setImageGroup: (attrs: {
        columns?: number
        images: { src: string; alt?: string }[]
      }) => ReturnType
      /** Group the images in the current selection into one gallery node. */
      groupSelectedImages: () => ReturnType
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
        default: DEFAULT_COLUMNS,
        parseHTML: (element) =>
          clampColumns(element.getAttribute('data-columns')),
        renderHTML: (attributes) => ({
          'data-columns': clampColumns(attributes.columns),
        }),
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
          return { columns: clampColumns(el.getAttribute('data-columns')) }
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
          'data-columns': clampColumns(node.attrs.columns),
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
    return buildImageGroupCommands(this.name)
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-g': () => this.editor.commands.groupSelectedImages(),
    }
  },
})

export default ImageGroup
