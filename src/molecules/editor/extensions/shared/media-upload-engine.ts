/**
 * The DRY backbone for image + video (+ content-paste) uploads.
 *
 * A single generic pipeline, parameterized by a {@link MediaUploadConfig} that
 * captures the only per-node differences: the node name, the MIME filter, the
 * intrinsic-dimension probe, and whether to keep a base64 preview. The engine
 * owns the loading-placeholder lifecycle, the upload promise chain, and the
 * write-back into the document.
 *
 * Async safety (conventions §0.6): every `view.dispatch` that runs AFTER an
 * `await` is routed through `dispatchIfAlive`, so a destroyed view is never
 * dispatched into. The staged local file is cleaned up via `deleteLocalFile`
 * ONLY on the success path; on a terminal upload error the entry is kept so
 * `reupload` ("Try again") can re-read it.
 *
 * This module also owns `resolveUploadOptions` (relocated from the legacy
 * `image-extension.ts`) as the single source of truth for resolving the
 * effective upload function. Pure dimension probes live in `media-dimensions.ts`
 * and the ProseMirror plugin in `media-plugin.ts` to keep this file ≤300 lines.
 */
import type { Editor } from '@tiptap/core'
import fileToBase64 from '#utils/file-to-base64'
import { fileSizeLimitMessage } from '#utils/fileSize'
import { isSafeUrl } from '#molecules/editor/extensions/shared/url-safety'
import { findNodeByUploadId } from '#molecules/editor/extensions/shared/node-view'
import {
  deleteLocalFile,
  deleteUploadProgress,
  getLocalFile,
  setUploadProgress,
  setLocalFile,
  updateLocalFile,
  updateUploadProgress,
} from '#molecules/editor/extensions/shared/media-upload-state'
import { createUploadId } from '#molecules/editor/extensions/shared/upload-id'
import {
  applyUploadError,
  applyUploadSuccess,
  backfillDimensions,
  findNodeBySource,
  insertPlaceholder,
  removeNodeByUploadId,
  type OptionalDimensions,
} from '#molecules/editor/extensions/shared/media-node-ops'
import type {
  InsertMode,
  MediaUploadConfig,
  MediaUploadEngine,
  MediaUploadOptions,
  MediaUploadRequestOptions,
  UploadedFile,
  UploadResult,
} from '#molecules/editor/extensions/shared/media-upload-types'

export type {
  MediaUploadConfig,
  MediaUploadEngine,
  MediaUploadOptions,
  MediaUploadRequestOptions,
  UploadFunction,
  UploadedFile,
  UploadResult,
} from '#molecules/editor/extensions/shared/media-upload-types'

/**
 * Resolve the effective upload options. A directly-configured `uploadFunction`
 * wins; otherwise fall back to the shared `upload` storage set via
 * `useEditor({ uploadFunction })`. SINGLE SOURCE for both image and video.
 *
 * (TipTap v3 freezes `extension.options` into an immutable getter, so it cannot
 * be mutated after construction — the only reliable read is at use-time from the
 * shared storage.)
 */
export function resolveUploadOptions(
  raw: Partial<MediaUploadOptions> & {
    editor?: { storage?: unknown } | null
  } = {},
): MediaUploadOptions {
  const { editor, ...options } = raw
  const storage = editor?.storage as Record<string, unknown> | undefined
  const uploadStorage = storage?.upload as
    | { uploadFunction?: MediaUploadOptions['uploadFunction'] }
    | undefined
  return {
    ...options,
    uploadFunction:
      options.uploadFunction ?? uploadStorage?.uploadFunction ?? null,
  }
}

/**
 * Single-file upload primitive with no document mutation. For dialogs that stage
 * results (ImageGroup) and the content-paste path. Throws on a missing
 * `uploadFunction` or an unsafe/empty returned `file_url`.
 */
export async function uploadFile(
  file: File,
  options: MediaUploadOptions,
  requestOptions?: MediaUploadRequestOptions,
): Promise<UploadedFile> {
  if (!options.uploadFunction) {
    throw new Error('uploadFunction option is not provided')
  }
  const uploaded = await options.uploadFunction(file, requestOptions)
  if (
    !uploaded?.file_url ||
    !isSafeUrl(uploaded.file_url, { base: window.location.origin })
  ) {
    throw new Error('Upload returned no file URL')
  }
  return uploaded
}

