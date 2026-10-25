/**
 * @vitest-environment jsdom
 *
 * ProseMirror's `dragstart` handler is not an edit handler, so it runs on a
 * read-only editor too and replaces the drag data with its own serialized
 * slice. Dragging a link out of a post you can only read would then carry the
 * slice instead of the browser's URL.
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { CommentKit } from './kits'
import { cleanupMounted, mount } from './test-helpers'
import type { Editor as TiptapEditor } from './useEditor'

afterEach(cleanupMounted)

/** jsdom has no DataTransfer, so the stub records what ProseMirror writes. */
function dragStart(editor: TiptapEditor) {
  const dataTransfer = {
    files: [],
    setData: vi.fn(),
    clearData: vi.fn(),
  }
  const event = Object.assign(
    new Event('dragstart', { bubbles: true, cancelable: true }),
    { dataTransfer },
  )
  editor.view.dom.dispatchEvent(event)
  return dataTransfer
}

describe('dragstart', () => {
  it('keeps the native drag data in a read-only editor', () => {
    const editor = mount({
      extensions: [CommentKit],
      editable: false,
    }).getEditor()

    const dataTransfer = dragStart(editor)

    expect(dataTransfer.clearData).not.toHaveBeenCalled()
    expect(dataTransfer.setData).not.toHaveBeenCalled()
  })

  it('lets ProseMirror write the drag data in an editable editor', () => {
    const editor = mount({ extensions: [CommentKit] }).getEditor()

    const dataTransfer = dragStart(editor)

    expect(dataTransfer.setData).toHaveBeenCalledWith(
      'text/html',
      expect.any(String),
    )
  })
})
