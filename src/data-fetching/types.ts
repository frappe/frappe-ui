import { Reactive, Ref } from 'vue'

export type Field = string

export type ChildTableField = {
  [key: string]: Field[]
}

export type FilterValue =
  | string
  | number
  | boolean
  | [string, string | number | boolean | Ref<string | number | boolean>]

export interface ListFilters {
  [key: Field]: FilterValue
}

export type OrderBy =
  | `${Field} ASC`
  | `${Field} DESC`
  | `${Field} asc`
  | `${Field} desc`

export interface ListOptions<T> {
  doctype: string
  fields?: Array<keyof T | ChildTableField>
  filters?: Reactive<ListFilters>
  orderBy?: OrderBy
  start?: number
  limit?: number
  groupBy?: Field
  parent?: string
  debug?: boolean
  cacheKey?: string | Array<string | number | boolean>
  initialData?: T[]
  immediate?: boolean
  refetch?: boolean
  baseUrl?: string
  transform?: (data: T[]) => T[]
  onSuccess?: (data: T[]) => void
  onError?: (error: Error) => void
}

export interface ListResponse<T> {
  result: T[]
  has_next_page: boolean
}
