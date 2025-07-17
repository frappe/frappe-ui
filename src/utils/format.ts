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
    throw new Error('Invalid value for formatting: ' + value)
  }

  const {
    locale = getLocale(),
    precision = getConfig('precision') || 0,
    currency = getConfig('currency') || 'INR',
    compact = false,
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

export function formatTime(seconds: number) {
  const days = Math.floor(seconds / (3600 * 24))
  const hours = Math.floor((seconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  let formattedTime = ''

  if (days > 0) {
    formattedTime += `${days}d `
  }

  if (hours > 0 || days > 0) {
    formattedTime += `${hours}h `
  }

  if (minutes > 0 || hours > 0 || days > 0) {
    formattedTime += `${minutes}m `
  }

  formattedTime += `${remainingSeconds}s`

  return formattedTime.trim()
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

export function formatDate(
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

  const format = determineFormat(options)
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
  return getConfig('locale') || navigator.language || 'en-US'
}

function determineFormat(options: FormatDateOpts) {
  const dateFormat = getConfig('defaultDateFormat') || 'ddd, MMM D, YYYY'
  const timeFormat = getConfig('defaultTimeFormat') || 'h:mm a'

  const defaultFormat = `${dateFormat} ${timeFormat}`

  let format = options.format || defaultFormat
  if (options.onlyDate && options.onlyTime) {
    format = defaultFormat
  } else if (options.onlyDate) {
    format = dateFormat
  } else if (options.onlyTime) {
    format = timeFormat
  }
  return format
}
