import call from '../../src/utils/call'
import { createResource } from '../../src/resources'
import { minimize, showHelpModal } from '../Help/help'
import { sessionUser } from '../session'
import { useStorage } from '@vueuse/core'
import { computed, reactive } from 'vue'

const onboardings = reactive({})
const onboardingStatus = useStorage('onboardingStatus', {})

export function useOnboarding(appName) {
  const user = sessionUser()

  if (!user || user === 'Guest') return

  const isOnboardingStepsCompleted = useStorage(
    'isOnboardingStepsCompleted' + appName + user,
    false,
  )

  const onboardingSteps = computed(
    () =>
      onboardingStatus.value?.[user]?.[appName + '_onboarding_status'] || [],
  )

  if (!onboardingSteps.value.length && !isOnboardingStepsCompleted.value) {
    createResource({
      url: 'frappe.onboarding.get_onboarding_status',
      cache: 'onboarding_status',
      auto: true,
      onSuccess: (data) => {
        onboardingStatus.value[user] = data
        syncStatus()
      },
    })
  }

  const stepsCompleted = computed(
    () => onboardings[appName]?.filter((step) => step.completed).length || 0,
  )
  const totalSteps = computed(() => onboardings[appName]?.length || 0)

  const completedPercentage = computed(() =>
    Math.floor((stepsCompleted.value / totalSteps.value) * 100),
  )

  function skip(step, callback = null) {
    updateOnboardingStep(step, true, true, callback)
  }

  function skipAll(callback = null) {
    updateAll(true, callback)
  }

  function reset(step, callback = null) {
    updateOnboardingStep(step, false, false, callback)
  }

  function resetAll(callback = null) {
    updateAll(false, callback)
  }

  function updateOnboardingStep(
    step,
    value = true,
    skipped = false,
    callback = null,
  ) {
    if (isOnboardingStepsCompleted.value) return

    if (!onboardingSteps.value.length) {
      if (!onboardingStatus.value[user]) {
        onboardingStatus.value[user] = {}
      }
      onboardingStatus.value[user][appName + '_onboarding_status'] =
        onboardings[appName].map((s) => {
          return { name: s.name, completed: false }
        })
    }

    let index = onboardingSteps.value.findIndex((s) => s.name === step)
    if (index !== -1) {
      onboardingSteps.value[index].completed = value
      onboardings[appName][index].completed = value
    }

    updateUserOnboardingStatus(onboardingSteps.value)

    callback?.(step, skipped)

    minimize.value = false
  }

  function updateAll(value, callback = null) {
    if (isOnboardingStepsCompleted.value && value) return

    if (!onboardingSteps.value.length) {
      if (!onboardingStatus.value[user]) {
        onboardingStatus.value[user] = {}
      }

      onboardingStatus.value[user][appName + '_onboarding_status'] =
        onboardings[appName].map((s) => {
          return { name: s.name, completed: value }
        })
    } else {
      onboardingSteps.value.forEach((step) => {
        step.completed = value
      })
    }

    onboardings[appName].forEach((step) => {
      step.completed = value
    })

    updateUserOnboardingStatus(onboardingSteps.value)

    callback?.(value)
  }

  function updateUserOnboardingStatus(steps) {
    call('frappe.onboarding.update_user_onboarding_status', {
      steps: JSON.stringify(steps),
      appName,
    })
  }

  function syncStatus() {
    if (isOnboardingStepsCompleted.value) return

    if (onboardingSteps.value.length) {
      let _steps = onboardingSteps.value
      _steps.forEach((step, index) => {
        onboardings[appName][index].completed = step.completed
      })
      isOnboardingStepsCompleted.value = _steps.every((step) => step.completed)
    } else {
      isOnboardingStepsCompleted.value = false
    }
  }

  function setUp(steps) {
    showHelpModal.value = !isOnboardingStepsCompleted.value

    if (onboardings[appName]) return

    onboardings[appName] = steps
    syncStatus()
  }

  return {
    steps: onboardings[appName],
    stepsCompleted,
    totalSteps,
    completedPercentage,
    isOnboardingStepsCompleted,
    updateOnboardingStep,
    skip,
    skipAll,
    reset,
    resetAll,
    setUp,
    syncStatus,
  }
}
