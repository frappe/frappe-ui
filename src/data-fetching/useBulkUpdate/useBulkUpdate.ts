import { reactive, readonly, ref, type Ref } from 'vue'
import { useCall } from '../useCall/useCall'
import { listStore } from '../useList/listStore'
import { docStore } from '../docStore'

export interface BulkUpdateOptions {
  baseUrl?: string
}

export interface DocumentUpdate {
  doctype: string
  name: string
  [key: string]: any
}

export function useBulkUpdate(options: BulkUpdateOptions = {}) {
  const bulkUpdateCall = useCall<DocumentUpdate[], { docs: DocumentUpdate[] }>({
    method: 'POST',
    url: '/api/v2/method/bulk_update',
    immediate: false,
    refetch: false,
    ...options,
    transform(data) {
      return data.map((row) => ({
        ...row,
        name: String(row.name),
      }))
    },
    onSuccess(data) {
      listStore.updateRows(data)
      docStore.setDocs(data)
    },
  })

  async function submit(docs: DocumentUpdate[]) {
    return bulkUpdateCall.submit({ docs })
  }

  return reactive({
    data: bulkUpdateCall.data,
    error: bulkUpdateCall.error,
    loading: bulkUpdateCall.loading,
    isFinished: bulkUpdateCall.isFinished,
    isFetching: bulkUpdateCall.isFetching,
    canAbort: bulkUpdateCall.canAbort,
    abort: bulkUpdateCall.abort,
    aborted: bulkUpdateCall.aborted,
    reset: bulkUpdateCall.reset,
    execute: submit,
    submit,
  })
}
