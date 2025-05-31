<template>
  <div
    class="absolute z-20 bg-white border rounded-md shadow-lg p-1 min-w-48"
    :style="style"
  >
    <ul>
      <li
        v-for="(action, index) in actions"
        :key="action.label || `separator-${index}`"
      >
        <hr v-if="action.type === 'separator'" class="my-1 border-gray-200" />
        <button
          v-else
          class="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-sm disabled:opacity-50 flex items-center gap-2"
          :disabled="action.isDisabled && action.isDisabled(editor)"
          @click="() => performAction(action)"
        >
          <component
            v-if="action.icon" 
            :is="action.icon"
            class="w-4 h-4 text-gray-500"
          />
          {{ action.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import commands from '../../commands'
import LucideArrowUp from '~icons/lucide/arrow-up'
import LucideArrowDown from '~icons/lucide/arrow-down'
import LucideTrash2 from '~icons/lucide/trash-2'
import LucideArrowLeft from '~icons/lucide/arrow-left'
import LucideArrowRight from '~icons/lucide/arrow-right'
import LucidePilcrow from '~icons/lucide/pilcrow' 

export default {
  name: 'TableActionMenu',
  props: {
    editor: {
      type: Object,
      required: true,
    },
    position: {
      type: Object, // { top, left }
      required: true,
    },
    axis: {
      type: String, // 'row' or 'column'
      required: true,
    },
    cellInfo: {
      type: Object, // { element, axis, rowIndex, colIndex, isFirstRow, isFirstCol }
      default: () => ({}),
    },
  },
  emits: ['close'],
  computed: {
    style() {
      return {
        top: `${this.position.top}px`,
        left: `${this.position.left}px`,
      }
    },
    actions() {
      const baseActions = this.getBaseActions()
      const headerActions = this.getHeaderActions()
      const tableActions = this.getTableActions()

      let actions = [...baseActions]

      if (headerActions.length > 0) {
        actions.push(commands.Separator, ...headerActions)
      }

      if (tableActions.length > 0) {
        actions.push(commands.Separator, ...tableActions)
      }

      return actions
    },
  },
  methods: {
    performAction(action) {
      if (action.type === 'separator') return

      this.focusHoveredCell()

      this.$nextTick(() => {
        action.action(this.editor)
        this.$emit('close')
        this.$el.dispatchEvent(new CustomEvent('vue:close'))
      })
    },
    focusHoveredCell() {
      const targetElement =
        this.cellInfo.originalHoveredCell || this.cellInfo.element

      if (!targetElement) return

      const view = this.editor.view

      try {
        let pos = view.posAtDOM(targetElement, 0)

        if (pos === null || pos === undefined || pos < 0) {
          const rect = targetElement.getBoundingClientRect()
          const coords = view.posAtCoords({
            left: rect.left + 1,
            top: rect.top + 1,
          })
          if (coords) {
            pos = coords.pos
          }
        }

        if (pos !== null && pos !== undefined && pos >= 0) {
          this.editor.commands.setTextSelection(pos)
          this.editor.commands.focus()
        }
      } catch (error) {
        this.editor.commands.focus()
      }
    },
    getBaseActions() {
      if (this.axis === 'row') {
        return [
          {
            ...commands.AddRowBefore,
            label: 'Insert row above',
            icon: LucideArrowUp,
          },
          {
            ...commands.AddRowAfter,
            label: 'Insert row below',
            icon: LucideArrowDown,
          },
          {
            ...commands.DeleteRow,
            label: 'Delete row',
            icon: LucideTrash2,
          },
        ]
      }
      return [
        {
          ...commands.AddColumnBefore,
          label: 'Insert column left',
          icon: LucideArrowLeft,
        },
        {
          ...commands.AddColumnAfter,
          label: 'Insert column right',
          icon: LucideArrowRight,
        },
        {
          ...commands.DeleteColumn,
          label: 'Delete column',
          icon: LucideTrash2,
        },
      ]
    },
    getHeaderActions() {
      const actions = []
      const { isFirstRow, isFirstCol } = this.cellInfo

      if (this.axis === 'row' && isFirstRow) {
        actions.push({
          ...commands.ToggleHeaderRow,
          label: 'Toggle Header Row',
          icon: LucidePilcrow,
        })
      }

      if (this.axis === 'column' && isFirstCol) {
        actions.push({
          ...commands.ToggleHeaderColumn,
          label: 'Toggle Header Column',
          icon: LucidePilcrow,
        })
      }

      return actions
    },
    getCellActions() {
      return []
    },
    getTableActions() {
      return [
        {
          ...commands.DeleteTable,
          label: 'Delete Table',
          icon: LucideTrash2, // Changed from featherIcon: 'trash' (using Trash2 for consistency)
        },
      ]
    },
  },
  mounted() {
    this.outsideClickListener = (event) => {
      if (!this.$el.contains(event.target)) {
        this.$emit('close')
        this.$el.dispatchEvent(new CustomEvent('vue:close'))
      }
    }

    setTimeout(() => {
      document.addEventListener('click', this.outsideClickListener, true)
    }, 100)
  },
  beforeUnmount() {
    if (this.outsideClickListener) {
      document.removeEventListener('click', this.outsideClickListener, true)
    }
  },
}
</script>
