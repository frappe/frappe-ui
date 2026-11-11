<script setup lang="ts">
import { computed, ref } from 'vue'
import { TextInput, Select } from 'frappe-ui'

// Card 4 is live on both sides. It opens mid-typing ("jane@exa") so the
// difference shows at a glance: "do" stays calm, "don't" already complains.
const isEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value)
const invalid = 'Enter a valid email address.'
const midTyping = 'jane@exa'

const onBlurEmail = ref(midTyping)
const onBlurError = ref('')
function checkOnBlur() {
  onBlurError.value =
    onBlurEmail.value && !isEmail(onBlurEmail.value) ? invalid : ''
}
function clearIfFixed(value: string) {
  if (onBlurError.value && isEmail(value)) onBlurError.value = ''
}

const onTypeEmail = ref(midTyping)
const onTypeError = computed(() =>
  onTypeEmail.value && !isEmail(onTypeEmail.value) ? invalid : '',
)
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. A placeholder vanishes once people type, so it can't stand in
         for the label. Use it for an example of the expected value. -->
    <Guideline
      caption="Use the placeholder for an example value, not as the field's label."
    >
      <template #do>
        <TextInput class="w-56" label="Email" placeholder="jane@example.com" />
      </template>
      <template #dont>
        <TextInput class="w-56" placeholder="Email" />
      </template>
    </Guideline>

    <!-- 2. Match the input type and placeholder (do-only) -->
    <Guideline
      layout="stack"
      caption="Set the input type to match the value, like email or tel, so phones show the right keyboard."
    >
      <template #do>
        <div class="flex w-72 flex-col gap-3">
          <TextInput
            label="Email address"
            type="email"
            placeholder="name@example.com"
          />
          <TextInput
            label="Phone number"
            type="tel"
            placeholder="+91 98765 43210"
          />
          <!-- A url field only accepts a full address, so the example
               includes the scheme. -->
          <TextInput
            label="Website"
            type="url"
            placeholder="https://example.com"
          />
        </div>
      </template>
    </Guideline>

    <!-- 3. Size each field to its content (do-only) -->
    <Guideline
      layout="stack"
      caption="Size each field to the length of the content it holds."
    >
      <template #do>
        <div class="flex w-[420px] flex-col gap-3">
          <div class="flex gap-3">
            <TextInput label="First name" placeholder="Ari" class="flex-1" />
            <TextInput label="Last name" placeholder="Brady" class="flex-1" />
          </div>
          <TextInput
            label="Email address"
            type="email"
            placeholder="aribrady@dropbox.co"
          />
          <div class="flex gap-3">
            <Select
              label="Currency"
              :options="['INR', 'USD', 'EUR']"
              class="w-24"
            />
            <TextInput label="Course price" placeholder="999.00" class="w-32" />
          </div>
        </div>
      </template>
    </Guideline>

    <!-- 4. Live on both sides: type an email into each. "Do" checks when
         the field loses focus, and clears the error as soon as the value is
         fixed. "Don't" checks on every keystroke, so it complains from the
         first letter. -->
    <Guideline
      layout="stack"
      caption="Show an error when people leave the field, not while they're still typing."
    >
      <template #do>
        <TextInput
          v-model="onBlurEmail"
          class="w-64"
          label="Email"
          type="email"
          placeholder="Type, then press Tab"
          :error="onBlurError"
          @blur="checkOnBlur"
          @update:model-value="clearIfFixed"
        />
      </template>
      <template #dont>
        <TextInput
          v-model="onTypeEmail"
          class="w-64"
          label="Email"
          type="email"
          placeholder="Start typing"
          :error="onTypeError"
        />
      </template>
    </Guideline>
  </div>
</template>
