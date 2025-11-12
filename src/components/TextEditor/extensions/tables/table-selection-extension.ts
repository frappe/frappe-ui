import { Extension } from '@tiptap/core'
import { findTable, TableMap, CellSelection } from '@tiptap/pm/tables'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableCommands: {
      selectRow: (row?: number) => ReturnType
      selectColumn: (col?: number) => ReturnType
    }
  }
}

function getCellsInRow(rowIndex: number, table: any, map: TableMap) {
  const cells = []
  const seenPositions = new Set()
  const rowStart = rowIndex * map.width
  
  for (let i = 0; i < map.width; i++) {
    const cellPos = map.map[rowStart + i]
    
    if (seenPositions.has(cellPos)) {
      continue
    }
    
    const cell = table.node.nodeAt(cellPos)
    if (cell) {
      seenPositions.add(cellPos)
      cells.push({
        pos: table.start + cellPos,
        node: cell,
      })
    }
  }
  
  return cells
}

function getCellsInColumn(colIndex: number, table: any, map: TableMap) {
  const cells = []
  const seenPositions = new Set()
  
  for (let i = 0; i < map.height; i++) {
    const cellPos = map.map[i * map.width + colIndex]
    if (seenPositions.has(cellPos)) {
      continue
    }
    
    const cell = table.node.nodeAt(cellPos)
    if (cell) {
      seenPositions.add(cellPos)
      cells.push({
        pos: table.start + cellPos,
        node: cell,
      })
    }
  }
  
  return cells
}

export const TableCommandsExtension = Extension.create({
  name: 'tableCommands',

  addCommands() {
    return {
      selectRow:
        (row?: number) =>
        ({ tr, state, dispatch }) => {
          let table = findTable(state.selection.$from)
          
          if (!table && row !== undefined) {
            let foundTable = false
            state.doc.descendants((node, pos) => {
              if (node.type.name === 'table' && !foundTable) {
                foundTable = true
                const $pos = state.doc.resolve(pos + 1)
                table = findTable($pos)
                return false
              }
            })
          }
          
          if (!table) return false

          const map = TableMap.get(table.node)
          
          let rowIndex = row ?? 0
          if (row === undefined) {
            const cellPos = state.selection.$from.pos - table.start
            const rect = map.findCell(cellPos)
            rowIndex = rect.top
          }
          
          const cells = getCellsInRow(rowIndex, table, map)
          if (!cells || cells.length === 0) return false

          if (dispatch) {
            const firstCell = cells[0]
            const lastCell = cells[cells.length - 1]
            const cellSelection = CellSelection.create(tr.doc, firstCell.pos, lastCell.pos)
            tr.setSelection(cellSelection)
          }

          return true
        },

      selectColumn:
        (col?: number) =>
        ({ tr, state, dispatch }) => {
          let table = findTable(state.selection.$from)
          
          if (!table && col !== undefined) {
            let foundTable = false
            state.doc.descendants((node, pos) => {
              if (node.type.name === 'table' && !foundTable) {
                foundTable = true
                const $pos = state.doc.resolve(pos + 1)
                table = findTable($pos)
                return false
              }
            })
          }
          
          if (!table) return false

          const map = TableMap.get(table.node)
          
          let colIndex = col ?? 0
          if (col === undefined) {
            const cellPos = state.selection.$from.pos - table.start
            const rect = map.findCell(cellPos)
            colIndex = rect.left
          }
          
          const cells = getCellsInColumn(colIndex, table, map)
          if (!cells || cells.length === 0) return false

          if (dispatch) {
            cells.sort((a, b) => a.pos - b.pos)
            const firstCell = cells[0]
            const lastCell = cells[cells.length - 1]
            const cellSelection = CellSelection.create(tr.doc, firstCell.pos, lastCell.pos)
            tr.setSelection(cellSelection)
          }

          return true
        },
    }
  },
})