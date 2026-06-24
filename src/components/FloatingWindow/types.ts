/** The three window states a FloatingWindow can be in. */
export type WindowMode = 'docked' | 'floating' | 'minimized'

/** Position + size of a floating panel, in viewport pixels. */
export interface Rect {
  x: number
  y: number
  width: number
  height: number
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
