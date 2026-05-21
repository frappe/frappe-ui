import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import IframeNodeView from './IframeNodeView.vue'
import { validateURL, processURL, getOptimalDimensions, ALLOWED_DOMAINS } from './utils'

// Constants for iframe constraints
const MIN_IFRAME_WIDTH = 200
const EDITOR_PADDING = 40
const DEFAULT_EMBED_HOST = 'gameplan'

export interface IframeOptions {
  allowedDomains?: string[]
  blockedDomains?: string[]
  HTMLAttributes: Record<string, any>
}

export interface SetIframeOptions {
  src: string
  width?: number
  height?: number
  title?: string
  interactive?: boolean
  align?: 'left' | 'center' | 'right'
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      setIframe: (options: SetIframeOptions) => ReturnType
      insertIframeURL: (url: string) => ReturnType
      setIframeAlign: (align: 'left' | 'center' | 'right') => ReturnType
      openIframeDialog: () => ReturnType
    }
  }
}

export const IframeExtension = Node.create<IframeOptions>({
  name: 'iframe',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,

  addOptions() {
    return {
      allowedDomains: ALLOWED_DOMAINS,
      blockedDomains: [],
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute('src'),
        renderHTML: (attributes) => ({
          src: attributes.src,
        }),
      },
      width: {
        default: null,
        parseHTML: (element) => {
          const width = element.getAttribute('width')
          return width ? parseInt(width, 10) : null
        },
        renderHTML: (attributes) => ({
          width: attributes.width ? String(attributes.width) : null,
        }),
      },
      height: {
        default: null,
        parseHTML: (element) => {
          const height = element.getAttribute('height')
          return height ? parseInt(height, 10) : null
        },
        renderHTML: (attributes) => ({
          height: attributes.height ? String(attributes.height) : null,
        }),
      },
      aspectRatio: {
        default: 9/16, // Default 16:9 aspect ratio
        parseHTML: () => null, // Don't parse from HTML
        renderHTML: () => ({}), // Don't render to HTML
      },
      align: {
        default: 'center',
        parseHTML: (element) => {
          const align = (
            element.getAttribute('data-align') ||
            element.getAttribute('align') ||
            'left'
          ).toLowerCase()

          if (['left', 'center', 'right'].includes(align)) {
            return align as 'left' | 'center' | 'right'
          }
          return 'left'
        },
        renderHTML: (attributes) => {
          return {
            'data-align': attributes.align || 'center',
          }
        },
      },
      title: {
        default: null,
        parseHTML: (element) => element.getAttribute('title'),
        renderHTML: (attributes) => ({
          title: attributes.title,
        }),
      },
      frameborder: {
        default: '0',
        renderHTML: () => ({
          frameborder: '0',
        }),
      },
      allowfullscreen: {
        default: 'true',
        renderHTML: () => ({
          allowfullscreen: 'true',
        }),
      },
      sandbox: {
        default: 'allow-scripts allow-same-origin allow-popups allow-forms',
        renderHTML: (attributes) => ({
          sandbox: attributes.sandbox,
        }),
      },
      interactive: {
        default: false,
        parseHTML: (el) => el.getAttribute('data-interactive') === 'true',
        renderHTML: (attrs) => ({
          'data-interactive': attrs.interactive ? 'true' : 'false',
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[src]',
        getAttrs: (element) => {
          const src = (element as HTMLElement).getAttribute('src')
          const width = (element as HTMLElement).getAttribute('width')
          const height = (element as HTMLElement).getAttribute('height')
          const title = (element as HTMLElement).getAttribute('title')
          const align = (element as HTMLElement).getAttribute('data-align')

          return {
            src,
            width: width ? parseInt(width, 10) : null,
            height: height ? parseInt(height, 10) : null,
            title: title || null,
            align: align || 'center'
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'iframe',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        loading: 'lazy',
        referrerpolicy: 'no-referrer-when-downgrade',
      }),
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(IframeNodeView)
  },

  addCommands() {
    return {
      setIframeAlign:
        (align: 'left' | 'center' | 'right') =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { align })
        },

      setIframe:
        (options: SetIframeOptions) =>
        ({ commands, editor }) => {
          if (!validateURL(options.src, this.options)) {
            return false
          }

          const processedSrc = processURL(options.src)

          // Calculate optimal dimensions if not provided
          const editorElement = editor.view.dom
          const editorWidth = editorElement?.clientWidth || 800
          const optimalDimensions = getOptimalDimensions(processedSrc, editorWidth)

          const attrs = {
            src: processedSrc,
            width: options.width || optimalDimensions.width,
            height: options.height || optimalDimensions.height,
            title: options.title,
            align: options.align || 'center',
            aspectRatio: optimalDimensions.height / optimalDimensions.width,
            interactive: options.interactive,
          }

          return commands.insertContent({
            type: this.name,
            attrs
          })
        },

      insertIframeURL:
        (url: string) =>
        ({ commands }) => {
          const processedUrl = processURL(url)
          return commands.setIframe({ src: processedUrl })
        },

      openIframeDialog:
        () =>
        ({ editor }) => {
          // Emit a custom event on the editor's view DOM element
          // This is more localized than document.dispatchEvent
          const event = new CustomEvent('iframe:open-dialog', {
            detail: { editor }
          })
          editor.view.dom.dispatchEvent(event)
          return true
        },
    }
  },

  // Add ProseMirror plugin for paste handling
  addProseMirrorPlugins() {
    const extensionThis = this

    return [
      new Plugin({
        key: new PluginKey('iframe-paste-handler'),
        props: {
          handlePaste: (view, event, slice) => {
            const text = event.clipboardData?.getData('text/plain')
            const html = event.clipboardData?.getData('text/html')

            // First, check for iframe embed codes in HTML content
            if (html) {
              const iframeData = parseIframeFromHTML(html)
              if (iframeData) {
                return createIframeNode(view, extensionThis, iframeData.src, iframeData.width, iframeData.height, iframeData.title)
              }
            }

            // Check if plain text contains iframe embed code
            if (text && text.includes('<iframe')) {
              const iframeData = parseIframeFromHTML(text)
              if (iframeData) {
                return createIframeNode(view, extensionThis, iframeData.src, iframeData.width, iframeData.height, iframeData.title)
              }
            }

            // Fallback to URL detection for plain text
            if (text) {
              // Check if pasted text is a supported embed URL
              const urlPattern = /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=[\w-]+|youtu\.be\/[\w-]+|youtube\.com\/embed\/[\w-]+|vimeo\.com\/\d+|player\.vimeo\.com\/video\/\d+|codepen\.io\/[\w-]+\/pen\/[\w-]+|codesandbox\.io\/[\w\/.-]+|figma\.com\/[\w\/.-]+|embed\.figma\.com\/[\w\/.-]+)$/

              if (urlPattern.test(text.trim())) {
                return createIframeNode(view, extensionThis, text.trim())
              }
            }

            return false // Allow default paste behavior
          },
        },
      }),
    ]
  },
})

