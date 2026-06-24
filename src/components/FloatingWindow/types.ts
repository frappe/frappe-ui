/** The three window states a FloatingWindow can be in. */
export type WindowMode = 'docked' | 'floating' | 'minimized'

/** Position + size of a floating panel, in viewport pixels. */
export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Which edges a resize drag pulls. `-1` pulls the top/left edge (and moves the
 * panel so the opposite edge stays put), `1` the bottom/right edge, `0` leaves
 * that axis fixed. A corner sets both axes.
 */
export interface ResizeDir {
  x: -1 | 0 | 1
  y: -1 | 0 | 1
}

/** Options for the headless useFloatingWindow composable. */
export interface FloatingWindowOptions {
  /** Initial window state. */
  initialMode?: WindowMode
  /**
   * localStorage key to persist `{ mode, rect }` under. When null, geometry
   * resets every session.
   */
  storageKey?: string | null
}
