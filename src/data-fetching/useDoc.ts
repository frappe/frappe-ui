import { useFrappeFetch } from './useFrappeFetch'

interface DocumentOptions {
  fetch?: boolean
}

export function useDoc<T = any>(
  doctype: string,
  docname: string,
  options: any = {
    fetch: true,
  },
) {
  return {
    get: () => getDoc<T>(doctype, docname),
    runMethod: (method: string, params: { [key: string]: any }) =>
      runDocMethod(doctype, docname, method, params),
  }
}

function getDoc<T>(doctype: string, docname: string) {
  let url = `/api/v2/document/${doctype}/${docname}`

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

function runDocMethod(
  doctype: string,
  docname: string,
  method: string,
  params: { [key: string]: any },
  httpMethod: string = 'GET',
) {
  let url = `/api/v2/document/${doctype}/${docname}/method/${method}`
  if (httpMethod === 'GET' && Object.keys(params).length) {
    return useFrappeFetch(url + `?${makeGetParams(params)}`).get()
  } else if (httpMethod === 'POST') {
    return useFrappeFetch(url).post(params)
  }
}

function makeGetParams(params: { [key: string]: any }) {
  let url = new URLSearchParams()
  for (let key in params) {
    url.append(key, params[key])
  }
  return url.toString()
}
