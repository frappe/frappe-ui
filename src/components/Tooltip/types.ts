import { type HTMLAttributes } from 'vue'
import { type TooltipContentProps } from 'reka-ui'

export interface TooltipProps {
  /**
   * Text content shown inside the tooltip.
   * Ignored if a default slot is provided.
   */
  text?: string

  /**
   * Delay (in ms) before showing the tooltip on hover.
   */
  hoverDelay?: number

  /**
   * Position of the tooltip relative to the trigger.
   */
  placement?: TooltipContentProps['side']

  /**
   * Custom classes applied to the tooltip arrow.
   */
  arrowClass?: HTMLAttributes['class']

  /**
   * Disables the tooltip entirely.
   */
  disabled?: boolean
}

