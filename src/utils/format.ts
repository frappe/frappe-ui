import { getConfig } from './config'

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

  const defaultLocale = getConfig('locale') || 'en-US'
  const defaultPrecision = getConfig('precision') || 2
  const defaultCurrency = getConfig('currency') || 'INR'
  const {
    locale = defaultLocale,
    precision = defaultPrecision,
    currency = defaultCurrency,
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
