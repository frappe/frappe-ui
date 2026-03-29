import { ref, type Ref } from 'vue'
import type { Operation } from '../core/Operation'
import type { FrappeResponseError } from '../core/FrappeResponseError'
import type { DocStore } from '../core/DocStore'

export interface ReactiveOperation<TParams, TResult> {
  call(params: TParams): Promise<TResult>
  callOptimistic(
    params: TParams,
    updater?: (store: DocStore) => void,
    rollback?: (store: DocStore) => void,
  ): Promise<TResult>
  loading: Ref<boolean>
  error: Ref<FrappeResponseError | null>
  data: Ref<TResult | null>
}

export function wrapOperation<TParams, TResult>(
  op: Operation<TParams, TResult>,
): ReactiveOperation<TParams, TResult> {
  const loading = ref(false)
  const error = ref<FrappeResponseError | null>(null)
  const data = ref<TResult | null>(null)

  return {
    loading,
    error,
    data,

    async call(params) {
      loading.value = true
      error.value = null
      try {
        const result = await op.call(params)
        data.value = result as any
        return result
      } catch (e) {
        error.value = e as FrappeResponseError
        throw e
      } finally {
        loading.value = false
      }
    },

    async callOptimistic(params, updater, rollback) {
      loading.value = true
      error.value = null
      try {
        const result = await op.callOptimistic(params, updater, rollback)
        data.value = result as any
        return result
      } catch (e) {
        error.value = e as FrappeResponseError
        throw e
      } finally {
        loading.value = false
      }
    },
  }
}
