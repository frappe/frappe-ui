import { defineAsyncComponent, h } from 'vue'

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

export function cardBrandIcon(brand) {
  let component = {
    'master-card': defineAsyncComponent(
      () => import('./logo/MasterCard.vue'),
    ),
    mastercard: defineAsyncComponent(
      () => import('./logo/MasterCard.vue'),
    ),
    visa: defineAsyncComponent(() => import('./logo/Visa.vue')),
    amex: defineAsyncComponent(() => import('./logo/Amex.vue')),
    jcb: defineAsyncComponent(() => import('./logo/JCB.vue')),
    generic: defineAsyncComponent(() => import('./logo/Generic.vue')),
    'union-pay': defineAsyncComponent(() => import('./logo/UnionPay.vue')),
  }[brand || 'generic']

  if (!component) {
    component = defineAsyncComponent(() => import('./logo/Generic.vue'))
  }

  return h(component, { class: 'size-6' })
}

export function parseSize(sizeInMB) {
  if (sizeInMB < 1024) {
    return `${sizeInMB} MB`
  } else {
    return `${(sizeInMB / 1024).toFixed(0)} GB`
  }
}
