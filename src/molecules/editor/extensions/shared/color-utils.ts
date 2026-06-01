/**
 * Back-compat barrel for the named-color modules.
 *
 * The implementation now lives in three focused modules — `color-palette`
 * (palette + hex anchors), `color-parse` (pure parsers + closest-match), and
 * `color-style` (style extraction + CSS-var builders). This barrel re-exports
 * all of them so external importers of the old `color-utils` path keep
 * resolving. NOT deleted.
 */

export * from './color-palette'
export * from './color-parse'
export * from './color-style'
