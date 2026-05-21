<script setup lang="ts">
// Multi-step wizard inside one `<Dialog>` instance. The body content,
// `title`, primary CTA, and `dismissible` flag all swap with the
// current step — the dialog itself only animates in once.
import { computed, reactive, ref } from 'vue'
import { Button, Dialog, FormControl, TextInput } from 'frappe-ui'

const open = ref(false)
const step = ref(0)
const steps = ['Project', 'Team', 'Done'] as const

const form = reactive({
  template: 'roadmap',
  name: '',
  emails: '',
})

const templateOptions = [
  { label: 'Roadmap', value: 'roadmap' },
  { label: 'Sprint board', value: 'sprint' },
  { label: 'Wiki', value: 'wiki' },
]

const title = computed(() => {
  if (step.value === 0) return 'Set up your workspace'
  if (step.value === 1) return 'Invite your team'
  return 'You\'re all set'
})

const inviteCount = computed(
  () => form.emails.split(/[\s,;]+/).filter(Boolean).length,
)

function reset() {
  step.value = 0
  form.template = 'roadmap'
  form.name = ''
  form.emails = ''
}
</script>

<template>
  <Button variant="solid" @click="(reset(), (open = true))">Get started</Button>

  <Dialog
    v-model:open="open"
    size="lg"
    :title="title"
    :dismissible="step === steps.length - 1"
  >
    <div class="mb-5 flex items-center gap-1.5">
      <span
        v-for="(_, i) in steps"
        :key="i"
        class="h-1 flex-1 rounded-full transition-colors"
        :class="i <= step ? 'bg-surface-gray-7' : 'bg-surface-gray-3'"
      />
    </div>

    <div v-if="step === 0" class="flex flex-col gap-4">
      <FormControl
        label="Project name"
        v-model="form.name"
        placeholder="e.g. Q4 Roadmap"
        autofocus
      />
      <FormControl
        type="select"
        label="Template"
        v-model="form.template"
        :options="templateOptions"
      />
    </div>

    <div v-else-if="step === 1" class="flex flex-col gap-3">
      <p class="text-base text-ink-gray-7">
        Add teammates so they can jump in too. Paste a comma- or
        space-separated list of emails.
      </p>
      <TextInput
        v-model="form.emails"
        placeholder="jane@example.com, marco@example.com"
      />
      <p class="text-p-sm text-ink-gray-5">
        {{ inviteCount }}
        {{ inviteCount === 1 ? 'invite' : 'invites' }} ready.
      </p>
    </div>

    <div v-else class="flex flex-col gap-2">
      <p class="text-base text-ink-gray-8">
        {{ form.name || 'Your workspace' }} is ready to go.
      </p>
      <p class="text-p-sm text-ink-gray-5">
        We'll set up the
        {{ templateOptions.find((t) => t.value === form.template)?.label }}
        template{{
          inviteCount > 0
            ? ` and send ${inviteCount} ${
                inviteCount === 1 ? 'invite' : 'invites'
              }.`
            : '.'
        }}
      </p>
    </div>

    <template #actions="{ close }">
      <div class="flex w-full justify-between gap-2">
        <Button v-if="step > 0 && step < steps.length - 1" @click="step -= 1">
          Back
        </Button>
        <span v-else />

        <div class="flex gap-2">
          <Button v-if="step < steps.length - 1" @click="close">Skip</Button>
          <Button
            v-if="step < steps.length - 1"
            variant="solid"
            :disabled="step === 0 && !form.name.trim()"
            @click="step += 1"
          >
            {{ step === steps.length - 2 ? 'Finish' : 'Continue' }}
          </Button>
          <Button v-else variant="solid" @click="close">Done</Button>
        </div>
      </div>
    </template>
  </Dialog>
</template>
