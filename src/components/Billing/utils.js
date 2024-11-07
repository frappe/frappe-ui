export function calculateTrialEndDays(trialEndDate) {
  if (!trialEndDate) return 0

  trialEndDate = new Date(trialEndDate)
  const today = new Date()
  const diffTime = trialEndDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export function currency(value, currency, fractions = 2) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: fractions,
  }).format(value)
}
