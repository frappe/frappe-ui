/**
 * Which series the legend has switched off. Kept as pure functions because the
 * list is either component state or a `v-model:hiddenSeries` the caller owns,
 * and both paths have to reach the same answer.
 */

/** Toggles one series, refusing to hide the last visible one — an empty plot reads as a bug. */
export function toggleHiddenSeries(
  hidden: string[],
  name: string,
  seriesCount: number,
): string[] {
  if (hidden.includes(name)) return hidden.filter((n) => n !== name)
  if (hidden.length >= seriesCount - 1) return hidden
  return [...hidden, name]
}

/**
 * Drops names the chart no longer draws. Returns the list unchanged when there
 * is nothing to drop, so a controlled `hiddenSeries` doesn't emit on every
 * re-render.
 */
export function pruneHiddenSeries(hidden: string[], names: string[]): string[] {
  const kept = hidden.filter((name) => names.includes(name))
  return kept.length === hidden.length ? hidden : kept
}
