/**
 * @vitest-environment jsdom
 *
 * `frappe-ui/editor` used to re-export `extensions.ts` and `menu.ts` with
 * `export *`, which published whatever those files exported next
 * (PHILOSOPHY.md, P15). The barrel names them one by one now, so a new
 * internal helper stays internal until someone adds it here.
 */

import { describe, expect, it } from 'vitest'
import * as editor from './index'
import * as extensions from './extensions'
import * as menu from './menu'

describe('editor barrel', () => {
  it('publishes every extension the module exports', () => {
    const missing = Object.keys(extensions).filter((name) => !(name in editor))
    expect(missing).toEqual([])
  })

  it('publishes every menu item the module exports', () => {
    const missing = Object.keys(menu).filter((name) => !(name in editor))
    expect(missing).toEqual([])
  })

  it('keeps the components and kits the barrel owns', () => {
    for (const name of [
      'Editor',
      'EditorContent',
      'EditorDropZone',
      'EditorFixedMenu',
      'EditorBubbleMenu',
      'EditorTableMenu',
      'EditorFloatingMenu',
      'useEditor',
      'CommentKit',
      'RichTextKit',
      'InlineKit',
    ]) {
      expect(editor).toHaveProperty(name)
    }
  })
})
