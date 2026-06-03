/**
 * Type surface for the media upload engine.
 *
 * Split out of `media-upload-engine.ts` to keep that module ≤300 lines. The
 * engine re-exports every public type from here, so the canonical import path
 * for consumers remains `#molecules/editor/extensions/shared/media-upload-engine`
 * (per the conventions import map §2).
 */
import type { Editor } from '@tiptap/core'
import type { UploadedFile as FrappeUploadedFile } from '#utils/useFileUpload'
import type { MediaDimensions } from '#molecules/editor/extensions/shared/media-dimensions'

/**
 * Programmatic upload commands, declared once in a dedicated `mediaUpload`
 * group (tiptap flattens every group into `RawCommands`, so callers still use
 * the flat `editor.commands.uploadVideoFiles`).
 *
 * Kept out of the `video` group only for symmetry with the legacy-conflict
 * rationale on images: the legacy TextEditor augments `Commands.image`, so a
 * divergent second declaration of a shared group is a TS2717 error. A separate
 * group sidesteps that.
 */
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mediaUpload: {
      /** Upload and insert already-provided video files (e.g. from a drop). */
      uploadVideoFiles: (files: File[], pos?: number | null) => ReturnType
    }
  }
}

/** Result of a successful upload. Must carry a `file_url`. */
export interface UploadedFile extends Partial<FrappeUploadedFile> {
  file_url: string
  width?: number | null
  height?: number | null
}

/**
 * Effective upload options. Mirrors the legacy extension option shape: the only
 * field the pipeline reads is `uploadFunction`; `HTMLAttributes` and any extra
 * keys are carried through untouched.
 */
export interface MediaUploadOptions {
  uploadFunction?: ((file: File) => Promise<UploadedFile>) | null
  HTMLAttributes?: Record<string, unknown>
  [k: string]: unknown
}

/** Outcome of a no-doc-mutation single-file upload. */
export interface UploadResult {
  success: boolean
  file?: UploadedFile
  error?: Error
}

/** Per-node configuration injected into the generic pipeline. */
export interface MediaUploadConfig {
  /** Schema node name this engine inserts/updates. */
  nodeName: 'image' | 'video'
  /** Intrinsic-dimension probe (image: `<img>`, video: `<video>` metadata). */
  probeDimensions: (src: string) => Promise<MediaDimensions>
  /** MIME filter for drop/paste, e.g. `/image/i` or `/video/i`. */
  accept: RegExp
  /** Whether to keep a base64 preview in `localFileMap` (image: true, video: false). */
  storeBase64: boolean
}

/** Insert vs. replace placement of the loading placeholder node. */
export type InsertMode = 'insert' | 'replace'

/**
 * Public engine surface (one instance per node type).
 *
 * Every method takes the host `editor`, NOT a captured `EditorView`: the engine
 * runs across `await`s (base64, dimension probe, the upload itself), and a host
 * such as gameplan may REPLACE `editor.view` mid-flight. A captured view goes
 * stale but is not `isDestroyed`, so dispatching its transaction into the live
 * editor's new doc throws "Applying a mismatched transaction". Resolving
 * `editor.view` fresh at each dispatch site (mirroring `media-plugin`'s
 * `appendTransaction`) keeps every write aimed at the current view.
 */
export interface MediaUploadEngine {
  /** Upload a file, replacing the current selection with the result. */
  uploadOne(
    file: File,
    editor: Editor,
    options: MediaUploadOptions,
  ): Promise<void>
  /** Upload a file, replacing the node at `pos`. */
  uploadReplace(
    file: File,
    editor: Editor,
    pos: number,
    options: MediaUploadOptions,
  ): Promise<void>
  /** Re-run an upload for the failed node at `pos` using its staged file. */
  reupload(
    editor: Editor,
    pos: number,
    options: MediaUploadOptions,
  ): Promise<void>
  /** Doc-mutating multi-upload (drop/paste). Sequences via uploadId — no timers. */
  processMultiple(
    files: File[],
    editor: Editor,
    pos: number | null,
    options: MediaUploadOptions,
  ): Promise<void>
  /** Resolve the insertion position (selection head) for a fresh upload. */
  findInsertPosition(editor: Editor): number
  /** Back-fill width/height on the node at `pos` (no-op if already sized). */
  updateNodeWithDimensions(
    editor: Editor,
    pos: number,
    dims: MediaDimensions,
  ): void
  /** Find a node by `src` (or by `uploadId` when provided). */
  findNodeBySource(
    editor: Editor,
    src: string,
    uploadId?: string,
  ): number | null
}
