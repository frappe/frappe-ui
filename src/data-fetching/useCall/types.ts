import { Ref } from 'vue'

export type BasicParams = Record<string, any> | undefined

export interface UseCallOptions<
  TResponse = any,
  TParams extends BasicParams = undefined,
> {
  url: string | Ref<string>
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  params?: TParams | (() => TParams)
  cacheKey?: string | Array<string | number | boolean>
  immediate?: boolean
  refetch?: boolean
  transform?: (data: TResponse) => TResponse
  onSuccess?: (data: TResponse) => void
  onError?: (error: Error) => void
  baseUrl?: string
}
