<script setup lang="ts">
import { Stepper } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const steps = [
  {
    value: 'account',
    label: 'Account',
    description: 'Name, email and password',
  },
  {
    value: 'workspace',
    label: 'Workspace',
    description: 'Company name and URL',
  },
  {
    value: 'invite',
    label: 'Invite team',
    description: 'Add people by email',
    skipped: true,
  },
  {
    value: 'import',
    label: 'Import data',
    description: 'Bring in leads from a CSV',
  },
  {
    value: 'review',
    label: 'Review',
    description: 'Check everything and finish',
  },
]

const options = (values: string[]) =>
  values.map((value) => ({ label: value, value }))
const isVertical = (v: Record<string, any>) => v.vertical

const knobs: Knob[] = [
  {
    name: 'current',
    type: 'tabs',
    default: 'import',
    options: options(steps.map((s) => s.value)),
  },
  { name: 'vertical', type: 'switch', default: true },
  {
    name: 'edge',
    type: 'tabs',
    default: 'start',
    options: options(['start', 'end']),
    visibleWhen: isVertical,
  },
  { name: 'size', type: 'tabs', default: 'md', options: options(['sm', 'md']) },
  { name: 'loading', type: 'switch', default: false },
  { name: 'failed', type: 'switch', default: false },
  { name: 'completed', type: 'switch', default: false },
  { name: 'clickable', type: 'switch', default: false },
]

function buildCode(v: Record<string, any>) {
  const attrs = [':steps="steps"', `model-value="${v.current}"`]
  if (v.vertical) attrs.push('vertical')
  if (v.vertical && v.edge !== 'start') attrs.push(`edge="${v.edge}"`)
  if (v.size !== 'md') attrs.push(`size="${v.size}"`)
  for (const flag of ['loading', 'failed', 'completed', 'clickable']) {
    if (v[flag]) attrs.push(flag)
  }
  return ['<Stepper', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="280px">
    <template #preview="{ values }">
      <div :class="values.vertical ? 'w-72' : 'w-full max-w-2xl'">
        <Stepper
          :steps="steps"
          :model-value="values.current"
          :vertical="values.vertical"
          :edge="values.edge"
          :size="values.size"
          :loading="values.loading"
          :failed="values.failed"
          :completed="values.completed"
          :clickable="values.clickable"
        />
      </div>
    </template>
  </PlaygroundFrame>
</template>
