import type { PortalTarget } from '../../composables/usePortalTarget'
export type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
export type PopoverAlign = 'start' | 'center' | 'end'

export interface PopoverProps {
  /** Controls visibility (v-model:open). */
  open?: boolean

  /** Side of the trigger to render the content on. */
  side?: PopoverSide

  /** Alignment of the content along the chosen side. */
  align?: PopoverAlign

  /** Distance in px between the trigger and the content. */
  offset?: number

  /** Where to portal the content. Unset, an embedding host's target is used, else `body`. */
  portalTo?: PortalTarget

  /** Padding in px kept from the viewport edge during collision handling. */
  collisionPadding?: number

  /** Whether the popover closes on outside interaction (click/focus). */
  dismissible?: boolean

  /** Whether the content's min-width matches the trigger width. */
  matchTriggerWidth?: boolean

  /**
   * Render `#default` without the panel shell (no background, border, shadow,
   * or rounding). The content brings its own surface. Mirrors Dialog's `bare`.
   */
  bare?: boolean

  /**
   * Render a small arrow pointing at the trigger. Styled to match the panel
   * surface.
   */
  arrow?: boolean
}

export interface PopoverEmits {
  /** Fired when the open state changes. */
  (event: 'update:open', value: boolean): void
  /** Fired when the popover opens. */
  (event: 'open'): void
  /** Fired when the popover closes. */
  (event: 'close'): void
}

/** Slot props passed to the `#trigger` and `#default` slots. */
export interface PopoverSlotProps {
  /** Whether the popover is currently open. */
  open: boolean
  /** Closes the popover. No-op when it is already closed. */
  close: () => void
  /** Flips the open state, or sets it when passed a boolean. */
  toggle: (flag?: boolean | Event) => void
}

/** Methods available on a `<Popover>` template ref. */
export interface PopoverExposed {
  /** Opens the popover. No-op when it is already open. */
  open: () => void
  /** Closes the popover. No-op when it is already closed. */
  close: () => void
}
