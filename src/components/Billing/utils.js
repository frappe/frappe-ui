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
      () => import('../../icons/MasterCard.vue'),
    ),
    mastercard: defineAsyncComponent(
      () => import('../../icons/MasterCard.vue'),
    ),
    visa: defineAsyncComponent(() => import('../../icons/Visa.vue')),
    amex: defineAsyncComponent(() => import('../../icons/Amex.vue')),
    jcb: defineAsyncComponent(() => import('../../icons/JCB.vue')),
    generic: defineAsyncComponent(() => import('../../icons/Generic.vue')),
    'union-pay': defineAsyncComponent(() => import('../../icons/UnionPay.vue')),
  }[brand || 'generic']

  if (!component) {
    component = defineAsyncComponent(() => import('../../icons/Generic.vue'))
  }

  return h(component, { class: 'size-6' })
}
