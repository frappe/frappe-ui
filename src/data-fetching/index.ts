import type { BasicParams, UseCallOptions } from './useCall/types'
import { useCall as useCallWithStoreWrite } from './useCall/useCall'

export * from './useCall/types'

/**
 * Narrowed to `UseCallOptions` on the way out of the package. The
 * implementation's parameter type also carries `onStoreWrite`, the internal
 * seam every store write goes through — inert for a consumer, since
 * `WriteStamp`, `docStore` and `listStore` are all unexported, but ADR-0012
 * freezes this surface at 1.0.0 and a type that admits a member we never
 * intend to support is one a consumer finds and then argues about after the
 * freeze. Internal callers import the implementation directly.
 */
export const useCall: <TResponse, TParams extends BasicParams = undefined>(
  options: UseCallOptions<TResponse, TParams>,
) => ReturnType<typeof useCallWithStoreWrite<TResponse, TParams>> =
  useCallWithStoreWrite

export { useDoc } from './useDoc/useDoc'
export { useDoctype } from './useDoctype/useDoctype'
// `useFrappeFetch` stays internal — it is the raw `createFetch` instance
// `useCall`, `useDoc` and `useList` are built on. `FrappeResponseError` is what
// it raises, so a consumer needs the class to tell a Frappe error from a
// network or parse failure.
export { FrappeResponseError } from './useFrappeFetch'
export * from './useList/types'
export { useList } from './useList/useList'
export { useNewDoc } from './useNewDoc/useNewDoc'
