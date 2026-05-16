/**
 * Pure time helpers for TimePicker.
 *
 * Canonical value shape is `HH:mm` or `HH:mm:ss` (24-hour). All parsing,
 * formatting, range checks, and option generation hangs off those two forms.
 */

export interface ParsedTimeValid {
  valid: true
  hh24: string
  mm: string
  ss?: string
  total: number
}
export interface ParsedTimeInvalid {
  valid: false
}
export type ParsedTime = ParsedTimeValid | ParsedTimeInvalid

export interface TimeOption {
  value: string
  label: string
}

/**
 * Parse human-typed times: `3p`, `3pm`, `3.30pm`, `15:00`, `1500`, `15`,
 * `9:30:15 am`. Returns canonical components plus total minutes from midnight.
 */
export function parseFlexibleTime(input: string): ParsedTime {
  if (!input) return { valid: false }
  let s = input.trim().toLowerCase()
  s = s.replace(/\./g, '')
  s = s.replace(/(\d)(am|pm)$/, '$1 $2')

  // Bare 3- or 4-digit forms: `930` → `9:30`, `1500` → `15:00`.
  const compact = s.match(/^(\d{3,4})\s*([ap]m)?$/)
  if (compact) {
    const digits = compact[1]
    const ap = compact[2]
    const hh = digits.length === 3 ? digits.slice(0, 1) : digits.slice(0, 2)
    const mm = digits.slice(-2)
    s = ap ? `${hh}:${mm} ${ap}` : `${hh}:${mm}`
  }

  const m = s.match(/^(\d{1,2})(?::(\d{1,2}))?(?::(\d{1,2}))?\s*([ap]m)?$/)
  if (!m) return { valid: false }
  const [, hhStr, mmStr, ssStr, ap] = m
  let hh = parseInt(hhStr, 10)
  if (isNaN(hh) || hh < 0 || hh > 23) return { valid: false }
  if (ssStr && !mmStr) return { valid: false }
  const mm = mmStr != null && mmStr !== '' ? parseInt(mmStr, 10) : 0
  if (isNaN(mm) || mm < 0 || mm > 59) return { valid: false }
  let ss: number | undefined
  if (ssStr) {
    ss = parseInt(ssStr, 10)
    if (isNaN(ss) || ss < 0 || ss > 59) return { valid: false }
  }
  if (ap) {
    if (hh < 1 || hh > 12) return { valid: false }
    if (hh === 12 && ap === 'am') hh = 0
    else if (hh < 12 && ap === 'pm') hh += 12
  }
  return {
    valid: true,
    hh24: hh.toString().padStart(2, '0'),
    mm: mm.toString().padStart(2, '0'),
    ss: ss != null ? ss.toString().padStart(2, '0') : undefined,
    total: hh * 60 + mm,
  }
}

/** Coerce any accepted time string to canonical `HH:mm` / `HH:mm:ss`. */
export function normalize24(raw: string): string {
  if (!raw) return ''
  if (/^\d{2}:\d{2}$/.test(raw)) return raw
  if (/^\d{2}:\d{2}:\d{2}$/.test(raw)) return raw
  const parsed = parseFlexibleTime(raw)
  if (!parsed.valid) return ''
  return parsed.ss
    ? `${parsed.hh24}:${parsed.mm}:${parsed.ss}`
    : `${parsed.hh24}:${parsed.mm}`
}

/** Render a canonical value for display. Hours are zero-padded. */
export function formatTime(val24: string, use12Hour: boolean): string {
  if (!val24) return ''
  const segs = val24.split(':')
  const h = parseInt(segs[0], 10)
  const m = parseInt(segs[1], 10)
  const s = segs[2]
  const mm = m.toString().padStart(2, '0')
  const ss = s ? `:${s}` : ''
  if (!use12Hour) {
    return `${h.toString().padStart(2, '0')}:${mm}${ss}`
  }
  const am = h < 12
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12.toString().padStart(2, '0')}:${mm}${ss} ${am ? 'am' : 'pm'}`
}

/** Total minutes (0–1439) from an `HH:mm[:ss]` string, or null if malformed. */
export function minutesFromHHMM(str: string): number | null {
  if (!str) return null
  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(str)) return null
  const [h, m] = str.split(':').map((n) => parseInt(n, 10))
  if (h > 23 || m > 59) return null
  return h * 60 + m
}

export function isOutOfRange(
  totalMinutes: number,
  minMinutes: number | null,
  maxMinutes: number | null,
): boolean {
  if (minMinutes != null && totalMinutes < minMinutes) return true
  if (maxMinutes != null && totalMinutes > maxMinutes) return true
  return false
}

/**
 * Build interval-spaced options across the day, optionally bounded by
 * min/max. Returns canonical `HH:mm` values with display labels.
 */
export function generateTimeOptions({
  interval,
  use12Hour,
  minMinutes,
  maxMinutes,
}: {
  interval: number
  use12Hour: boolean
  minMinutes: number | null
  maxMinutes: number | null
}): TimeOption[] {
  const out: TimeOption[] = []
  for (let m = 0; m < 1440; m += interval) {
    if (isOutOfRange(m, minMinutes, maxMinutes)) continue
    const hh = Math.floor(m / 60)
      .toString()
      .padStart(2, '0')
    const mm = (m % 60).toString().padStart(2, '0')
    const value = `${hh}:${mm}`
    out.push({ value, label: formatTime(value, use12Hour) })
  }
  return out
}

/** Index of the option whose minute total is closest to `targetMinutes`. */
export function findNearestIndex(
  targetMinutes: number,
  options: TimeOption[],
): number {
  if (!options.length) return -1
  const minutes = options.map((o) => {
    const [hh, mm] = o.value.split(':').map(Number)
    return hh * 60 + mm
  })
  let lo = 0
  let hi = minutes.length - 1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (minutes[mid] === targetMinutes) return mid
    if (minutes[mid] < targetMinutes) lo = mid + 1
    else hi = mid - 1
  }
  const candidates: number[] = []
  if (lo < minutes.length) candidates.push(lo)
  if (lo - 1 >= 0) candidates.push(lo - 1)
  if (!candidates.length) return -1
  return candidates.sort(
    (a, b) =>
      Math.abs(minutes[a] - targetMinutes) -
      Math.abs(minutes[b] - targetMinutes),
  )[0]
}
