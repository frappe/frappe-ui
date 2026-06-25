import { type HoverCardContentProps, type HoverCardPortalProps } from 'reka-ui'

export interface HoverCardProps {
  /**
   * Side of the trigger the card is placed on.
   */
  side?: HoverCardContentProps['side']

  /**
   * Alignment of the card relative to the trigger.
   */
  align?: HoverCardContentProps['align']

  /**
   * Distance in pixels between the card and the trigger.
   */
  offset?: number

  /**
   * Where the card is teleported to in the DOM.
   */
  portalTo?: HoverCardPortalProps['to']

  /**
   * Padding (in pixels) kept between the card and the viewport edges when
   * repositioning to avoid collisions.
   */
  collisionPadding?: number

  /**
   * Delay (in seconds) from when the pointer enters the trigger until the card
   * opens. Matches the Tooltip convention of using seconds.
   */
  hoverDelay?: number

  /**
   * Delay (in seconds) from when the pointer leaves the trigger or card until
   * the card closes.
   */
  leaveDelay?: number

  /**
   * Render a small arrow pointing at the trigger. Styled to match the panel
   * surface.
   */
  arrow?: boolean
}

export type HoverCardEmits = {
  'update:open': [value: boolean]
}
