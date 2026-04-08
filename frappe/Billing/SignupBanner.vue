<template>
  <div
    v-if="!isSidebarCollapsed"
    class="flex flex-col gap-3 rounded-lg bg-surface-white px-3 py-2.5 text-base shadow-sm"
  >
    <div class="flex flex-col gap-1">
      <slot>
        <div class="inline-flex items-center gap-2 font-medium">
          <FeatherIcon class="h-4" name="info" />
          Loved the demo?
        </div>
        <div class="text-p-sm text-ink-gray-7">
          {{ `Try ${appName} for free with a 14-day trial.` }}
        </div>
      </slot>
    </div>
    <Button label="Sign up now" theme="blue" @click="signupNow">
      <template #prefix>
        <LightningIcon class="size-4" />
      </template>
    </Button>
  </div>
  <Button v-else @click="signupNow">
    <LightningIcon class="my-0.5 h-4 shrink-0" />
  </Button>
</template>
<script setup>
import LightningIcon from '../../icons/LightningIcon.vue'

const props = defineProps({
  isSidebarCollapsed: {
    type: Boolean,
    default: false,
  },
  appName: {
    type: String,
    default: 'Frappe CRM',
  },
  redirectURL: {
    type: String,
    default: 'https://frappecloud.com/crm/signup',
  },
  afterSignup: {
    type: Function,
    default: () => {},
  },
})

function signupNow() {
  window.open(props.redirectURL, '_blank')
  props.afterSignup?.()
}
</script>
