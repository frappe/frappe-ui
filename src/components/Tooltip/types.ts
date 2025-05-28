import { type HTMLAttributes } from 'vue'
import { type TooltipContentProps } from 'reka-ui'

export interface TooltipProps {
  text?: string
  hoverDelay?: number
  placement?: TooltipContentProps['side']
  arrowClass?: HTMLAttributes['class']
  disabled?: boolean
}
