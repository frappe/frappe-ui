// Defined next to `errorLines`, the one function that reads it. The input
// family shares the same type through `InputLabelingProps['error']`.
export type { ErrorMessageValue } from '../../utils/errorLines'
import type { ErrorMessageValue } from '../../utils/errorLines'

export interface ErrorMessageProps {
  /** The error message to display. */
  message?: ErrorMessageValue
}
