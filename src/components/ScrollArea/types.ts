export interface ScrollAreaProps {
  /** Which scrollbars to render. */
  orientation?: 'vertical' | 'horizontal' | 'both'
  /** Idle delay (ms) before the thumb fades out. */
  scrollHideDelay?: number
  /** Extra classes for the scrolling viewport (e.g. padding). */
  viewportClass?: string
}

export interface ScrollBarProps {
  /** Which axis this bar scrolls. */
  orientation?: 'vertical' | 'horizontal'
}

export interface ScrollAreaExposed {
  /** The element that actually scrolls. Null until mounted. */
  viewportElement: HTMLElement | null
}
