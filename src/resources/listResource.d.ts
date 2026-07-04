import type { Resource, ResourceOptions } from './resources'

export interface ListResource<TRow = any> {
  doctype: string
  data: TRow[] | null
  originalData: TRow[] | null
  dataMap: Record<string, TRow>
  list: Resource<TRow[]>
  fetchOne: Resource<TRow[]>
  insert: Resource<TRow>
  setValue: Resource<TRow>
  delete: Resource
  runDocMethod: Resource
  update: (options: ResourceOptions) => void
  fetch: () => void
  reload: () => Promise<TRow[] | null>
  setData: (data: TRow[] | ((current: TRow[] | null) => TRow[])) => void
  getRow: (name: string | number) => TRow | undefined
  [key: string]: any
}

export function createListResource<TRow = any>(
  options: ResourceOptions,
  vm?: any,
): ListResource<TRow>

export function getCachedListResource<TRow = any>(
  cacheKey: unknown,
): ListResource<TRow> | null

export function updateRowInListResource(doctype: string, doc: any): void
export function deleteRowInListResource(doctype: string, docname: string): void
export function revertRowInListResource(doctype: string, doc: any): void
