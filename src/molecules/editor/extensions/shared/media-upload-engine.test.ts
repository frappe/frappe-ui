/**
 * @vitest-environment jsdom
 *
 * Regression test for the "Try again" reupload crash (handoff fix #1).
 *
 * The engine runs across several `await`s (base64 → dimension probe → the upload
 * itself). A host such as gameplan may REPLACE `editor.view` mid-flight. If the
 * engine captured the view up front, its trailing dispatch would target a stale
 * view whose `dispatchTransaction` routes into the live editor's new doc →
 * `RangeError: Applying a mismatched transaction`.
 *
 * These tests pin the fix: every dispatch site resolves `editor.view` FRESH, and
 * a destroyed editor short-circuits without dispatching.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@utils/file-to-base64', () => ({
  default: vi.fn(async () => 'data:image/png;base64,AAAA'),
}))
vi.mock('@molecules/editor/extensions/shared/url-safety', () => ({
  isSafeUrl: () => true,
}))
vi.mock('@molecules/editor/extensions/shared/upload-id', () => ({
  createUploadId: () => 'uid-1',
}))
vi.mock('@molecules/editor/extensions/shared/media-upload-state', () => ({
  setLocalFile: vi.fn(),
  getLocalFile: vi.fn(() => ({ file: new File(['x'], 'x.png') })),
  deleteLocalFile: vi.fn(),
}))
vi.mock('@molecules/editor/extensions/shared/media-node-ops', () => ({
  insertPlaceholder: vi.fn(),
  applyUploadSuccess: vi.fn(),
  applyUploadError: vi.fn(),
  backfillDimensions: vi.fn(),
  findNodeBySource: vi.fn(() => 0),
}))

import { createMediaUploadEngine } from '@molecules/editor/extensions/shared/media-upload-engine'
import fileToBase64 from '@utils/file-to-base64'
import { setLocalFile } from '@molecules/editor/extensions/shared/media-upload-state'
import {
  insertPlaceholder,
  applyUploadSuccess,
  applyUploadError,
} from '@molecules/editor/extensions/shared/media-node-ops'
import type { MediaUploadConfig } from '@molecules/editor/extensions/shared/media-upload-types'

/** A throwaway stand-in for an EditorView (only identity matters to the test). */
function makeView(): { isDestroyed: boolean; state: unknown } {
  return {
    isDestroyed: false,
    state: { doc: { nodeAt: () => null }, selection: { from: 0 } },
  }
}

const config: MediaUploadConfig = {
  nodeName: 'image',
  accept: /image/i,
  storeBase64: true,
  probeDimensions: async () => ({ width: 10, height: 10 }),
}

describe('media upload engine — live editor.view', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('dispatches against the CURRENT editor.view, not the one captured at call time', async () => {
    const viewA = makeView()
    const viewB = makeView()
    let current = viewA

    let resolveUpload: (() => void) | undefined
    const uploadFunction = vi.fn(
      () =>
        new Promise<{ file_url: string }>((resolve) => {
          resolveUpload = () => resolve({ file_url: '/files/x.png' })
        }),
    )

    const editor = {
      get view() {
        return current
      },
      isDestroyed: false,
    } as never

    const engine = createMediaUploadEngine(config)
    const file = new File(['x'], 'x.png', { type: 'image/png' })
    const done = engine.uploadOne(file, editor, { uploadFunction })

    // The placeholder is inserted before the upload resolves — against viewA.
    await vi.waitFor(() => expect(insertPlaceholder).toHaveBeenCalled())
    expect(insertPlaceholder).toHaveBeenCalledWith(
      viewA,
      'image',
      null,
      'replace',
      'uid-1',
      expect.anything(),
    )

    // Host swaps the editor's view while the upload is in flight.
    current = viewB
    resolveUpload?.()
    await done

    // The success write-back must target the NEW live view, not the captured one.
    expect(applyUploadSuccess).toHaveBeenCalledWith(
      viewB,
      'image',
      'uid-1',
      expect.objectContaining({ file_url: '/files/x.png' }),
    )
    expect(applyUploadError).not.toHaveBeenCalled()
  })

  it('does not dispatch when the editor is destroyed mid-upload', async () => {
    let resolveUpload: (() => void) | undefined
    const uploadFunction = vi.fn(
      () =>
        new Promise<{ file_url: string }>((resolve) => {
          resolveUpload = () => resolve({ file_url: '/files/x.png' })
        }),
    )

    const editor = {
      view: makeView(),
      isDestroyed: false,
    } as never

    const engine = createMediaUploadEngine(config)
    const file = new File(['x'], 'x.png', { type: 'image/png' })
    const done = engine.uploadOne(file, editor, { uploadFunction })

    await vi.waitFor(() => expect(insertPlaceholder).toHaveBeenCalled())
    ;(editor as { isDestroyed: boolean }).isDestroyed = true
    resolveUpload?.()
    await done

    expect(applyUploadSuccess).not.toHaveBeenCalled()
    expect(applyUploadError).not.toHaveBeenCalled()
  })

  it('does not base64-encode files when the media config stores only the File', async () => {
    const createObjectURL = vi.fn(() => 'blob:video')
    const revokeObjectURL = vi.fn()
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL })

    const engine = createMediaUploadEngine({
      ...config,
      nodeName: 'video',
      storeBase64: false,
      probeDimensions: async (src) => {
        expect(src).toBe('blob:video')
        return { width: 640, height: 360 }
      },
    })
    const editor = { view: makeView(), isDestroyed: false } as never
    const file = new File(['x'], 'x.mp4', { type: 'video/mp4' })

    await engine.uploadOne(file, editor, {
      uploadFunction: async () => ({ file_url: '/files/x.mp4' }),
    })

    expect(fileToBase64).not.toHaveBeenCalled()
    expect(createObjectURL).toHaveBeenCalledWith(file)
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:video')
    expect(setLocalFile).toHaveBeenCalledWith('uid-1', { file })
  })
})