// Helper function to parse iframe embed codes from pasted HTML content
function parseIframeFromHTML(html: string): { src: string, width?: number, height?: number, title?: string } | null {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const iframe = doc.querySelector('iframe')

    if (!iframe) {
      // Fallback: try to parse iframe tag using regex
      const iframeMatch = html.match(/<iframe[^>]*src=["']([^"']+)["'][^>]*>/i)
      if (iframeMatch) {
        const src = iframeMatch[1]
        const widthMatch = html.match(/width=["'](\d+)["']/i)
        const heightMatch = html.match(/height=["'](\d+)["']/i)
        const titleMatch = html.match(/title=["']([^"']+)["']/i)

        return {
          src,
          width: widthMatch ? parseInt(widthMatch[1], 10) : undefined,
          height: heightMatch ? parseInt(heightMatch[1], 10) : undefined,
          title: titleMatch ? titleMatch[1] : undefined
        }
      }
      return null
    }

    const src = iframe.getAttribute('src')
    if (!src) return null

    const width = iframe.getAttribute('width') ? parseInt(iframe.getAttribute('width')!, 10) : undefined
    const height = iframe.getAttribute('height') ? parseInt(iframe.getAttribute('height')!, 10) : undefined
    const title = iframe.getAttribute('title') || undefined

    return { src, width, height, title }
  } catch (error) {
    return null
  }
}

// Helper function to create iframe node from parsed data
function createIframeNode(view: any, extensionThis: any, src: string, width?: number, height?: number, title?: string) {
  // Ask user for confirmation before creating iframe
  const shouldCreateEmbed = confirm(`Do you want to embed this content?\n\nURL: ${src}\n\nClick "OK" to create an embed, or "Cancel" to paste as plain text.`)

  if (!shouldCreateEmbed) {
    return false // Allow default paste behavior (paste as text)
  }

  if (!validateURL(src, extensionThis.options)) {
    return false
  }

  console.log('URL validated, creating iframe node')
  const processedUrl = processURL(src)
  const editorElement = extensionThis.editor.view.dom
  const editorWidth = editorElement?.clientWidth || 800

  // Use provided dimensions or calculate optimal ones
  const finalWidth = width || getOptimalDimensions(processedUrl, editorWidth).width
  const finalHeight = height || getOptimalDimensions(processedUrl, editorWidth).height

  const attrs = {
    src: processedUrl,
    width: finalWidth,
    height: finalHeight,
    title: title,
    align: 'center' as const,
    aspectRatio: finalHeight / finalWidth
  }

  const node = view.state.schema.nodes.iframe.create(attrs)
  const tr = view.state.tr.replaceSelectionWith(node)
  view.dispatch(tr)

  return true // Prevent default paste behavior
}

export default IframeExtension
