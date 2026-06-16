/** The four window states a FloatingWindow can be in. */
export type WindowMode = 'docked' | 'floating' | 'minimized' | 'maximized'

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
  /** Default floating size, used when popping out (and absent any saved rect). */
  initialWidth?: number
  initialHeight?: number
  /** Smallest the panel can be resized to. */
  minWidth?: number
  minHeight?: number
  /**
   * localStorage key to persist `{ mode, rect }` under. When null, geometry
   * resets every session.
   */
  storageKey?: string | null
}