/** Parallel single-file uploads, no doc mutation. For ImageGroup + content-paste. */
export async function uploadFilesParallel(
  files: File[],
  options: MediaUploadOptions,
  hooks?: { onProgress?: (done: number, total: number) => void },
): Promise<UploadResult[]> {
  const total = files.length
  let done = 0
  return Promise.all(
    files.map(async (file): Promise<UploadResult> => {
      try {
        const uploaded = await uploadFile(file, options)
        return { success: true, file: uploaded }
      } catch (error) {
        return { success: false, error: error as Error }
      } finally {
        done += 1
        hooks?.onProgress?.(done, total)
      }
    }),
  )
}

/** Convert a `data:`/`blob:` src into a `File` (content-paste image-in-HTML path). */
export async function dataUrlOrBlobToFile(
  src: string,
  filename: string,
): Promise<File> {
  const response = await fetch(src)
  const blob = await response.blob()
  return new File([blob], filename, {
    type: blob.type || 'application/octet-stream',
  })
}

/** Build a media-upload engine for one node type. */
export function createMediaUploadEngine(
  config: MediaUploadConfig,
): MediaUploadEngine {
  const { nodeName, probeDimensions, storeBase64 } = config

  function findInsertPosition(editor: Editor): number {
    return editor.view.state.selection.from
  }

  /** Probe dimensions, swallowing failures into nulls (best-effort sizing). */
  async function probeOrNull(src: string): Promise<OptionalDimensions> {
    try {
      return await probeDimensions(src)
    } catch {
      return { width: null, height: null }
    }
  }

  /**
   * Core upload run: stage file -> probe -> placeholder -> upload -> write-back.
   * Returns the uploadId so multi-upload sequencing can anchor the next insert.
   *
   * `editor.view` is resolved FRESH at every dispatch site (never captured up
   * front): the run spans several `await`s, and the host may swap `editor.view`
   * in the meantime. Dispatching a captured, now-stale view's transaction into
   * the editor's new doc throws "Applying a mismatched transaction".
   */
  async function run(
    file: File,
    editor: Editor,
    pos: number | null | undefined,
    mode: InsertMode,
    options: MediaUploadOptions,
    placeholderAttrs: Record<string, unknown> = {},
  ): Promise<string | null> {
    if (!options.uploadFunction) {
      console.error('uploadFunction option is not provided')
      return null
    }
    const uploadId = createUploadId()
    const abortController = new AbortController()
    setUploadProgress(uploadId, {
      loaded: 0,
      total: file.size,
      percent: 0,
      abort: () => abortController.abort(),
    })
    try {
      // Reject over-limit files before the expensive staging work: no base64
      // encode, no dimension probe — just an error placeholder with the staged
      // file kept so "Try again" / "Choose another" still work.
      const validationError = fileSizeLimitMessage(file)
      if (validationError) {
        setLocalFile(uploadId, { file })
        if (editor.isDestroyed) {
          deleteLocalFile(uploadId)
          deleteUploadProgress(uploadId)
          return uploadId
        }
        insertPlaceholder(
          editor.view,
          nodeName,
          pos,
          mode,
          uploadId,
          { width: null, height: null },
          placeholderAttrs,
        )
        applyUploadError(editor.view, nodeName, uploadId, validationError)
        return uploadId
      }

      const b64 = storeBase64 ? await fileToBase64(file) : null
      const probeSrc = b64 ?? URL.createObjectURL(file)
      setLocalFile(uploadId, b64 ? { b64, file } : { file })
      let dims: OptionalDimensions
      try {
        dims = await probeOrNull(probeSrc)
      } finally {
        if (!b64) URL.revokeObjectURL(probeSrc)
      }
      if (dims.poster) updateLocalFile(uploadId, { poster: dims.poster })
      if (editor.isDestroyed) {
        deleteLocalFile(uploadId)
        deleteUploadProgress(uploadId)
        return uploadId
      }
      insertPlaceholder(
        editor.view,
        nodeName,
        pos,
        mode,
        uploadId,
        dims,
        placeholderAttrs,
      )

      const uploaded = await options.uploadFunction(file, {
        signal: abortController.signal,
        onProgress: (progress) => {
          updateUploadProgress(uploadId, {
            ...progress,
            abort: () => abortController.abort(),
          })
        },
      })
      if (editor.isDestroyed) {
        deleteLocalFile(uploadId)
        deleteUploadProgress(uploadId)
        return uploadId
      }
      if (
        !uploaded?.file_url ||
        !isSafeUrl(uploaded.file_url, { base: window.location.origin })
      ) {
        applyUploadError(
          editor.view,
          nodeName,
          uploadId,
          'Upload returned no file URL',
        )
        return uploadId
      }
      applyUploadSuccess(editor.view, nodeName, uploadId, uploaded)
      // Only drop the staged file on success. On a terminal error the entry must
      // survive so `reupload` ("Try again") can re-read it.
      deleteLocalFile(uploadId)
    } catch (error) {
      if (abortController.signal.aborted) {
        if (!editor.isDestroyed) {
          removeNodeByUploadId(editor.view, nodeName, uploadId)
        }
        deleteLocalFile(uploadId)
        deleteUploadProgress(uploadId)
        return uploadId
      }
      const message =
        (error as Error)?.message || `Failed to upload ${nodeName}`
      if (!editor.isDestroyed) {
        applyUploadError(editor.view, nodeName, uploadId, message)
      }
    } finally {
      if (!abortController.signal.aborted) {
        deleteUploadProgress(uploadId)
      }
    }
    return uploadId
  }

  async function uploadOne(
    file: File,
    editor: Editor,
    options: MediaUploadOptions,
  ): Promise<void> {
    await run(file, editor, null, 'replace', options)
  }

  async function uploadReplace(
    file: File,
    editor: Editor,
    pos: number,
    options: MediaUploadOptions,
    attrs: Record<string, unknown> = {},
  ): Promise<void> {
    await run(file, editor, pos, 'replace', options, attrs)
  }

  async function reupload(
    editor: Editor,
    pos: number,
    options: MediaUploadOptions,
  ): Promise<void> {
    const node = editor.view.state.doc.nodeAt(pos)
    const uploadId = node?.attrs.uploadId as string | undefined
    const entry = uploadId ? getLocalFile(uploadId) : undefined
    if (!uploadId || !entry) {
      console.error(`reupload: no staged file for node at ${pos}`)
      return
    }
    const replacementUploadId = await run(
      entry.file,
      editor,
      pos,
      'replace',
      options,
      node?.attrs ?? {},
    )
    if (replacementUploadId) {
      deleteLocalFile(uploadId)
    }
  }

  /**
   * Doc-mutating multi-upload for drop/paste. Uploads sequentially, anchoring
   * each insert immediately after the previous placeholder via its uploadId —
   * no `setTimeout`, no re-scan-by-src. Reads `editor.view` fresh each iteration.
   */
  async function processMultiple(
    files: File[],
    editor: Editor,
    pos: number | null,
    options: MediaUploadOptions,
  ): Promise<void> {
    if (files.length === 1) {
      await run(files[0], editor, pos, 'replace', options)
      return
    }
    let lastUploadId: string | null = null
    for (const file of files) {
      let insertPos = pos
      if (lastUploadId) {
        const prevPos = findNodeByUploadId(editor.view, nodeName, lastUploadId)
        if (prevPos !== null) {
          const prevNode = editor.view.state.doc.nodeAt(prevPos)
          insertPos = prevPos + (prevNode?.nodeSize ?? 1)
        }
      }
      lastUploadId = await run(file, editor, insertPos, 'insert', options)
    }
  }

  return {
    uploadOne,
    uploadReplace,
    reupload,
    processMultiple,
    findInsertPosition,
    updateNodeWithDimensions: (editor, pos, dims) =>
      backfillDimensions(editor.view, nodeName, pos, dims),
    findNodeBySource: (editor, src, uploadId) =>
      findNodeBySource(editor.view, nodeName, src, uploadId),
  }
}
