// onboarding components
export { default as GettingStartedBanner } from './components/GettingStartedBanner.vue'
export { default as OnboardingSteps } from './components/OnboardingSteps.vue'

// help components
export { default as HelpModal } from './components/HelpModal.vue'

// composable
export { useOnboarding } from './composables/onboarding.js'
export { showHelpModal, showHelpCenter, minimize } from './composables/help.js'
