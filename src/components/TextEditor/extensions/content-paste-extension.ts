import { Extension, Node } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Slice, Fragment } from '@tiptap/pm/model'
import { DOMParser } from '@tiptap/pm/model'
import { EditorView } from '@tiptap/pm/view'
import { detectMarkdown, markdownToHTML } from '../../../utils/markdown'
import { processMultipleImages } from './image/image-extension'

export interface ContentPasteOptions {
  enabled: boolean
  uploadFunction: Function | null
}

export const ContentPasteExtension = Extension.create<ContentPasteOptions>({
  name: 'contentPaste',

  addOptions() {
    return {
      enabled: true,
      uploadFunction: null,
    }
  },
  addProseMirrorPlugins() {
    const extensionThis = this
    return [
      new Plugin({
        key: new PluginKey('contentPaste'),
        props: {
          transformCopied(slice) {
            if (!slice) return slice
            const newFragment = updateMediaSrcs(slice.content)
            return new Slice(newFragment, slice.openStart, slice.openEnd)
          },
          handlePaste: (view: EditorView, event: ClipboardEvent) => {
            if (!this.options.enabled) return false

            // handle image pasting
            const files: File[] | [] = Array.from(
              event.clipboardData?.files || [],
            )
            const images = Array.from(files).filter((file) =>
              file.type.startsWith('image/'),
            )
            if (images.length > 0) {
              processMultipleImages(images, view, null, extensionThis.options)
              return true
            }

            // handle html with media
            const htmlData = event.clipboardData?.getData('text/html')
            if (htmlData) {
              processHTMLImages(htmlData, view, this.options)
              return true
            }

            // handle markdown pasting
            const text = event.clipboardData?.getData('text/plain')
            if (!text) return false

            if (!detectMarkdown(text)) return false

            const htmlContent = markdownToHTML(text)
            const tempDiv = document.createElement('div')
            tempDiv.innerHTML = htmlContent

            const parser = DOMParser.fromSchema(view.state.schema)
            const parsedSlice = parser.parseSlice(tempDiv, {
              preserveWhitespace: true,
            })

            const tr = view.state.tr.replaceSelection(parsedSlice)
            view.dispatch(tr)

            return true
          },
        },
      }),
    ]
  },
})

async function processHTMLImages(
  html: string,
  view: EditorView,
  extensionOptions: ContentPasteOptions,
): Promise<undefined> {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html.replace(/font-size:\s*([\d.]+)pt/gi, (_, pt) => {
    const px = Math.round((parseFloat(pt) * 96) / 72)
    return `font-size:${px}px`
  })
  const images = tempDiv.querySelectorAll('img')

  const parser = DOMParser.fromSchema(view.state.schema)
  const parsedSlice = parser.parseSlice(tempDiv, {
    preserveWhitespace: true,
  })
  const tr = view.state.tr.replaceSelection(parsedSlice)
  view.dispatch(tr)

  const imageInfo: Array<{ src: string; pos: number }> = []
  view.state.doc.descendants((node, pos) => {
    for (let img of images) {
      const src = img.getAttribute('src')
      if (node.type.name === 'image' && node.attrs['src'] === src) {
        imageInfo.push({ src, pos })
      }
    }
  })

  // Process each image
  const imagePromises = Array.from(imageInfo).map(async ({ src, pos }) => {
    if (src.startsWith('data:') || src.startsWith('blob:')) {
      try {
        const response = await fetch(src)
        const blob = await response.blob()
        const file = new File([blob], 'pasted-data-image.png', {
          type: blob.type,
        })
        processMultipleImages([file], view, pos, extensionOptions)
      } catch (error) {
        console.error('Failed to process image:', error)
      }
    }
  })

  await Promise.all(imagePromises)
}

function updateMediaSrcs(fragment: Fragment) {
  const children: Node[] = []
  fragment.forEach((node) => {
    let newNode = node

    // If it's an image node, modify attrs
    if (node.type.name === 'image' || node.type.name === 'video') {
      const src = node.attrs.src
      if (src && src.startsWith('/')) {
        newNode = node.type.create(
          {
            ...node.attrs,
            src: `${window.location.origin}${src}`,
          },
          node.content,
          node.marks,
        )
      }
    }

    // Recurse into children
    if (node.content && node.content.size > 0) {
      newNode = newNode.copy(updateMediaSrcs(node.content))
    }

    children.push(newNode)
  })

  return Fragment.fromArray(children)
}
