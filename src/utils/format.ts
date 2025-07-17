import { getConfig } from './config'
import { dayjs } from './dayjs'

type NumberFormatOptions = {
  locale?: string
  precision?: number
  currency?: string
  compact?: boolean
}

export function formatNumber(value: number, options: NumberFormatOptions = {}) {
  if (isNaN(value) || value === null || value === undefined) {
    return value
  }

  const {
    locale = getLocale(),
    precision = getConfig('defaultPrecision') || 0,
    currency,
    compact,
  } = options

  const style = currency ? 'currency' : 'decimal'
  const notation = compact ? 'compact' : undefined

  const formatter = new Intl.NumberFormat(locale, {
    style,
    currency,
    notation,
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })

  let forattedValue = formatter.format(value)

  if (compact && locale === 'en-IN') {
    // Replace 'T' with 'K' for Indian locale
    forattedValue = forattedValue.replace('T', 'K')
  }

  return forattedValue
}

export function formatCurrency(
  value: number,
  currency?: string,
  options: NumberFormatOptions = {},
) {
  return formatNumber(value, {
    ...options,
    currency: currency || getConfig('defaultCurrency') || undefined,
  })
}

export function formatSeconds(seconds: number) {
  const days = Math.floor(seconds / (3600 * 24))
  const hours = Math.floor((seconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  let formatted = ''

  if (days > 0) {
    formatted += `${days}d `
  }

  if (hours > 0 || days > 0) {
    formatted += `${hours}h `
  }

  if (minutes > 0 || hours > 0 || days > 0) {
    formatted += `${minutes}m `
  }

  formatted += `${remainingSeconds}s`

  return formatted.trim()
}

type FormatDateValue = Date | string | null | undefined
type FormatDateOpts = {
  format?: string
  onlyDate?: boolean
  onlyTime?: boolean
  locale?: string
  timeZone?: string
  utc?: boolean
  relative?: boolean
}

export function formatDateTime(
  value: FormatDateValue,
  options: FormatDateOpts = {},
) {
  if (!value) return ''

  let d = dayjs(value, { utc: options.utc })
  d = d.tz(options.timeZone || getTimezone())
  d = d.locale(options.locale || getLocale())

  if (options.relative) {
    return d.isAfter(dayjs()) ? d.toNow() : d.fromNow()
  }

  const format = options.format || getDefaultFormat(options)
  return d.format(format)
}

function getTimezone() {
  const localTimezone = getConfig('localTimezone')
  if (localTimezone) return localTimezone

  const systemTimezone = getConfig('systemTimezone')
  if (systemTimezone) return systemTimezone

  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return browserTimezone
}

function getLocale() {
  return getConfig('userLocale') || navigator.language || 'en-US'
}

function getDefaultFormat(options: FormatDateOpts) {
  const dateFormat = getConfig('defaultDateFormat') || 'ddd, MMM D, YYYY'
  const timeFormat = getConfig('defaultTimeFormat') || 'h:mm a'

  const defaultFormat = `${dateFormat} ${timeFormat}`

  let format = defaultFormat
  if (options.onlyDate) {
    format = dateFormat
  } else if (options.onlyTime) {
    format = timeFormat
  }
  return format
}

export function formatDate(
  value: FormatDateValue,
  options: FormatDateOpts = {},
) {
  return formatDateTime(value, { ...options, onlyTime: false, onlyDate: true })
}

export function formatTime(
  value: FormatDateValue,
  options: FormatDateOpts = {},
) {
  return formatDateTime(value, { ...options, onlyDate: false, onlyTime: true })
}
