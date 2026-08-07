/**
 * @vitest-environment jsdom
 *
 * Caption vs. alt text on the image node.
 *
 * The visible caption lives in `data-caption`; `alt` is the screen-reader
 * description only. The two used to share `alt`, which made every legacy image
 * whose `alt` held an upload filename render that filename as a caption.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { Editor } from '@tiptap/core'

let CommentKit: any

beforeEach(async () => {
  ;({ CommentKit } = await import('../../kits'))
})

function nodeAttrs(
  editor: Editor,
  typeName: string,
): Record<string, any> | null {
  let attrs: Record<string, any> | null = null
  editor.state.doc.descendants((node) => {
    if (node.type.name === typeName && !attrs) attrs = node.attrs
    return true
  })
  return attrs
}

function imageAttrs(editor: Editor): Record<string, any> | null {
  return nodeAttrs(editor, 'image')
}

function withEditor(html: string, run: (editor: Editor) => void): void {
  const editor = new Editor({ extensions: [CommentKit], content: html })
  try {
    run(editor)
  } finally {
    editor.destroy()
  }
}

describe('image caption attribute', () => {
  it('round-trips a caption through parseHTML and renderHTML', () => {
    withEditor(
      '<p><img src="/files/cat.png" data-caption="Our office cat"></p>',
      (editor) => {
        expect(imageAttrs(editor)?.caption).toBe('Our office cat')

        const html = editor.getHTML()
        expect(html).toContain('data-caption="Our office cat"')

        // Reload the serialized HTML: the caption must survive a second pass.
        withEditor(html, (reloaded) => {
          expect(imageAttrs(reloaded)?.caption).toBe('Our office cat')
        })
      },
    )
  })

  it('does NOT promote a legacy alt to a caption', () => {
    // The shape of real imported content: an upload filename parked in `alt`.
    withEditor(
      '<p><img src="/files/shot.png" alt="Screenshot 2020-05-09 11.04.00"></p>',
      (editor) => {
        const attrs = imageAttrs(editor)
        expect(attrs?.caption).toBeNull()
        expect(attrs?.alt).toBe('Screenshot 2020-05-09 11.04.00')

        const html = editor.getHTML()
        expect(html).toContain('alt="Screenshot 2020-05-09 11.04.00"')
        expect(html).not.toContain('data-caption')
      },
    )
  })

  it('treats an empty data-caption as no caption, without falling back to alt', () => {
    withEditor(
      '<p><img src="/files/shot.png" alt=":slight_smile:" data-caption=""></p>',
      (editor) => {
        const attrs = imageAttrs(editor)
        expect(attrs?.caption).toBeNull()
        expect(attrs?.alt).toBe(':slight_smile:')
      },
    )
  })

  it('keeps a caption and an alt description apart on the same image', () => {
    withEditor(
      '<p><img src="/files/chart.png" alt="Bar chart of weekly signups" data-caption="Signups are up"></p>',
      (editor) => {
        const attrs = imageAttrs(editor)
        expect(attrs?.caption).toBe('Signups are up')
        expect(attrs?.alt).toBe('Bar chart of weekly signups')

        const html = editor.getHTML()
        expect(html).toContain('data-caption="Signups are up"')
        expect(html).toContain('alt="Bar chart of weekly signups"')
      },
    )
  })

  it('sets caption and alt independently, neither overwriting the other', () => {
    withEditor('<p><img src="/files/chart.png"></p>', (editor) => {
      const update = (attrs: Record<string, unknown>) => {
        editor.commands.setNodeSelection(1)
        editor.commands.updateAttributes('image', attrs)
      }

      update({ caption: 'A caption' })
      expect(imageAttrs(editor)?.caption).toBe('A caption')
      expect(imageAttrs(editor)?.alt).toBeNull()

      update({ alt: 'A description' })
      expect(imageAttrs(editor)?.alt).toBe('A description')
      expect(imageAttrs(editor)?.caption).toBe('A caption')

      // Clearing one leaves the other in place.
      update({ caption: null })
      expect(imageAttrs(editor)?.caption).toBeNull()
      expect(imageAttrs(editor)?.alt).toBe('A description')
    })
  })

  it('carries a caption through the setImage command', () => {
    withEditor('<p></p>', (editor) => {
      editor.commands.setImage({
        src: '/files/dog.png',
        caption: 'Good dog',
        alt: 'A dog wearing sunglasses',
      })
      const attrs = imageAttrs(editor)
      expect(attrs?.caption).toBe('Good dog')
      expect(attrs?.alt).toBe('A dog wearing sunglasses')
    })
  })

  it('still parses the plain img attributes it always did', () => {
    withEditor(
      '<p><img src="/files/x.png" width="320" height="180" title="a title" data-align="right"></p>',
      (editor) => {
        const attrs = imageAttrs(editor)
        expect(attrs?.src).toBe('/files/x.png')
        expect(attrs?.width).toBe(320)
        expect(attrs?.height).toBe(180)
        expect(attrs?.title).toBe('a title')
        expect(attrs?.align).toBe('right')
      },
    )
  })
})

describe('video caption attribute', () => {
  it('round-trips a caption and keeps alt separate', () => {
    withEditor(
      '<p><video src="/files/clip.mp4" alt="A short clip" data-caption="Release demo"></video></p>',
      (editor) => {
        const attrs = nodeAttrs(editor, 'video')
        expect(attrs?.caption).toBe('Release demo')
        expect(attrs?.alt).toBe('A short clip')
        expect(editor.getHTML()).toContain('data-caption="Release demo"')
      },
    )
  })
})
