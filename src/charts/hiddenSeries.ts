/**
 * Which series the legend has switched off. Kept as pure functions because the
 * list is either component state or a `v-model:hiddenSeries` the caller owns,
 * and both paths have to reach the same answer.
 */

/**
 * Toggles one series, refusing to hide the last one drawn — an empty plot reads
 * as a bug. `drawn` is what the plot draws, not what is unhidden: a slice worth
 * nothing has a legend entry and no mark, so it can neither hold the plot up
 * nor empty it.
 */
export function toggleHiddenSeries(
  hidden: string[],
  name: string,
  drawn: string[],
): string[] {
  if (hidden.includes(name)) return hidden.filter((n) => n !== name)
  if (drawn.length === 1 && drawn[0] === name) return hidden
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
