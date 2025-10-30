import { Selection } from '@tiptap/pm/state'
import { Editor } from '@tiptap/core'

export default function improvedList(editor: Editor) {
  const selection = editor.view.state.selection
  const { $from } = selection
  if ($from.parentOffset > 0 || !selection.empty) return false

  let nodeBefore = editor.view.state.doc.resolve($from.pos - 1).nodeBefore
  if (!nodeBefore)
    nodeBefore = editor.state.doc.resolve($from.before() - 1).nodeBefore
  console.log(nodeBefore)
  if (nodeBefore && ['bulletList', 'orderedList', 'listItem'].includes(nodeBefore.type.name)) {
    // Join item with the last bullet item
    editor
      .chain()
      .command(({ tr }) => {
        const paragraphContent = $from.parent.content
        const inList = nodeBefore.type.name === 'listItem'
        console.log(inList)
        tr.delete($from.before() - (inList ? 1 : 0), $from.after())
        const insertPos = $from.pos - 4
        tr.insert(insertPos, paragraphContent)
        tr.setSelection(Selection.near(tr.doc.resolve(insertPos)))
      })
      .run()
    return true
  }

  if (editor.can().liftListItem('listItem'))
    return editor.commands.liftListItem('listItem')
}
