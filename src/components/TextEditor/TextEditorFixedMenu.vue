<template>
  <Menu v-if="fixedMenuButtons" :buttons="fixedMenuButtons" />
</template>
<script>
import Menu from './Menu.vue'
import { createEditorButton } from './utils'

export default {
  name: 'TextEditorFixedMenu',
  props: ['buttons'],
  components: { Menu },
  inject: ['editor'],
  computed: {
    fixedMenuButtons() {
      if (!this.buttons) return false
      let buttons
      if (Array.isArray(this.buttons)) {
        buttons = this.buttons
      } else {
        buttons = [
          [
            'Heading 1',
            'Heading 2',
            'Heading 3',
            'Heading 4',
            'Heading 5',
            'Heading 6',
          ],
          'Paragraph',
          'Separator',
          'Bold',
          'Italic',
          'Separator',
          'Bullet List',
          'Numbered List',
          'Separator',
          'Align Left',
          'Align Center',
          'Align Right',
          'FontColor',
          'Separator',
          'Image',
          'Video',
          'Link',
          'Blockquote',
          'Code',
          'Horizontal Rule',
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
          'Separator',
          'Undo',
          'Redo',
        ]
      }
      return buttons.map(createEditorButton)
    },
  },
}
</script>
