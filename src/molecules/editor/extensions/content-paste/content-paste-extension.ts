/**
 * Content-paste extension — clipboard ingestion for images, HTML, and markdown.
 *
 * Three branches, dispatched in `handlePaste`:
 *  1. Clipboard contains image FILES → re-upload via the shared media engine.
 *  2. Clipboard `text/html` that CONTAINS an `<img>` → insert + re-upload the
 *     embedded `data:`/`blob:` images (`paste-image-controller`). HTML WITHOUT an
 *     image is left to the editor's default handling (`return false`), so normal
 *     rich-text paste is untouched.
 *  3. Genuine plaintext (no `text/html` on the clipboard) that looks like
 *     markdown → render to a slice (`tryMarkdownSlice`).
 *
 * `transformCopied` absolutizes root-relative media `src`s on copy so pasted
 * content works across origins.
 *
 * All upload/find/dimension logic is delegated to the shared
 * `media-upload-engine` (consumed via the image `imageEngine` instance) — this
 * file never re-implements the pipeline (conventions §1.3, PLAN cluster 11).
 */
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Slice } from '@tiptap/pm/model'
import type { EditorView } from '@tiptap/pm/view'
import { imageEngine } from '#molecules/editor/extensions/image/image-engine'
import {
  resolveUploadOptions,
  type UploadFunction,
} from '#molecules/editor/extensions/shared/media-upload-engine'
import { absolutizeMediaSrcs } from './media-src-utils'
import { htmlContainsImage } from './paste-html-utils'
import { tryMarkdownSlice } from './paste-markdown-utils'
import { processHTMLImages } from './paste-image-controller'

export interface ContentPasteOptions {
  /** When false, the extension is inert and all paste handling falls through. */
  enabled: boolean
  /** Upload function used for re-uploading pasted images. */
  uploadFunction: UploadFunction | null
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
    const extension = this
    return [
      new Plugin({
        key: new PluginKey('contentPaste'),
        props: {
          transformCopied(slice) {
            if (!slice) return slice
            const content = absolutizeMediaSrcs(
              slice.content,
              window.location.origin,
            )
            if (content === slice.content) return slice
            return new Slice(content, slice.openStart, slice.openEnd)
          },

          handlePaste(view: EditorView, event: ClipboardEvent): boolean {
            if (!extension.options.enabled) return false

            const editor = extension.editor
            if (!editor) return false

            const options = resolveUploadOptions({
              ...extension.options,
              editor,
            })

            // 1. Image files on the clipboard → re-upload.
            const files = Array.from(event.clipboardData?.files ?? [])
            const images = files.filter((file) =>
              file.type.startsWith('image/'),
            )
            if (images.length > 0) {
              void imageEngine.processMultiple(images, editor, null, options)
              return true
            }

            // 2. HTML on the clipboard. With an <img> → insert + re-upload
            //    embedded images. WITHOUT an <img> → defer to the editor's
            //    default rich-paste (`return false`) so normal rich-text paste
            //    is untouched and never re-rendered as markdown.
            const html = event.clipboardData?.getData('text/html')
            if (html && htmlContainsImage(html)) {
              void processHTMLImages(html, editor, imageEngine, options)
              return true
            }
            if (html) return false

            // 3. Markdown from genuine plaintext (no text/html present).
            const text = event.clipboardData?.getData('text/plain')
            if (!text) return false
            const slice = tryMarkdownSlice(text, view.state.schema)
            if (!slice) return false
            view.dispatch(view.state.tr.replaceSelection(slice))
            return true
          },
        },
      }),
    ]
  },
})
