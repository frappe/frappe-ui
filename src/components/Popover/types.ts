export type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
export type PopoverAlign = 'start' | 'center' | 'end'

/** Legacy placement union (deprecated — use `side` + `align`). */
export type PopoverPlacement =
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'right-start'
  | 'right-end'
  | 'left-start'
  | 'left-end'
  | 'top'
  | 'bottom'
  | 'right'
  | 'left'

export interface PopoverProps {
  /** Controls visibility (v-model:open). */
  open?: boolean

  /** Side of the trigger to render the content on. */
  side?: PopoverSide

  /** Alignment of the content along the chosen side. */
  align?: PopoverAlign

  /** Distance in px between the trigger and the content. */
  offset?: number

  /** Where to portal the content. */
  portalTo?: string | HTMLElement

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

  // ---------------------------------------------------------------------------
  // Deprecated props (kept working through v1.x — see Popover.vue back-compat).
  // ---------------------------------------------------------------------------

  /** @deprecated Use `open` / `v-model:open`. */
  show?: boolean

  /** @deprecated Use `<HoverCard>` for hover behavior. */
  trigger?: 'click' | 'hover'

  /** @deprecated Use `<HoverCard>` (`hoverDelay`, in seconds). */
  hoverDelay?: number

  /** @deprecated Use `<HoverCard>` (`leaveDelay`, in seconds). */
  leaveDelay?: number

  /** @deprecated Use `side` + `align`. */
  placement?: PopoverPlacement

  /** @deprecated Use the `data-slot` CSS hooks (no-op). */
  popoverClass?: string | object | Array<string | object>

  /** @deprecated Motion is now built in (no-op). */
  transition?: 'default' | null

  /** @deprecated Use `dismissible`. */
  hideOnBlur?: boolean

  /** @deprecated Use `matchTriggerWidth`. */
  matchTargetWidth?: boolean
}

export interface PopoverEmits {
  /** Fired when the open state changes (canonical). */
  (event: 'update:open', value: boolean): void
  /** Fired when the popover opens. */
  (event: 'open'): void
  /** Fired when the popover closes. */
  (event: 'close'): void
  /** @deprecated Use `update:open`. */
  (event: 'update:show', value: boolean): void
}

/** Slot props passed to the new `#trigger` / `#default` slots. */
export interface PopoverSlotProps {
  open: () => void
  close: () => void
  toggle: (flag?: boolean | Event) => void
  isOpen: boolean
}

/**
 * Slot props passed to the deprecated `#target` / `#body` / `#body-main`
 * slots. Preserved verbatim so existing callers do not double-toggle.
 */
export interface PopoverLegacySlotProps {
  togglePopover: () => void
  updatePosition: () => void
  open: () => void
  close: () => void
  toggle: (flag?: boolean | Event) => void
  isOpen: boolean
}
