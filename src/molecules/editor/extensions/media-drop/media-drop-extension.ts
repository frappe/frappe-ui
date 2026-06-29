import { Extension } from '@tiptap/core'
import { Plugin, Selection } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'
import { openImageGroupUploadDialog } from '#molecules/editor/extensions/image-group/imageGroupDialogController'

/**
 * The single drop pipeline.
 *
 * One place decides what a set of dropped files becomes, so every entry point
 * behaves identically: the precise in-prose drop (this extension's ProseMirror
 * plugin, which drops at the cursor) and the generous editor-area drop zone
 * (`EditorDropZone`, which calls `dropFiles` directly).
 *
 * Routing by type/count:
 *   - exactly one image  -> insert it inline (`uploadImage`)
 *   - several images     -> open the image group dialog (matches the toolbar's
 *                           multi-image pick, instead of stacking them inline)
 *   - any video(s)       -> upload inline (`uploadVideoFiles`)
 *   - anything else      -> upload inline as attachments (`uploadAttachmentFiles`)
 *
 * Type routing is feature-detected via the editor's commands, so a kit without
 * the image, video, or attachment extension simply skips that branch.
 *
 * Drop is handled under `handleDOMEvents.drop`; a file paste of non-image,
 * non-video files is handled under `props.handlePaste` (image/video pastes keep
 * flowing to their own extensions' paste handlers).
 */

const IMAGE_RE = /^image\//i
const VIDEO_RE = /^video\//i

/** Pull every `File` out of a drag `DataTransfer`, regardless of MIME. */
function collectFiles(dataTransfer: DataTransfer | null | undefined): File[] {
  const items = dataTransfer?.items
  if (!items || items.length === 0) return []
  const files: File[] = []
  for (let i = 0; i < items.length; i++) {
    if (items[i].kind === 'file') {
      const file = items[i].getAsFile()
      if (file) files.push(file)
    }
  }
  return files
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mediaDrop: {
      /**
       * Route dropped/provided files by type and count (the single drop
       * pipeline). Inserts at the current selection — callers that want a
       * precise position should move the selection first.
       */
      dropFiles: (files: File[]) => ReturnType
    }
  }
}

export const MediaDrop = Extension.create({
  name: 'mediaDrop',

  addCommands() {
    return {
      dropFiles:
        (files: File[]) =>
        ({ editor }) => {
          if (files.length === 0) return false

          const images = files.filter((f) => IMAGE_RE.test(f.type))
          const videos = files.filter((f) => VIDEO_RE.test(f.type))
          // Everything that is neither image nor video becomes an attachment.
          const others = files.filter(
            (f) => !IMAGE_RE.test(f.type) && !VIDEO_RE.test(f.type),
          )

          const can = (name: string): boolean =>
            typeof (editor.commands as Record<string, unknown>)[name] ===
            'function'

          let handled = false

          if (images.length === 1 && can('uploadImage')) {
            editor.commands.uploadImage(images[0])
            handled = true
          } else if (images.length > 1 && can('uploadImage')) {
            openImageGroupUploadDialog({ editor, files: images })
            handled = true
          }

          if (videos.length > 0 && can('uploadVideoFiles')) {
            editor.commands.uploadVideoFiles(videos)
            handled = true
          }

          if (others.length > 0 && can('uploadAttachmentFiles')) {
            editor.commands.uploadAttachmentFiles(others)
            handled = true
          }

          return handled
        },
    }
  },

  addProseMirrorPlugins() {
    const editor = this.editor

    /** Whether a kit exposes a given routing command. */
    const can = (name: string): boolean =>
      typeof (editor.commands as Record<string, unknown>)[name] === 'function'

    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            drop: (view: EditorView, event: DragEvent): boolean => {
              const files = collectFiles(event.dataTransfer)
              if (files.length === 0) return false
              // Only claim drops we can actually route; let ProseMirror handle
              // the rest. Non-media files route to attachments when available.
              const hasMedia = files.some(
                (f) => IMAGE_RE.test(f.type) || VIDEO_RE.test(f.type),
              )
              const hasOther = files.some(
                (f) => !IMAGE_RE.test(f.type) && !VIDEO_RE.test(f.type),
              )
              const routable =
                hasMedia || (hasOther && can('uploadAttachmentFiles'))
              if (!routable) return false

              event.preventDefault()
              event.stopPropagation()

              // Drop at the cursor: move the selection to the drop point so the
              // single-image insert lands where the file was released.
              const coords = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              })
              if (coords) {
                view.dispatch(
                  view.state.tr.setSelection(
                    Selection.near(view.state.doc.resolve(coords.pos)),
                  ),
                )
              }

              editor.commands.dropFiles(files)
              return true
            },
          },

          // Paste of non-image, non-video files (image/video pastes keep
          // flowing to their own extensions' paste handlers, so we never claim
          // them here). Pure-attachment pastes are uploaded at the cursor.
          handlePaste: (_view, event): boolean => {
            if (!can('uploadAttachmentFiles')) return false
            const files = collectFiles(event.clipboardData)
            if (files.length === 0) return false
            const others = files.filter(
              (f) => !IMAGE_RE.test(f.type) && !VIDEO_RE.test(f.type),
            )
            // Only claim when the paste is exclusively attachments; otherwise
            // defer to the image/video paste handlers.
            if (others.length !== files.length) return false

            event.preventDefault()
            editor.commands.uploadAttachmentFiles(others)
            return true
          },
        },
      }),
    ]
  },
})

export default MediaDrop
