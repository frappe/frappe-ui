import { inject } from 'vue'
import type { Field, StateRow } from '../Filter/types'
import { getDefaultOperator } from '../Filter/utils'
import { AutomationState, AutomationStateSymbol } from './types'

export function useAutomationState(): AutomationState {
  // this is done to ensure the state is always provided,
  // inject by definition says the injected key could be undefined
  const state = inject(AutomationStateSymbol)
  if (!state) {
    throw new Error('AutomationState must be provided')
  }
  return state
}

// Creates an empty filter row
export const createEmptyRow = (): StateRow => ({
  field: { fieldName: '', fieldType: '', options: [] },
  operator: '',
  value: '',
})

export function useFilterConditions(rows: StateRow[]) {
  // Check if a row has a field selected
  const isRowComplete = (row: StateRow): boolean => {
    return !!row.field.fieldName
  }

  // Check if we can add a new row (last row must have field selected)
  const canAddRow = (): boolean => {
    const lastRow = rows[rows.length - 1]
    return lastRow ? isRowComplete(lastRow) : true
  }

  // Insert a new empty row
  const insertRow = () => {
    rows.push(createEmptyRow())
  }

  // Delete a row at index, ensure at least one row exists
  const deleteRow = (index: number) => {
    rows.splice(index, 1)
    if (rows.length === 0) {
      insertRow()
    }
  }

  // Clear all rows and reset to one empty row
  const clearRows = () => {
    rows.splice(0, rows.length)
    insertRow()
  }

  // Update a row when field is selected (using raw field meta)
  const updateField = (index: number, fieldMeta: Field | null) => {
    if (!fieldMeta) return

    const fieldName = fieldMeta.fieldName
    const fieldType = fieldMeta.fieldType
    const options = fieldMeta.options || []

    const defaultOperator = getDefaultOperator({
      fieldType,
      fieldName,
    })

    rows[index] = {
      field: {
        fieldName,
        fieldType,
        options,
      },
      operator: defaultOperator,
      value: '',
    }
  }

  return {
    insertRow,
    deleteRow,
    clearRows,
    updateField,
    isRowComplete,
    canAddRow,
  }
}
