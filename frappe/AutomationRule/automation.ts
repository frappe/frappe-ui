import { inject } from 'vue'
import type { StateRow } from '../Filter/types'
import { getDefaultOperator } from '../Filter/utils'
import { AutomationState, AutomationStateSymbol } from './types'

// Raw field from useDoctypeMeta.getField()
interface DocFieldMeta {
  fieldname: string
  fieldtype: string
  options?: string
  label?: string
}

// Type for getField function from useDoctypeMeta
type GetFieldFn = (fieldname: string) => DocFieldMeta | null

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

export function useFilterConditions(rows: StateRow[], getField: GetFieldFn) {
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

  const deleteRow = (index: number) => {
    rows.splice(index, 1)
  }

  const clearRows = () => {
    rows.splice(0, rows.length)
    insertRow()
  }

  const updateField = (index: number, fieldName: string) => {
    if (!fieldName) return

    const rawField = getField(fieldName)
    if (!rawField) return

    const fieldType = rawField.fieldtype
    const options = rawField.options?.split('\n') || []

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
