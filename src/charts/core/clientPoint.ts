/**
 * Where the pointer is on screen, from the native event behind a zrender
 * event. zrender listens for touch events where the browser has them, so on a
 * phone that event is a TouchEvent, which keeps its point on the touch rather
 * than on itself. The touch is the one zrender hit-tests: the finger on the
 * plot, or the lifted finger, which is only in `changedTouches`.
 */
export function clientPoint(
  event: Event | undefined,
): { x: number; y: number } | undefined {
  if (!event) return undefined
  if ('clientX' in event) {
    const mouse = event as MouseEvent
    return { x: mouse.clientX, y: mouse.clientY }
  }
  const touches = event as TouchEvent
  const touch = touches.targetTouches?.[0] ?? touches.changedTouches?.[0]
  return touch ? { x: touch.clientX, y: touch.clientY } : undefined
}
