import { frappeRequest, type FrappeRequestError } from './frappeRequest'

export interface CallOptions {
  headers?: Record<string, string>
  onError?: (context: {
    response: Response
    status: number
    error: CallError
  }) => void
}

/**
 * What `call` rejects with. Structurally the error `frappeRequest` throws —
 * `call` used to build its own near-identical error object, and the two have
 * always carried the same fields.
 */
export type CallError = FrappeRequestError

/**
 * POST to a whitelisted Frappe method and return its `message`.
 *
 * `method` is a dotted path (`frappe.client.get_list`) or an absolute path
 * (`/api/method/…`, which is used as-is). `args` becomes the JSON body.
 *
 * A thin wrapper over {@link frappeRequest}, so it honours `requestBaseUrl`,
 * `requestHeaders` and `serverMessagesHandler` from `setConfig`.
 */
export default function call<TResponse = unknown>(
  method: string,
  args: Record<string, any> = {},
  options: CallOptions = {},
): Promise<TResponse> {
  return frappeRequest<TResponse>({
    url: method,
    method: 'POST',
    params: args ?? {},
    headers: options.headers,
    onError: (error) => {
      // `call` has only ever reported HTTP-level failures through `onError`;
      // a transport failure (offline, CORS, aborted) reached the caller as a
      // rejected promise and nothing else. Keep that contract — `response`
      // and `status` are non-optional in `CallOptions`.
      if (options.onError && error.response) {
        options.onError({
          response: error.response,
          status: error.status ?? error.response.status,
          error,
        })
      }
    },
  })
}
