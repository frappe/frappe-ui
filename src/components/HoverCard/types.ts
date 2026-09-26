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
   * Delay in milliseconds before the card opens. Default: `300`.
   */
  hoverDelay?: number

  /**
   * Delay in milliseconds before the card closes. Default: `300`.
   */
  leaveDelay?: number

  /**
   * Render a small arrow pointing at the trigger. Styled to match the panel
   * surface.
   */
  arrow?: boolean

  /** Controls the visibility of the hover card. */
  open?: boolean
}

/** Slot props passed to the `#trigger` slot. */
export interface HoverCardSlotProps {
  /** Whether the card is currently open. */
  open: boolean
  /** Sets the card open state. */
  setOpen: (value: boolean) => void
  /** Closes the card. */
  close: () => void
}

export interface HoverCardEmits {
  /** Fired when the card open state changes. */
  'update:open': [open: boolean]
}

/** Methods available on a `<HoverCard>` template ref. */
export interface HoverCardExposed {
  /** Opens the card. */
  open: () => void
  /** Closes the card. */
  close: () => void
}
