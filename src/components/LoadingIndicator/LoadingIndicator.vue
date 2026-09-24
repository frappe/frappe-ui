<template>
  <Spinner v-bind="props" />
</template>

<script setup lang="ts">
import { Spinner, type SpinnerProps } from '../Spinner'
import { warnDeprecated } from '../../utils/warnDeprecated'

const props = defineProps<SpinnerProps>()

warnDeprecated(
  'LoadingIndicator',
  'Spinner',
  'https://ui.frappe.io/docs/migration#loadingindicator-deprecated',
)
</script>
