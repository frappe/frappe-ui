export interface ResourceOptions {
  [key: string]: any
}

export interface Resource<TData = any> {
  method?: string
  url?: string
  data: TData | null
  previousData: TData | null
  loading: boolean
  fetched: boolean
  error: unknown
  promise: Promise<TData> | null
  auto?: boolean
  params: unknown
  fetch: (...args: any[]) => Promise<TData | null>
  reload: (...args: any[]) => Promise<TData | null>
  submit: (...args: any[]) => Promise<TData | null>
  abort: () => void
  reset: () => void
  update: (options: ResourceOptions) => void
  setData: (data: TData | ((current: TData | null) => TData)) => void
  [key: string]: any
}

export function createResource<TData = any>(
  options: string | ResourceOptions,
  vm?: any,
): Resource<TData>

export function getCacheKey(cacheKey: unknown): string | null

export function getCachedResource<TData = any>(
  cacheKey: unknown,
): Resource<TData> | null
