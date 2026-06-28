/**
 * @vitest-environment jsdom
 *
 * Round-trips the SERIALIZED attachment HTML (what the server stores) back
 * through a CommentKit editor and asserts it re-parses as an `attachment` node,
 * not a plain link. Reproduces "after submit the chip becomes a simple <a>".
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { Editor } from '@tiptap/core'

let CommentKit: any

beforeEach(async () => {
  ;({ CommentKit } = await import('../../kits'))
})

function nodesOf(editor: Editor): string[] {
  const out: string[] = []
  editor.state.doc.descendants((n) => {
    out.push(n.type.name)
    return true
  })
  return out
}

describe('attachment HTML round-trip (CommentKit)', () => {
  it('re-parses a serialized attachment chip as an attachment node', () => {
    const editor = new Editor({ extensions: [CommentKit] })
    // The shape the attachment node serializes to (and the server keeps).
    editor.commands.setContent(
      `<p><a data-attachment href="/files/report.pdf" data-file-name="report.pdf" data-file-size="1234" data-mime-type="application/pdf" download="report.pdf">report.pdf</a></p>`,
    )

    const names = nodesOf(editor)
    expect(names, 'should contain an attachment node').toContain('attachment')

    const json = editor.getJSON()
    const flat: any[] = []
    const walk = (n: any) => {
      flat.push(n)
      ;(n.content ?? []).forEach(walk)
    }
    walk(json)
    const node = flat.find((n) => n.type === 'attachment')
    expect(node?.attrs.src).toBe('/files/report.pdf')
    expect(node?.attrs.fileName).toBe('report.pdf')

    editor.destroy()
  })
})
