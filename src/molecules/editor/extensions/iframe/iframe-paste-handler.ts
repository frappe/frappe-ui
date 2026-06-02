/**
 * ProseMirror paste plugin for the iframe extension.
 *
 * Recognises (a) `<iframe>` embed snippets in pasted HTML/text and (b) bare
 * platform URLs in plain text, then inserts a validated iframe node. Replaces
 * the legacy handler that used a third hand-rolled URL regex, a blocking
 * `window.confirm`, and `console.log`. Validation now flows through
 * {@link validateIframeUrl}; insertion through {@link dispatchIfAlive}.
 */
import { Plugin, PluginKey } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'
import { dispatchIfAlive } from '#molecules/editor/extensions/shared/node-view'
import { validateIframeUrl } from './iframe-allowlist'
import {
  processEmbedUrl,
  getOptimalDimensions,
} from './iframe-embed-utils'
import {
  parseIframeFromHTML,
  type ParsedIframeEmbed,
} from './parseIframeEmbed'

/** Insert a validated iframe node at the current selection. */
function insertIframeNode(
  view: EditorView,
  nodeName: string,
  embed: ParsedIframeEmbed,
  allowlist?: readonly string[],
): boolean {
  const processedSrc = processEmbedUrl(embed.src)
  if (!validateIframeUrl(processedSrc, { allowlist })) return false

  const nodeType = view.state.schema.nodes[nodeName]
  if (!nodeType) return false

  const editorWidth = view.dom.clientWidth || 800
  const optimal = getOptimalDimensions(processedSrc, editorWidth)
  const width = embed.width ?? optimal.width
  const height = embed.height ?? optimal.height

  const node = nodeType.create({
    src: processedSrc,
    width,
    height,
    title: embed.title ?? null,
    align: 'center',
    aspectRatio: height / width,
  })

  return dispatchIfAlive(view, view.state.tr.replaceSelectionWith(node))
}

/** Build the iframe paste-handling plugin for a given node name. */
export function createIframePastePlugin(
  nodeName: string,
  allowlist?: readonly string[],
): Plugin {
  return new Plugin({
    key: new PluginKey('iframe-paste-handler'),
    props: {
      handlePaste: (view: EditorView, event: ClipboardEvent): boolean => {
        const html = event.clipboardData?.getData('text/html')
        const text = event.clipboardData?.getData('text/plain')

        // 1. Iframe embed snippet inside pasted HTML.
        if (html) {
          const embed = parseIframeFromHTML(html)
          if (embed && insertIframeNode(view, nodeName, embed, allowlist)) return true
        }

        // 2. Iframe embed snippet inside plain text.
        if (text && text.includes('<iframe')) {
          const embed = parseIframeFromHTML(text)
          if (embed && insertIframeNode(view, nodeName, embed, allowlist)) return true
        }

        // 3. Bare platform URL in plain text — validated, not regex-sniffed.
        if (text) {
          const trimmed = text.trim()
          const processed = processEmbedUrl(trimmed)
          if (validateIframeUrl(processed, { allowlist })) {
            if (insertIframeNode(view, nodeName, { src: trimmed }, allowlist)) return true
          }
        }

        return false
      },
    },
  })
}
