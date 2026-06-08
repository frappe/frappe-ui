/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi } from 'vitest'
import { SlashCommands } from './slash-commands-extension'

describe('SlashCommands', () => {
  it('opens the link editor for the Link command', () => {
    const chain = {
      focus: vi.fn(() => chain),
      deleteRange: vi.fn(() => chain),
      insertContent: vi.fn(() => chain),
      setTextSelection: vi.fn(() => chain),
      run: vi.fn(() => true),
    }
    const editor = {
      schema: { marks: { link: {} }, nodes: {} },
      commands: { openLinkEditor: vi.fn() },
      chain: vi.fn(() => chain),
    }
    const options = (SlashCommands as any).config.addOptions.call({})
    const [item] = options.suggestion.items({ query: 'link', editor })

    options.suggestion.command({
      editor,
      range: { from: 3, to: 8 },
      props: item,
    })

    expect(chain.deleteRange).toHaveBeenCalledWith({ from: 3, to: 8 })
    expect(chain.insertContent).toHaveBeenCalledWith('Link')
    expect(chain.setTextSelection).toHaveBeenCalledWith({ from: 3, to: 7 })
    expect(editor.commands.openLinkEditor).toHaveBeenCalledWith({
      startInEdit: true,
    })
  })
})
