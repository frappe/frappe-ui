/**
 * Imperative command builders for the iframe extension.
 *
 * The extension's `addCommands` is a thin map that delegates to these, keeping
 * the `Node.create` shell small. Each builder returns a TipTap command (a
 * function of `CommandProps`). Validation goes through `validateIframeUrl`; URL
 * rewriting through `processEmbedUrl` — never the deleted `validateURL`.
 */
import type { RawCommands } from '@tiptap/core'
import { validateIframeUrl } from './iframe-allowlist'
import { processEmbedUrl, getOptimalDimensions } from './iframe-embed-utils'
import { openIframeInsertDialog } from './iframeInsertDialogController'

export type IframeAlign = 'left' | 'center' | 'right'

export interface SetIframeOptions {
  src: string
  width?: number
  height?: number
  title?: string
  interactive?: boolean
  align?: IframeAlign
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      /** Insert an iframe node from validated, embed-rewritten options. */
      setIframe: (options: SetIframeOptions) => ReturnType
      /** Insert an iframe from a single URL (convenience over setIframe). */
      insertIframeURL: (url: string) => ReturnType
      /** Update the selected iframe's alignment. */
      setIframeAlign: (align: IframeAlign) => ReturnType
      /**
       * Open the insert-embed dialog (mounts it via the controller).
       * `platform` (a `PLATFORM_CONFIGS` name, e.g. "YouTube") tailors the
       * dialog title/placeholder; the dialog still accepts any supported URL.
       */
      openIframeDialog: (platform?: string) => ReturnType
    }
    // Separate group: the legacy TextEditor also augments `Commands.iframe`,
    // and a divergent second declaration of a shared group is a TS2717 error.
    iframeEdit: {
      /** Swap the src of the iframe node at `pos` (keeps caption/align). */
      updateIframeAt: (pos: number, url: string) => ReturnType
    }
  }
}

/** Build the iframe command map for the extension's `addCommands`. */
export function buildIframeCommands(
  nodeName: string,
  allowlist?: readonly string[],
): Partial<RawCommands> {
  const setIframeAlign: RawCommands['setIframeAlign'] =
    (align: IframeAlign) =>
    ({ commands }) =>
      commands.updateAttributes(nodeName, { align })

  const setIframe: RawCommands['setIframe'] =
    (options: SetIframeOptions) =>
    ({ commands, editor }) => {
      const processedSrc = processEmbedUrl(options.src)
      if (!validateIframeUrl(processedSrc, { allowlist })) return false

      const editorWidth = editor.view.dom.clientWidth || 800
      const optimal = getOptimalDimensions(processedSrc, editorWidth)
      const width = options.width ?? optimal.width
      const height = options.height ?? optimal.height

      return commands.insertContent({
        type: nodeName,
        attrs: {
          src: processedSrc,
          width,
          height,
          title: options.title ?? null,
          align: options.align ?? 'center',
          aspectRatio: height / width,
          interactive: options.interactive ?? false,
        },
      })
    }

  const insertIframeURL: RawCommands['insertIframeURL'] =
    (url: string) =>
    ({ commands }) =>
      commands.setIframe({ src: url })

  const openIframeDialog: RawCommands['openIframeDialog'] =
    (platform?: string) =>
    ({ editor }) => {
      openIframeInsertDialog({ editor, platform })
      return true
    }

  const updateIframeAt: RawCommands['updateIframeAt'] =
    (pos: number, url: string) =>
    ({ editor, tr, dispatch }) => {
      const node = editor.state.doc.nodeAt(pos)
      if (!node || node.type.name !== nodeName) return false
      const processedSrc = processEmbedUrl(url)
      if (!validateIframeUrl(processedSrc, { allowlist })) return false
      // Same src → keep the user's sizing; new src → re-derive platform dims.
      let { width, height } = node.attrs as {
        width: number | null
        height: number | null
      }
      if (processedSrc !== node.attrs.src || !width || !height) {
        const editorWidth = editor.view.dom.clientWidth || 800
        ;({ width, height } = getOptimalDimensions(processedSrc, editorWidth))
      }
      if (dispatch) {
        tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          src: processedSrc,
          width,
          height,
          aspectRatio: height / width,
        })
      }
      return true
    }

  return {
    setIframeAlign,
    setIframe,
    insertIframeURL,
    openIframeDialog,
    updateIframeAt,
  }
}
