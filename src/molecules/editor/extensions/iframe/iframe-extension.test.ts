/**
 * @vitest-environment jsdom
 */

import { describe, expect, it, vi } from 'vitest'
import { buildIframeCommands } from './iframe-commands'
import { createIframePastePlugin } from './iframe-paste-handler'

function commandContext() {
  return {
    commands: {
      insertContent: vi.fn(() => true),
      setIframe: vi.fn(() => true),
    },
    editor: { view: { dom: { clientWidth: 800 } } },
  } as any
}

function pasteView() {
  const node = { attrs: {} }
  return {
    isDestroyed: false,
    dom: { clientWidth: 800 },
    dispatch: vi.fn(),
    state: {
      schema: {
        nodes: {
          iframe: {
            create: vi.fn((attrs) => ({ ...node, attrs })),
          },
        },
      },
      tr: {
        replaceSelectionWith: vi.fn(() => 'tr'),
      },
    },
  } as any
}

describe('iframe extension allowlist threading', () => {
  it('uses the configured allowlist in insert commands', () => {
    const commands = buildIframeCommands('iframe', ['example.com'])
    const allowed = commandContext()
    const blocked = commandContext()

    expect(commands.setIframe?.({ src: 'https://example.com/embed' })(allowed)).toBe(
      true,
    )
    expect(
      commands.setIframe?.({ src: 'https://youtube.com/watch?v=abc' })(blocked),
    ).toBe(false)
    expect(allowed.commands.insertContent).toHaveBeenCalled()
    expect(blocked.commands.insertContent).not.toHaveBeenCalled()
  })

  it('uses the configured allowlist in paste handling', () => {
    const plugin = createIframePastePlugin('iframe', ['example.com'])
    const view = pasteView()
    const event = {
      clipboardData: {
        getData: vi.fn((type: string) =>
          type === 'text/plain' ? 'https://youtube.com/watch?v=abc' : '',
        ),
      },
    } as any

    expect(plugin.props.handlePaste?.call(plugin, view, event, null as any)).toBe(
      false,
    )
    expect(view.dispatch).not.toHaveBeenCalled()
  })
})
