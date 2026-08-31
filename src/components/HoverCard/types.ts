import type { PopoverAlign, PopoverSide } from '../Popover/types'
import type { PortalTarget } from '../../composables/usePortalTarget'

export interface HoverCardProps {
  /**
   * Side of the trigger the card is placed on.
   */
  side?: PopoverSide

  /**
   * Alignment of the card relative to the trigger.
   */
  align?: PopoverAlign

  /**
   * Distance in pixels between the card and the trigger.
   */
  offset?: number

  /**
   * Where the card is teleported to in the DOM. Unset, an embedding host's target is used, else `body`.
   */
  portalTo?: PortalTarget

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

/** Slot props passed to the `#trigger` slot. */
export interface HoverCardSlotProps {
  /** Whether the card is currently open. */
  open: boolean
}

/** Methods available on a `<HoverCard>` template ref. */
export interface HoverCardExposed {
  /** Opens the card. */
  open: () => void
  /** Closes the card. */
  close: () => void
}
