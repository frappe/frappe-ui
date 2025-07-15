<template>
  <BubbleMenu
    v-if="bubbleMenuButtons"
    class="bubble-menu rounded-md shadow-sm"
    :tippy-options="{ duration: 100 }"
    :editor="editor"
    v-bind="options"
    :should-show="always && showAlways"
  >
    <Menu
      class="rounded-md border-gray-100 shadow-lg"
      :buttons="bubbleMenuButtons"
    />
  </BubbleMenu>
</template>
<script>
import { BubbleMenu } from '@tiptap/vue-3'
import { createEditorButton } from './utils'
import { isTextSelection } from '@tiptap/core'
import Menu from './Menu.vue'

const showAlways = ({ state, from, to, view }) => {
  // Adapated from official Tiptap plugin; removed constraints for isEditable and focus
  const { doc, selection } = state
  const { empty } = selection
  const isEmptyTextBlock =
    !doc.textBetween(from, to).length && isTextSelection(state.selection)

  return !empty && !isEmptyTextBlock && (!view.editable || view.hasFocus())
}
export default {
  name: 'TextEditorBubbleMenu',
  props: ['buttons', 'options', 'always'],
  components: { BubbleMenu, Menu },
  inject: ['editor'],
  computed: {
    bubbleMenuButtons() {
      if (!this.buttons) return false

      let buttons
      if (Array.isArray(this.buttons)) {
        buttons = this.buttons
      } else {
        buttons = [
          'Paragraph',
          'Heading 2',
          'Heading 3',
          'Separator',
          'Bold',
          'Italic',
          'Strikethrough',
          'FontColor',
          'Link',
          'Separator',
          'Bullet List',
          'Numbered List',
          'Task List',
          'Separator',
          'Align Left',
          'Align Center',
          'Align Right',
          'Separator',
          'Image',
          'Video',
          'Blockquote',
          'Code',
          [
            'InsertTable',
            'AddColumnBefore',
            'AddColumnAfter',
            'DeleteColumn',
            'AddRowBefore',
            'AddRowAfter',
            'DeleteRow',
            'MergeCells',
            'SplitCell',
            'ToggleHeaderColumn',
            'ToggleHeaderRow',
            'ToggleHeaderCell',
            'DeleteTable',
          ],
        ]
      }
      return buttons.map(createEditorButton)
    },
  },
  methods: {
    showAlways,
  },
}
</script>
