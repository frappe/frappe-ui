import { Reactive, Ref } from 'vue'
import { CacheKey } from '../useCall/types'

export type Field = string

export type ChildTableField = {
  [key: string]: Field[]
}

export type FilterValue =
  | string
  | number
  | boolean
  | [string, string | number | boolean | Ref<string | number | boolean>]

export interface Filters {
  [key: Field]: FilterValue
}

export type OrderBy =
  | `${Field} ASC`
  | `${Field} DESC`
  | `${Field} asc`
  | `${Field} desc`

export interface UseListOptions<T> {
  doctype: string
  fields?: Array<keyof T | ChildTableField>
  filters?: Reactive<Filters>
  orderBy?: OrderBy
  start?: number
  limit?: number
  groupBy?: Field
  parent?: string
  debug?: boolean
  cacheKey?: CacheKey
  initialData?: T[]
  immediate?: boolean
  refetch?: boolean
  baseUrl?: string
  url?: `/${string}`
  transform?: (data: T[]) => T[]
  onSuccess?: (data: T[]) => void
  onError?: (error: Error) => void
}

export interface UseListResponse<T> {
  result: T[]
  has_next_page: boolean
}
