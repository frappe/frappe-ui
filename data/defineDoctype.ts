import { createGetDoc } from './getDoc'
import { createGetList } from './getList'

export interface DoctypeOptions {
  baseUrl?: string
}

export function defineDoctype<TDoc extends { name: string }>(
  doctype: string,
  options: DoctypeOptions = {},
) {
  const { baseUrl = '' } = options

  const getDoc = createGetDoc<TDoc>({ doctype, baseUrl })
  const getList = createGetList<TDoc>({ doctype, baseUrl })

  return {
    getDoc,
    getList,
  }
}
