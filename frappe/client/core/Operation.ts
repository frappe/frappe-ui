import type { DocStore } from './DocStore'

export interface Operation<TParams, TResult> {
  /**
   * Execute the operation. Updates DocStore on success.
   * Rejects on error with a FrappeResponseError.
   */
  call(params: TParams): Promise<TResult>

  /**
   * Execute with an optimistic update. Applies `updater` to DocStore
   * immediately. On error, calls `rollback` or auto-reverts (restores the
   * pre-update snapshot).
   */
  callOptimistic(
    params: TParams,
    updater: (store: DocStore) => void,
    rollback?: (store: DocStore) => void,
  ): Promise<TResult>
}
