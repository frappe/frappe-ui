/**
 * One message, several messages, or an `Error`. An `Error` renders its
 * `messages` when it has any (Frappe's whitelisted methods return several),
 * and its `message` otherwise.
 */
export type ErrorMessageValue =
  | string
  | string[]
  | (Error & { messages?: string | string[] })

export interface ErrorMessageProps {
  /** The error message to display. */
  message?: ErrorMessageValue
}
