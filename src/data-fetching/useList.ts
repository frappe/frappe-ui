import useFrappeFetch from './useFrappeFetch'

interface ListOptions {
  filters: any
  fields: string[]
}

export default function useList<T = any>(
  doctype: string,
  options: ListOptions = { filters: {}, fields: [] },
) {
  let params = new URLSearchParams()
  if (options.fields?.length) {
    params.append('fields', JSON.stringify(options.fields))
  }
  if (options.filters) {
    params.append('filters', JSON.stringify(options.filters))
  }
  let url = `/api/v2/document/${doctype}?${params.toString()}`
  const {
    data,
    error,
    isFetching,
    isFinished,
    canAbort,
    abort,
    aborted,
    execute,
  } = useFrappeFetch<T>(url)

  return {
    data,
    error,
    isFetching,
    isFinished,
    canAbort,
    abort,
    aborted,
    execute,
  }
}
