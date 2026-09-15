/**
 * One message, several messages, or an `Error`. An `Error` renders its
 * `messages` when it has any (Frappe's whitelisted methods return several),
 * and its `message` otherwise.
 *
 * Every error surface in the library takes this: `ErrorMessage.message`, and
 * the `error` prop every input shares through `InputLabelingProps`.
 */
export type ErrorMessageValue =
  | string
  | string[]
  | (Error & { messages?: string | string[] })

/**
 * Collapse an error value to the lines that render. One implementation, so
 * `ErrorMessage` and the input family can never disagree about what an empty
 * `messages` array or a blank string means.
 *
 * Returns an empty array when there is nothing to show, which is also the
 * "no error" test: an `Error` with no `message` and no `messages`, an empty
 * array, and an empty string all report no error.
 */
export function errorLines(value?: ErrorMessageValue | null): string[] {
  if (!value) return []
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.filter(Boolean).map(String)
  // An empty `messages` array is not an answer, so fall through to `message`.
  const messages = value.messages
  if (Array.isArray(messages) && messages.length) {
    const lines = messages.filter(Boolean).map(String)
    if (lines.length) return lines
  } else if (typeof messages === 'string' && messages) {
    return [messages]
  }
  return value.message ? [value.message] : []
}
