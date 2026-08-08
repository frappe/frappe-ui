export type TooltipSide = 'top' | 'right' | 'bottom' | 'left'

export interface TooltipProps {
  /**
   * Text content shown inside the tooltip.
   * Ignored if a default slot is provided.
   */
  text?: string

  /**
   * Delay (in seconds) before showing the tooltip on hover.
   */
  hoverDelay?: number

  /**
   * Side of the trigger the tooltip is placed on.
   */
  side?: TooltipSide

  /**
   * Distance in px between the trigger and the tooltip.
   */
  offset?: number

  /**
   * Render `#content` without the bubble shell. The arrow still renders.
   * Use it for content that brings its own surface, like an image preview.
   */
  bare?: boolean

  /**
   * Disables the tooltip entirely. The trigger still renders.
   */
  disabled?: boolean
}
