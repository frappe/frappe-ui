<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Button, FormControl } from 'frappe-ui'

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  role: '',
  team: '',
  skills: [] as string[],
  startDate: '',
  availability: '',
  bio: '',
  acceptTerms: false,
})

const submitted = ref(false)

const errors = computed(() => {
  if (!submitted.value) return {} as Record<string, string>
  const e: Record<string, string> = {}
  if (!form.fullName.trim()) e.fullName = 'Full name is required.'
  if (!form.email.trim()) e.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    e.email = 'Enter a valid email.'
  if (!form.password) e.password = 'Pick a password.'
  else if (form.password.length < 8)
    e.password = 'Use at least 8 characters.'
  if (!form.role) e.role = 'Pick a role.'
  if (!form.team) e.team = 'Pick a team.'
  if (form.skills.length === 0) e.skills = 'Pick at least one skill.'
  if (!form.startDate) e.startDate = 'Pick a start date.'
  if (!form.acceptTerms) e.acceptTerms = 'You must accept the terms.'
  return e
})

const isValid = computed(() => Object.keys(errors.value).length === 0)

const roleOptions = [
  { label: 'Engineer', value: 'engineer' },
  { label: 'Designer', value: 'designer' },
  { label: 'Product Manager', value: 'pm' },
  { label: 'Other', value: 'other' },
]

const teamOptions = [
  { label: 'Platform', value: 'platform' },
  { label: 'Growth', value: 'growth' },
  { label: 'Frontend', value: 'frontend' },
  { label: 'Backend', value: 'backend' },
  { label: 'Mobile', value: 'mobile' },
]

const skillOptions = [
  { label: 'Vue', value: 'vue' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'Frappe Framework', value: 'frappe' },
  { label: 'Tailwind CSS', value: 'tailwind' },
  { label: 'PostgreSQL', value: 'postgres' },
]

function submit() {
  submitted.value = true
}

function reset() {
  Object.assign(form, {
    fullName: '',
    email: '',
    password: '',
    role: '',
    team: '',
    skills: [],
    startDate: '',
    availability: '',
    bio: '',
    acceptTerms: false,
  })
  submitted.value = false
}
</script>

<template>
  <form
    class="w-full max-w-lg space-y-4 py-4"
    @submit.prevent="submit"
  >
    <div class="space-y-1">
      <h2 class="text-lg-semibold text-ink-gray-9">Create account</h2>
      <p class="text-p-sm text-ink-gray-6">
        Every <code>FormControl</code> type rendered together. Submit to see
        validation light up.
      </p>
    </div>

    <FormControl
      v-model="form.fullName"
      type="text"
      label="Full name"
      placeholder="Jane Doe"
      :error="errors.fullName"
      required
    />

    <FormControl
      v-model="form.email"
      type="email"
      label="Email"
      description="We'll never share your email."
      placeholder="you@example.com"
      :error="errors.email"
      required
    />

    <FormControl
      v-model="form.password"
      type="password"
      label="Password"
      description="At least 8 characters."
      :error="errors.password"
      required
    />

    <FormControl
      v-model="form.role"
      type="select"
      label="Role"
      placeholder="Pick a role"
      :options="roleOptions"
      :error="errors.role"
      required
    />

    <FormControl
      v-model="form.team"
      type="combobox"
      label="Team"
      placeholder="Type to filter"
      :options="teamOptions"
      :error="errors.team"
      required
    />

    <FormControl
      v-model="form.skills"
      type="multiselect"
      label="Skills"
      description="Pick all that apply."
      placeholder="Pick skills"
      :options="skillOptions"
      :error="errors.skills"
      required
    />

    <FormControl
      v-model="form.startDate"
      type="date"
      label="Start date"
      placeholder="Pick a start date"
      :error="errors.startDate"
      required
    />

    <FormControl
      v-model="form.availability"
      type="daterange"
      label="Availability window"
      description="When are you free for onboarding?"
      placeholder="Pick a range"
    />

    <FormControl
      v-model="form.bio"
      type="textarea"
      label="Short bio"
      description="A sentence or two — optional."
      placeholder="Tell us a little about yourself..."
    />

    <FormControl
      v-model="form.acceptTerms"
      type="checkbox"
      label="I accept the terms and privacy policy"
    />
    <p v-if="errors.acceptTerms" class="text-p-sm text-ink-red-6">
      {{ errors.acceptTerms }}
    </p>

    <div class="flex items-center gap-2 pt-2">
      <Button variant="solid" type="submit">Create account</Button>
      <Button variant="ghost" type="button" @click="reset">Reset</Button>
      <span
        v-if="submitted && isValid"
        class="ml-auto text-p-sm text-ink-green-6"
      >
        Looks good!
      </span>
    </div>
  </form>
</template>
