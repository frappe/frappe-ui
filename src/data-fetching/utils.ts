import { MaybeRef, unref } from 'vue'
import { Filters } from './useList/types'

export function makeGetParams(params: Record<string, any>) {
  let url = new URLSearchParams()
  for (let key in params) {
    let value = params[key]
    if (value != null && !isEmptyObject(value)) {
      url.append(key, value)
    }
  }
  return url.toString()
}

export function isEmptyObject(obj: any) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

export function parseFilters(filters: Filters): Filters | null {
  let parsedFilters: Filters = {}
  for (let key in filters) {
    let value = filters[key]
    if (Array.isArray(value)) {
      let [operator, actualValue] = value
      operator = unref(operator)
      actualValue = unref(actualValue)
      if (operator === 'like') {
        if (typeof actualValue != 'string') {
          actualValue = String(actualValue)
        }
        if (actualValue == null || actualValue == '') {
          continue
        }
        if (!actualValue.includes('%')) {
          actualValue = `%${actualValue}%`
        }
      }
      parsedFilters[key] = [operator, actualValue]
    } else {
      parsedFilters[key] = unref(value)
    }
  }
  if (isEmptyObject(parsedFilters)) {
    return null
  }
  return parsedFilters
}

export function unrefObject(
  obj: Record<string, MaybeRef<string | number | boolean>>,
) {
  let newObj: Record<keyof typeof obj, any> = {}
  for (let key in obj) {
    newObj[key] = unref(obj[key])
  }
  return newObj
}

export function normalizeCacheKey(
  cacheKey: string | Array<string | number | boolean | object> | undefined,
  prefix?: string,
) {
  if (!cacheKey) {
    return null
  }
  if (typeof cacheKey === 'string') {
    cacheKey = [cacheKey]
  }
  if (prefix) {
    cacheKey = [prefix, ...cacheKey]
  }
  return JSON.stringify(cacheKey)
}
