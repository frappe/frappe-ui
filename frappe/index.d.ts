// Since the export is via JS file, we need to declare the module here
declare module 'frappe-ui/frappe' {
  import type { Component, ComputedRef, Ref } from 'vue'

  // Onboarding
  export interface OnboardingStep {
    name: string
    completed: boolean
    [key: string]: any
  }

  export function useOnboarding(appName: string):
    | {
        steps: OnboardingStep[]
        stepsCompleted: ComputedRef<number>
        totalSteps: ComputedRef<number>
        completedPercentage: ComputedRef<number>
        isOnboardingStepsCompleted: Ref<boolean>
        updateOnboardingStep: (
          step: string,
          value?: boolean,
          skipped?: boolean,
          callback?: ((step: string, skipped: boolean) => void) | null,
        ) => void
        skip: (
          step: string,
          callback?: ((step: string, skipped: boolean) => void) | null,
        ) => void
        skipAll: (callback?: ((value: boolean) => void) | null) => void
        reset: (
          step: string,
          callback?: ((step: string, skipped: boolean) => void) | null,
        ) => void
        resetAll: (callback?: ((value: boolean) => void) | null) => void
        setUp: (steps: OnboardingStep[]) => void
        syncStatus: () => void
      }
    | undefined

  // Help Modal
  export const showHelpModal: Ref<boolean>
  export const minimize: Ref<boolean>
  export const HelpModal: Component

  // Banners
  export const GettingStartedBanner: Component
  export const TrialBanner: Component
  export const IntermediateStepModal: Component

  //   Components
  export const Link: Component
  export type { LinkProps } from './Link/types'
}

// Data Import
export const DataImport: Component
