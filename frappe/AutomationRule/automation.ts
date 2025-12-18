import { computed, h, inject, type Ref } from 'vue'
import TextInput from '../../src/components/TextInput/TextInput.vue'
import { useDoctypeMeta } from '../../src/data-fetching/useDoctypeMeta'
import type { StateRow } from '../Filter/types'
import {
  getDefaultOperator,
  getOperators,
  getValueControl,
} from '../Filter/utils'
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

// Condition tuple: [fieldname, operator, value]
type ConditionTuple = [string, string, string]
// Condition array with conjunctions: [tuple, "and", tuple, ...]
type ConditionArray = (ConditionTuple | string)[]

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

// the format for conditions becomes
// [["ticket_type","equals","Bug"],"and",["status","equals","Open"]]
export function useDoctypeFilters(
  doctype: string,
  conditions: Ref<ConditionArray>,
) {
  const { fields, getField } = useDoctypeMeta(doctype)

  const conditionRows = computed(() => {
    return conditions.value.filter((item): item is ConditionTuple =>
      Array.isArray(item),
    )
  })

  const conjunction = computed(() => {
    for (const item of conditions.value) {
      if (typeof item === 'string') {
        return item
      }
    }
    return 'and'
  })

  const conjunctionTooltip = computed(() => {
    return conjunction.value === 'and'
      ? 'Match ALL of the conditions'
      : 'Match ANY of the conditions'
  })

  function toggleConjunction() {
    const newConjunction = conjunction.value === 'and' ? 'or' : 'and'
    for (let i = 0; i < conditions.value.length; i++) {
      if (typeof conditions.value[i] === 'string') {
        conditions.value[i] = newConjunction
      }
    }
  }

  function getFieldTypeFromRow(row: ConditionTuple): string {
    const fieldName = row[0]
    if (!fieldName) return ''
    const field = getField(fieldName)
    return field?.fieldtype || ''
  }

  function handleFieldChange(row: ConditionTuple, fieldName: string) {
    if (!fieldName) {
      row[0] = ''
      row[1] = ''
      row[2] = ''
      return
    }

    const rawField = getField(fieldName)
    if (!rawField) return

    const defaultOperator = getDefaultOperator({
      fieldName: rawField.fieldname,
      fieldType: rawField.fieldtype,
    })

    row[0] = fieldName
    row[1] = defaultOperator
    row[2] = ''
  }

  function handleOperatorChange(
    row: ConditionTuple,
    operator: String | undefined,
  ) {
    if (!operator) return
    row[1] = String(operator)
    row[2] = ''
  }

  function handleValueChange(row: ConditionTuple, value: unknown) {
    row[2] = String(value ?? '')
  }

  function getOperatorsForRow(row: ConditionTuple) {
    const fieldName = row[0]
    if (!fieldName) return []

    const field = getField(fieldName)
    if (!field) return []

    return getOperators({
      fieldName: field.fieldname,
      fieldType: field.fieldtype,
      options: field.options?.split('\n') || [],
    })
  }

  function getValueControlForRow(row: ConditionTuple) {
    const fieldName = row[0]
    const operator = row[1]
    const defaultInputComponent = h(TextInput, { placeholder: 'Enter Value' })
    if (!fieldName) return defaultInputComponent

    const field = getField(fieldName)
    if (!field) return defaultInputComponent

    return getValueControl({
      field: {
        fieldName: field.fieldname,
        fieldType: field.fieldtype,
        options: field.options?.split('\n') || [],
      },
      operator,
      value: row[2],
    })
  }

  function getFieldsForRow(currentFieldName: string) {
    return fields.value.filter(
      (f) =>
        f.value === currentFieldName ||
        !conditionRows.value.some((row) => row[0] === f.value),
    )
  }

  function canAddRow(): boolean {
    const lastRow = conditionRows.value[conditionRows.value.length - 1]
    return lastRow ? !!lastRow[0] : true
  }

  function insertRow() {
    if (conditions.value.length === 0) {
      conditions.value.push(['', '', ''])
    } else {
      conditions.value.push(conjunction.value, ['', '', ''])
    }
  }

  function getConditionArrayIndex(rowIndex: number): number {
    let count = 0
    for (let i = 0; i < conditions.value.length; i++) {
      if (Array.isArray(conditions.value[i])) {
        if (count === rowIndex) return i
        count++
      }
    }
    return -1
  }

  function deleteRow(index: number) {
    const arrayIndex = getConditionArrayIndex(index)
    if (arrayIndex === -1) return

    if (index === 0) {
      if (conditions.value.length > 1) {
        conditions.value.splice(0, 2)
      } else {
        conditions.value.splice(0, 1)
      }
    } else {
      conditions.value.splice(arrayIndex - 1, 2)
    }
  }

  function clearRows() {
    conditions.value.splice(0, conditions.value.length)
    conditions.value.push(['', '', ''])
  }

  return {
    // Computed
    conditionRows,
    conjunction,
    conjunctionTooltip,
    // availableFields,
    fields,

    // Row operations
    insertRow,
    deleteRow,
    clearRows,
    canAddRow,

    // Field/Operator/Value handlers
    handleFieldChange,
    handleOperatorChange,
    handleValueChange,
    toggleConjunction,

    // Helpers
    getFieldTypeFromRow,
    getOperatorsForRow,
    getValueControlForRow,
    getFieldsForRow,
  }
}
