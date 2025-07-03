import { useTimeAgo } from '@vueuse/core'
import {
  ASSIGN_FIELDNAME,
  DATE_FIELD_TYPES,
  DEFAULT_CURRENCY,
  HTML_FIELD_TYPES,
  IMAGE_FIELD_TYPES,
  NO_VALUE_TYPES,
  NUMERIC_FIELD_TYPES,
  RELATIVE_DATE_FIELDNAMES,
  STATUS_FIELDNAMES,
  TAGS_FIELDNAME,
  TEXT_TRUNCATE_LENGTH,
} from './constants'
import { DocField } from '../types'

export function getCellType(field: DocField) {
  const { fieldtype, fieldname } = field

  return {
    isStatus: STATUS_FIELDNAMES.includes(fieldname),
    isTags: fieldname === TAGS_FIELDNAME,
    isAssign: fieldname === ASSIGN_FIELDNAME,
    isLink: fieldtype === 'Link',
    isDate: DATE_FIELD_TYPES.includes(fieldtype),
    isNumeric:
      NUMERIC_FIELD_TYPES.includes(fieldtype) &&
      fieldtype !== 'Currency' &&
      fieldtype !== 'Percent',
    isCurrency: fieldtype === 'Currency',
    isPercent: fieldtype === 'Percent',
    isCheck: fieldtype === 'Check',
    isSelect: fieldtype === 'Select',
    isText: HTML_FIELD_TYPES.includes(fieldtype),
    isImage: IMAGE_FIELD_TYPES.includes(fieldtype as any),
    isRating: fieldtype === 'Rating',
    isRelativeDate: RELATIVE_DATE_FIELDNAMES.includes(fieldname),
    isValueType: !NO_VALUE_TYPES.includes(fieldtype),
    isSpecial:
      fieldname === TAGS_FIELDNAME ||
      fieldname === ASSIGN_FIELDNAME ||
      STATUS_FIELDNAMES.includes(fieldname),
  }
}

// Utility functions
export function hasPerm(permlevel?: number): boolean {
  // TODO: Implement actual permission checking logic
  return true
}

export function truncateText(
  text: any,
  maxLength: number = TEXT_TRUNCATE_LENGTH,
): string {
  const str = String(text || '')
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str
}

export function parseJsonSafely<T = any>(value: string): T[] {
  try {
    return value ? JSON.parse(value) : []
  } catch {
    console.error('Failed to parse JSON:', value)
    return []
  }
}

export function formatCurrency(
  value: any,
  currency: string = DEFAULT_CURRENCY,
): string {
  if (value === null || value === undefined) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(Number(value))
}

export function formatNumeric(value: any): string {
  if (value === null || value === undefined) return ''
  return Number(value).toLocaleString()
}

export function formatDate(value: any, relative: boolean = false): string {
  if (!value) return ''
  if (relative) {
    return useTimeAgo(value).value
  }
  return new Date(value).toLocaleDateString()
}
