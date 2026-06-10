/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi } from 'vitest'

vi.mock('#molecules/editor/extensions/shared/node-view', () => ({
  dispatchIfAlive: vi.fn(),
}))

import { createMediaPlugin } from '#molecules/editor/extensions/shared/media-plugin'
import { dispatchIfAlive } from '#molecules/editor/extensions/shared/node-view'
import type { MediaUploadConfig } from '#molecules/editor/extensions/shared/media-upload-types'

function mediaNode(src: string, attrs: Record<string, unknown> = {}) {
  return {
    type: { name: 'image' },
    attrs: { src, ...attrs },
  }
}

describe('media plugin dimension backfill', () => {
  it('does not write stale dimensions when the node at the captured position changed source', async () => {
    const inserted = mediaNode('/files/old.png')
    const live = mediaNode('/files/new.png')
    const config: MediaUploadConfig = {
      nodeName: 'image',
      accept: /image/i,
      storeBase64: true,
      probeDimensions: vi.fn(async () => ({ width: 100, height: 50 })),
    }
    const view = {
      state: {
        doc: { nodeAt: () => live },
        tr: { setNodeMarkup: vi.fn() },
      },
    }
    const plugin = createMediaPlugin({} as never, config, {
      editor: { view } as never,
      options: {},
    })
    const newState = {
      doc: {
        descendants: (visit: (node: unknown, pos: number) => void) => {
          visit(inserted, 5)
        },
        nodeAt: () => inserted,
      },
    }

    ;(plugin as any).spec.appendTransaction(
      [{ docChanged: true }],
      {} as never,
      newState,
    )
    await Promise.resolve()

    expect(dispatchIfAlive).not.toHaveBeenCalled()
  })
})
