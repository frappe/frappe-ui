/** Columns a user may pick in the grid. The single source for the Select + clamps. */
export const ALLOWED_COLUMNS = [2, 3, 4];
/** Default columns when none stored, kept in range. */
export const DEFAULT_COLUMNS = 4;
/**
 * Clamp an arbitrary column value to the allowed set. Anything outside the set
 * snaps to the nearest allowed value (NaN / falsy → {@link DEFAULT_COLUMNS}).
 * Consumed by commands, `parseHTML`/`addAttributes`, the dialog Select and the
 * node view so a hand-edited `data-columns` can never render an invalid grid.
 */
export function clampColumns(value) {
    const n = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(n) || n <= 0)
        return DEFAULT_COLUMNS;
    let closest = ALLOWED_COLUMNS[0];
    let bestDelta = Infinity;
    for (const allowed of ALLOWED_COLUMNS) {
        const delta = Math.abs(allowed - n);
        if (delta < bestDelta) {
            bestDelta = delta;
            closest = allowed;
        }
    }
    return closest;
}
/**
 * Pick a sensible default column count for a fresh group of `count` images,
 * clamped to the allowed set.
 */
export function getDefaultColumns(count) {
    if (count <= 0)
        return DEFAULT_COLUMNS;
    if (count <= 4)
        return clampColumns(count);
    if (count % 4 === 0)
        return 4;
    if (count % 3 === 0)
        return 3;
    return 4;
}
/**
 * Deterministic id for a staged file item. Two files with the same name + size
 * collide intentionally — that is the dedupe key. NOT `Date.now()`-based, so the
 * same input always yields the same id (stable `:key`, testable).
 */
export function fileItemId(file) {
    return `file-${file.name}-${file.size}`;
}
/** Deterministic id for an existing (already-uploaded) image item. */
export function existingItemId(existing) {
    return `existing-${existing.src}`;
}
/**
 * HEIC/HEIF (and similar) files cannot be previewed by browsers. Used to render
 * a filename placeholder instead of a broken `<img>`.
 */
export function isImageSupported(file) {
    const unsupportedTypes = ['image/heic', 'image/heif'];
    const unsupportedExtensions = ['.heic', '.heif'];
    const hasUnsupportedType = unsupportedTypes.includes(file.type);
    const hasUnsupportedExtension = unsupportedExtensions.some((ext) => file.name?.toLowerCase().endsWith(ext));
    return !hasUnsupportedType && !hasUnsupportedExtension;
}
/** Keep only files whose MIME type is an image. */
export function filterImageFiles(files) {
    return files.filter((file) => file.type.startsWith('image/'));
}
/** Build the Select options for the column picker from the allowed set. */
export function columnSelectOptions() {
    return ALLOWED_COLUMNS.map((n) => ({
        label: `${n} columns`,
        value: String(n),
    }));
}
