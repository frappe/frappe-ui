import type { Resource, ResourceOptions } from './resources'

export interface DocumentResource<TDoc = any> {
  doctype: string
  name: string
  doc: TDoc | null
  originalDoc: TDoc | null
  isDirty: boolean
  auto: boolean
  get: Resource<TDoc>
  setValue: Resource<TDoc>
  setValueDebounced: Resource<TDoc>
  save: Resource<TDoc>
  delete: Resource<TDoc>
  reload: () => Promise<TDoc | null>
  setDoc: (doc: TDoc | ((current: TDoc | null) => TDoc)) => void
  [key: string]: any
}

export function createDocumentResource<TDoc = any>(
  options: ResourceOptions & { doctype: string; name: string },
  vm?: any,
): DocumentResource<TDoc>

export function getCachedDocumentResource<TDoc = any>(
  doctype: string,
  name: string,
): DocumentResource<TDoc> | null
