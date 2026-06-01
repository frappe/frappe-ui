/**
 * @vitest-environment jsdom
 *
 * Regression test for paste-HTML-with-image not uploading (handoff fix #2).
 *
 * `media-plugin.appendTransaction` back-fills dimensions on a freshly-inserted
 * `data:` image via `setNodeMarkup`, producing a NEW node object during the
 * fetch `await`. The old controller located the node by identity (`node ===
 * target`), so the lookup returned null and the upload was silently skipped.
 *
 * The fix relocates by the image's `data:`/`blob:` `src` (via the engine's
 * `findNodeBySource`) — which survives node-object replacement AND a host that
 * round-trips content through HTML (a marker attribute would not, since it is
 * not serialized). This test pins that contract: the engine is handed the
 * position returned by the src lookup.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

const DATA_SRC = 'data:image/png;base64,AAAA'

vi.mock('./paste-html-utils', () => ({
  parseHtmlToSlice: vi.fn(() => ({})),
  collectImageNodes: vi.fn(() => [
    { node: { type: { name: 'image' } }, pos: 5, src: DATA_SRC },
  ]),
}))
vi.mock('@molecules/editor/extensions/shared/media-upload-engine', () => ({
  dataUrlOrBlobToFile: vi.fn(
    async () => new File(['x'], 'p.png', { type: 'image/png' }),
  ),
}))

import { processHTMLImages } from './paste-image-controller'

function makeEditor() {
  const view = {
    dispatch: vi.fn(),
    state: {
      schema: {},
      selection: { from: 0, to: 3 },
      get tr() {
        return { replaceSelection: vi.fn() }
      },
      doc: { content: { size: 100 } },
    },
  }
  return {
    get view() {
      return view
    },
    isDestroyed: false,
  }
}

describe('processHTMLImages — relocate by data: src', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('uploads at the position the engine resolves by src', async () => {
    const editor = makeEditor()
    // The resolved position (7) differs from the scan position (5) on purpose: a
    // pass means the engine was handed THIS value, i.e. it relocated by src.
    const engine = {
      findNodeBySource: vi.fn(() => 7),
      processMultiple: vi.fn(async () => {}),
    }

    await processHTMLImages(
      'irrelevant',
      editor as never,
      engine as never,
      { uploadFunction: vi.fn() } as never,
    )

    // It relocated by the data: src (not node identity, not a marker attr).
    expect(engine.findNodeBySource).toHaveBeenCalledWith(editor, DATA_SRC)

    // The engine received the relocated position (7), not the scan position (5).
    expect(engine.processMultiple).toHaveBeenCalledTimes(1)
    const call = engine.processMultiple.mock.calls[0] as unknown[]
    expect(call[0]).toHaveLength(1)
    expect(call[1]).toBe(editor)
    expect(call[2]).toBe(7)
  })
})
