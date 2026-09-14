import type { Action } from '../shared/action'

/** A shared button action with no component-specific callback context. */
export type DividerAction = Action<void> & { label: string }

export interface DividerProps {
  /** Which way the rule runs. */
  orientation?: 'horizontal' | 'vertical'

  /**
   * Where the action sits along the rule. Ignored without an `action`, since a
   * plain rule has nothing to place.
   */
  align?: 'start' | 'center' | 'end'

  /**
   * Stretches the divider to the cross-axis size of its flex parent
   * (`align-self: stretch`) instead of taking the full height of its own box.
   * Use it for a vertical divider between flex items of differing heights.
   */
  flexItem?: boolean

  /**
   * Renders a button on the rule instead of a bare `<hr>`. The rule is drawn
   * behind the button and runs the full length of the divider.
   */
  action?: DividerAction
}
