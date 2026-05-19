import type { Ref } from 'vue'

export type BasicParams = Record<string, any> | undefined
export type CacheKey = string | Array<string | number | boolean | object>

export interface UseCallOptions<
  TResponse = any,
  TParams extends BasicParams = undefined,
> {
  url: string | Ref<string>
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  params?: TParams | (() => TParams)
  cacheKey?: CacheKey
  immediate?: boolean
  refetch?: boolean
  baseUrl?: string
  initialData?: TResponse
  beforeSubmit?: (params?: TParams) => void
  transform?: (data: TResponse) => TResponse
  onSuccess?: (data: TResponse) => void
  onError?: (error: Error) => void
}
