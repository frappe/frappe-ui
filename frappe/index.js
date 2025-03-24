// help components
export { default as HelpModal } from './Help/HelpModal.vue'

// onboarding components
export { default as GettingStartedBanner } from './Onboarding/GettingStartedBanner.vue'
export { default as OnboardingSteps } from './Onboarding/OnboardingSteps.vue'
export { default as IntermediateStepModal } from './Onboarding/IntermediateStepModal.vue'

// help center components
export { default as HelpCenter } from './HelpCenter/HelpCenter.vue'

// billing components
export { default as TrialBanner } from './Billing/TrialBanner.vue'
export { default as SignupBanner } from './Billing/SignupBanner.vue'

// composables
export { useOnboarding } from './Onboarding/onboarding.js'

// utils
export { showHelpModal, minimize } from './Help/help.js'
export { showHelpCenter } from './HelpCenter/helpCenter.js'
