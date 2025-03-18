// onboarding components
export { default as GettingStartedBanner } from './components/Onboarding/GettingStartedBanner.vue'
export { default as OnboardingSteps } from './components/Onboarding/OnboardingSteps.vue'

// help components
export { default as HelpModal } from './components/Help/HelpModal.vue'

// composable
export { useOnboarding } from './composables/onboarding.js'
export { showHelpModal, showHelpCenter, minimize } from './composables/help.js'
