/**
 * Imperative glue for the "HTML paste that contains `<img>`" path.
 *
 * Flow:
 *  1. Parse the HTML into a slice and insert it synchronously, so the pasted
 *     content (text + image placeholders) appears immediately.
 *  2. Collect the inserted `data:`/`blob:` image nodes (the only sources that
 *     must be re-uploaded) and remember each one's `src`.
 *  3. Fetch every embedded src into a `File` in PARALLEL via the shared engine
 *     helper `dataUrlOrBlobToFile`.
 *  4. Hand each file to the engine's `processMultiple`, relocating the target
 *     node by its `src` immediately before the call so positions stay valid as
 *     earlier uploads mutate the document.
 *
 * Why relocate by `src` (and not by node identity or a transient marker attr):
 *  - `media-plugin.appendTransaction` back-fills dimensions on a freshly-inserted
 *    `data:` image via `setNodeMarkup` during the fetch `await`, producing a NEW
 *    node object — so an identity match (`node === target`) breaks (the original
 *    bug, FINDINGS #10).
 *  - A marker attribute (`uploadId`) does NOT survive in hosts that round-trip
 *    editor content through HTML (e.g. gameplan's v-model): `uploadId` has no
 *    `renderHTML`, so a `setContent(getHTML())` cycle drops it.
 *  - The `data:`/`blob:` `src`, by contrast, IS serialized to HTML and is left
 *    untouched by the dimension back-fill, so a `findNodeBySource` lookup stays
 *    valid across both the await and any intervening content round-trip.
 *
 * Async safety (conventions §0.6): the parse/insert is synchronous; every step
 * after an `await` re-checks `editor.isDestroyed` and reads `editor.view` fresh
 * (via the engine), and all document writes go through the engine (which itself
 * resolves the live view and guards via `dispatchIfAlive`).
 */
import type { Editor } from '@tiptap/core'
import {
  dataUrlOrBlobToFile,
  type MediaUploadEngine,
  type MediaUploadOptions,
} from '@molecules/editor/extensions/shared/media-upload-engine'
import { collectImageNodes, parseHtmlToSlice } from './paste-html-utils'

/**
 * Insert pasted HTML containing images and re-upload its embedded
 * `data:`/`blob:` images. Returns after every embedded image has been processed
 * (or the editor was destroyed).
 */
export async function processHTMLImages(
  html: string,
  editor: Editor,
  engine: MediaUploadEngine,
  options: MediaUploadOptions,
): Promise<void> {
  const view = editor.view
  const slice = parseHtmlToSlice(html, view.state.schema)

  // Capture the insertion range so we only scan the freshly-pasted region.
  const { from } = view.state.selection
  view.dispatch(view.state.tr.replaceSelection(slice))
  const insertedFrom = from
  const insertedTo = Math.min(
    view.state.selection.to,
    view.state.doc.content.size,
  )

  const pasted = collectImageNodes(
    view.state.doc,
    Math.min(insertedFrom, insertedTo),
    insertedTo,
  )
  if (pasted.length === 0) return

  // Fetch every embedded src into a File in parallel; drop ones that fail.
  const fetched = await Promise.all(
    pasted.map(
      async ({ src }): Promise<{ src: string; file: File } | null> => {
        try {
          const file = await dataUrlOrBlobToFile(src, 'pasted-image.png')
          return { src, file }
        } catch (error) {
          console.error('Failed to fetch pasted image:', error)
          return null
        }
      },
    ),
  )
  if (editor.isDestroyed) return

  // Replace each placeholder sequentially at its CURRENT position, relocated by
  // its data:/blob: src against the live doc.
  for (const entry of fetched) {
    if (entry === null) continue
    if (editor.isDestroyed) return
    const pos = engine.findNodeBySource(editor, entry.src)
    if (pos === null) continue
    await engine.processMultiple([entry.file], editor, pos, options)
  }
}
