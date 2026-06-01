import { computed, onBeforeUnmount, ref } from 'vue'
import type { Editor } from '@tiptap/core'
import {
  resolveUploadOptions,
  uploadFilesParallel,
} from '@molecules/editor/extensions/shared/media-upload-engine'
import type {
  ExistingImage,
  MediaUploadOptions,
  UploadResult,
} from '@molecules/editor/extensions/shared/upload-types'
import {
  existingItemId,
  fileItemId,
  filterImageFiles,
} from './image-group-utils'

/** A single grid item: either a staged file or an already-existing image. */
export interface ImageItem {
  type: 'file' | 'existing'
  id: string
  file?: File
  existing?: ExistingImage
  /** Caption for a not-yet-uploaded file (existing items carry it on `existing`). */
  alt?: string
}

export interface UseImageGroupDialogArgs {
  editor: () => Editor
  mode: () => 'new' | 'edit'
}

/** Build an `ImageItem` for a staged file (deterministic id). */
function makeFileItem(file: File): ImageItem {
  return { type: 'file', file, id: fileItemId(file) }
}

/** Build an `ImageItem` for an existing image (deterministic id). */
function makeExistingItem(existing: ExistingImage): ImageItem {
  return { type: 'existing', existing, id: existingItemId(existing) }
}

/**
 * State machine + upload orchestration for the image-group dialog.
 *
 * Owns the unified `images` array (files + existing), drag-reorder, caption
 * editing, the column count, and the parallel upload. Correctness contracts
 * (per PLAN cluster 4):
 *  - re-uploads the EDITED `images.value`, never the original `props.files`.
 *  - `try/finally` resets `uploading` even on throw.
 *  - partial failure preserves successful uploads (build from results), keeps
 *    the dialog open, and never silently drops files.
 *  - guards every editor touch with `isUnmounted` after the await.
 */
export function useImageGroupDialog(args: UseImageGroupDialogArgs) {
  const images = ref<ImageItem[]>([])
  const columns = ref(4)

  const uploading = ref(false)
  const uploadedCount = ref(0)
  const totalCount = ref(0)
  const uploadProgress = computed(() =>
    totalCount.value > 0
      ? Math.round((uploadedCount.value / totalCount.value) * 100)
      : 0,
  )
  const hasUploadError = ref(false)

  let isUnmounted = false
  onBeforeUnmount(() => {
    isUnmounted = true
  })

  function reset(opts: { files: File[]; existing?: ExistingImage[] }) {
    const existingItems = (opts.existing ?? []).map(makeExistingItem)
    const fileItems = opts.files.map(makeFileItem)
    images.value =
      args.mode() === 'edit'
        ? [...existingItems, ...fileItems]
        : fileItems
    uploadedCount.value = 0
    totalCount.value = 0
    hasUploadError.value = false
  }

  function fileItems(): File[] {
    return images.value
      .filter((item) => item.type === 'file' && item.file)
      .map((item) => item.file as File)
  }

  /**
   * Whether `files` is the same SET (by deterministic id) the dialog already
   * holds. `update:files` is a two-way bind, so our own emits echo back through
   * `props.files`; the dialog uses this to skip re-syncing on an echo (which
   * would otherwise wipe typed captions / the chosen column count).
   */
  function matchesFileSet(files: File[]): boolean {
    const incoming = new Set(files.map(fileItemId))
    const current = new Set(fileItems().map(fileItemId))
    if (incoming.size !== current.size) return false
    for (const id of incoming) if (!current.has(id)) return false
    return true
  }

  function addFiles(incoming: File[]): File[] {
    const newItems = filterImageFiles(incoming).map(makeFileItem)
    const known = new Set(images.value.map((item) => item.id))
    const unique = newItems.filter((item) => !known.has(item.id))
    images.value.push(...unique)
    return fileItems()
  }

  function removeImage(index: number): File[] {
    images.value.splice(index, 1)
    return fileItems()
  }

  function reorder(fromIndex: number, toIndex: number): File[] {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= images.value.length
    ) {
      return fileItems()
    }
    const [moved] = images.value.splice(fromIndex, 1)
    images.value.splice(toIndex, 0, moved)
    return fileItems()
  }

  function setCaption(index: number, caption: string) {
    const item = images.value[index]
    if (!item) return
    if (item.type === 'existing' && item.existing) {
      item.existing.alt = caption
    } else {
      item.alt = caption
    }
  }

  function resolveOptions(): MediaUploadOptions {
    const editor = args.editor()
    const extension = editor.extensionManager.extensions.find(
      (ext) => ext.name === 'imageGroup',
    )
    const uploadFunction = extension?.options?.uploadFunction as
      | MediaUploadOptions['uploadFunction']
      | undefined
    return resolveUploadOptions({ editor, uploadFunction })
  }

  /** Upload the staged files (in current UI order). Never throws. */
  async function uploadStagedFiles(files: File[]): Promise<UploadResult[]> {
    if (files.length === 0) return []
    const options = resolveOptions()
    uploading.value = true
    hasUploadError.value = false
    totalCount.value = files.length
    uploadedCount.value = 0
    try {
      return await uploadFilesParallel(files, options, {
        onProgress: (done) => {
          uploadedCount.value = done
        },
      })
    } finally {
      uploading.value = false
    }
  }

  /**
   * Build the final ordered image list, uploading staged files and mapping each
   * file to its result. On partial failure the successful images are kept (in
   * UI order) and `hasUploadError` flags the failures so the dialog stays open.
   */
  async function buildFinalImages(): Promise<ExistingImage[]> {
    const staged = fileItems()
    const results = await uploadStagedFiles(staged)

    const fileToImage = new Map<File, ExistingImage>()
    staged.forEach((file, index) => {
      const result = results[index]
      if (result?.success && result.file) {
        fileToImage.set(file, {
          src: result.file.file_url,
          alt: (result.file.file_name as string) ?? '',
        })
      } else if (result && !result.success) {
        hasUploadError.value = true
      }
    })

    // Build the final list from successes only, in current UI order. Failed
    // staged files are intentionally LEFT in `images.value` so they stay in the
    // grid for retry (PLAN: never silently drop; keep dialog open).
    const final: ExistingImage[] = []
    for (const item of images.value) {
      if (item.type === 'existing' && item.existing) {
        final.push(item.existing)
      } else if (item.file) {
        const uploaded = fileToImage.get(item.file)
        if (uploaded) {
          final.push({ src: uploaded.src, alt: item.alt ?? uploaded.alt })
        }
      }
    }
    return final
  }

  return {
    images,
    columns,
    uploading,
    uploadProgress,
    uploadedCount,
    totalCount,
    hasUploadError,
    isUnmounted: () => isUnmounted,
    reset,
    addFiles,
    removeImage,
    reorder,
    setCaption,
    fileItems,
    matchesFileSet,
    buildFinalImages,
  }
}
