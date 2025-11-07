import { h } from 'vue'
import Select from '../../src/components/Select/Select.vue'
import TextInput from '../../src/components/TextInput/TextInput.vue'
import Rating from '../../src/components/Rating/Rating.vue'
import DatePicker from '../../src/components/DatePicker/DatePicker.vue'
import DateRangePicker from '../../src/components/DatePicker/DateRangePicker.vue'
import DateTimePicker from '../../src/components/DatePicker/DateTimePicker.vue'
import { Link } from '../Link'

import type { Field, StateRow } from './types'

const typeCheck = ['Check']
const typeLink = ['Link', 'Dynamic Link']
const typeNumber = ['Float', 'Int', 'Currency', 'Percent']
const typeSelect = ['Select']
const typeString = ['Data', 'Long Text', 'Small Text', 'Text Editor', 'Text']
const typeDate = ['Date', 'Datetime']
const typeRating = ['Rating']

const baseOperators = [
  { label: 'Equals', value: 'equals' },
  { label: 'Not Equals', value: 'not equals' },
  { label: 'Like', value: 'like' },
  { label: 'Not Like', value: 'not like' },
  { label: 'In', value: 'in' },
  { label: 'Not In', value: 'not in' },
  { label: 'Is', value: 'is' },
]

const comparisonOperators = [
  { label: '<', value: '<' },
  { label: '>', value: '>' },
  { label: '<=', value: '<=' },
  { label: '>=', value: '>=' },
]

const likeOperators = [
  { label: 'Like', value: 'like' },
  { label: 'Not Like', value: 'not like' },
  { label: 'Is', value: 'is' },
]

export const getOperators = (field: Field) => {
  const { fieldType, fieldName } = field

  if (fieldName === '_assign') return likeOperators

  if (typeNumber.includes(fieldType)) {
    return [...baseOperators, ...comparisonOperators]
  }

  if (
    typeString.includes(fieldType) ||
    typeSelect.includes(fieldType) ||
    typeLink.includes(fieldType)
  ) {
    return baseOperators
  }

  if (typeCheck.includes(fieldType)) {
    return [{ label: 'Equals', value: 'equals' }]
  }

  if (['Duration'].includes(fieldType)) {
    return [
      { label: 'Like', value: 'like' },
      { label: 'Not Like', value: 'not like' },
      { label: 'In', value: 'in' },
      { label: 'Not In', value: 'not in' },
      { label: 'Is', value: 'is' },
    ]
  }

  if (typeDate.includes(fieldType)) {
    return [
      { label: 'Equals', value: 'equals' },
      { label: 'Not Equals', value: 'not equals' },
      { label: 'Is', value: 'is' },
      ...comparisonOperators,
      { label: 'Between', value: 'between' },
      { label: 'Timespan', value: 'timespan' },
    ]
  }

  if (typeRating.includes(fieldType)) {
    return [
      { label: 'Equals', value: 'equals' },
      { label: 'Not Equals', value: 'not equals' },
      { label: 'Is', value: 'is' },
      ...comparisonOperators,
    ]
  }

  return baseOperators
}

export const timespanOptions = [
  { label: 'Last Week', value: 'last week' },
  { label: 'Last Month', value: 'last month' },
  { label: 'Last Quarter', value: 'last quarter' },
  { label: 'Last 6 Months', value: 'last 6 months' },
  { label: 'Last Year', value: 'last year' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Today', value: 'today' },
  { label: 'Tomorrow', value: 'tomorrow' },
  { label: 'This Week', value: 'this week' },
  { label: 'This Month', value: 'this month' },
  { label: 'This Quarter', value: 'this quarter' },
  { label: 'This Year', value: 'this year' },
  { label: 'Next Week', value: 'next week' },
  { label: 'Next Month', value: 'next month' },
  { label: 'Next Quarter', value: 'next quarter' },
  { label: 'Next 6 Months', value: 'next 6 months' },
  { label: 'Next Year', value: 'next year' },
]

export const getValueControl = (row: StateRow) => {
  const { field, operator } = row
  const { fieldType, options } = field

  if (operator === 'is') {
    return h(Select, {
      placeholder: 'Select Option',
      options: [
        { label: 'Set', value: 'set' },
        { label: 'Not Set', value: 'not set' },
      ],
    })
  }

  if (operator === 'timespan') {
    return h(Select, {
      placeholder: 'Select Timespan',
      options: timespanOptions,
    })
  }

  if (['like', 'not like', 'in', 'not in'].includes(operator)) {
    return h(TextInput, { placeholder: 'Enter value' })
  }

  if (typeSelect.includes(fieldType) || typeCheck.includes(fieldType)) {
    let _options = options || ['yes', 'no']

    return h(Select, { placeholder: 'Select Option', options: _options })
  }

  if (typeLink.includes(fieldType)) {
    if (fieldType === 'Dynamic Link') {
      return h(TextInput, { placeholder: 'Enter Dynamic Link' })
    }
    return h(Link, {
      class: 'form-control',
      doctype: options?.[0] || '',
      value: row.value,
    })
  }

  if (typeNumber.includes(fieldType)) {
    return h(TextInput, { type: 'number', placeholder: 'Enter Number' })
  }

  if (typeDate.includes(fieldType) && operator === 'between') {
    return h(DateRangePicker, {
      value: row.value,
      iconLeft: '',
      placeholder: 'Select Date Range',
    })
  }

  if (typeDate.includes(fieldType)) {
    return h(fieldType === 'Date' ? DatePicker : DateTimePicker, {
      value: row.value,
      iconLeft: '',
      placeholder: 'Select Date',
    })
  }

  if (typeRating.includes(fieldType)) {
    return h(Rating, {
      rating: row.value || 0,
      static: false,
    })
  }

  return h(TextInput, { placeholder: 'Enter Value' })
}

export const getDefaultOperator = (field: {
  fieldType: string
  fieldName: string
}) => {
  const operators = getOperators(field)
  return operators[0].value
}

const transformIn = (row: StateRow) => {
  if (row.operator.includes('like') && !row.value.includes('%')) {
    row.value = `%${row.value}%`
  }
  return row
}

const operatorMap = {
  is: 'is',
  'is not': 'is not',
  in: 'in',
  'not in': 'not in',
  equals: '=',
  'not equals': '!=',
  yes: true,
  no: false,
  like: 'LIKE',
  'not like': 'NOT LIKE',
  '>': '>',
  '<': '<',
  '>=': '>=',
  '<=': '<=',
  between: 'between',
  timespan: 'timespan',
}

export const parseFilters = (filters: any) => {
  const _filters = JSON.parse(JSON.stringify(filters))

  return _filters.map(transformIn).reduce((acc, cur) => {
    if (['equals', '='].includes(cur.operator)) {
      cur.value = cur.toBoolean ? 'Yes' : cur.value
    } //
    else if (cur.operator === 'between') cur.value = [...cur.value.split(',')]

    return [
      ...acc,
      [cur.field.fieldName, operatorMap[cur.operator.toLowerCase()], cur.value],
    ]
  }, [])
}
