// The selection, held in view while a popup has the focus.
//
// Pressing Link opens the library's popup, and its field takes the focus.
// The document can only show one selection, so the moment the field has it
// the run of text the link is for stops being highlighted — the writer is
// asked for a URL with nothing on the page saying what it is for. This
// extension paints that run itself, through a decoration, from the press
// until the editor has the focus back (the popup hands it back on Escape and
// on apply) or the document changes.
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

export const holdSelectionKey = new PluginKey<DecorationSet>('holdSelection')

export const HoldSelection = Extension.create({
  name: 'holdSelection',

  addCommands() {
    return {
      holdSelection:
        () =>
        ({ state, tr, dispatch }) => {
          const { from, to } = state.selection
          if (from === to) return false
          if (dispatch) tr.setMeta(holdSelectionKey, { from, to })
          return true
        },
      releaseSelection:
        () =>
        ({ tr, dispatch }) => {
          if (dispatch) tr.setMeta(holdSelectionKey, null)
          return true
        },
    }
  },

  onFocus() {
    this.editor.commands.releaseSelection()
  },

  addProseMirrorPlugins() {
    return [
      new Plugin<DecorationSet>({
        key: holdSelectionKey,
        state: {
          init: () => DecorationSet.empty,
          apply(tr, set) {
            const meta = tr.getMeta(holdSelectionKey)
            if (meta === null) return DecorationSet.empty
            if (meta)
              return DecorationSet.create(tr.doc, [
                Decoration.inline(meta.from, meta.to, {
                  class: 'composer-held-selection',
                }),
              ])
            if (tr.docChanged) return DecorationSet.empty
            return set
          },
        },
        props: {
          decorations(state) {
            return holdSelectionKey.getState(state)
          },
        },
      }),
    ]
  },
})

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    holdSelection: {
      holdSelection: () => ReturnType
      releaseSelection: () => ReturnType
    }
  }
}
