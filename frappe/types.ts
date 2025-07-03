import { FIELD_TYPES } from './utils/constants'

export type FieldType = typeof FIELD_TYPES[number]

export interface DocField {
  fieldname: string
  fieldtype: FieldType
  label: string
  options?: string
  in_list_view?: boolean
  in_standard_filter?: boolean
  permlevel?: number
}

export interface Meta {
  title_field: string
  fields: DocField[]
}
