<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Password, TextInput } from 'frappe-ui'

// From CRM's and Helpdesk's Change Password dialogs: each field is named
// only by its placeholder, so once they're filled they're identical rows of
// dots. Both sides are live and hold the same passwords.
const labelledCurrent = ref('Summer*2026')
const labelledNew = ref('Autumn*2027')
const placeholderCurrent = ref('Summer*2026')
const placeholderNew = ref('Autumn*2027')

// Card 2: rules like "an uppercase letter, a number and a symbol" push people
// to the same patterns, like Password1!, which meets all of them and is one
// of the first guesses an attacker tries. Length does more: a few random
// words are long and easy to remember. NIST SP 800-63B says not to impose
// composition rules, and Frappe scores strength (minimum_password_score)
// rather than checking character types.
const passphrase = ref('river lamp orbit tulip')
const composed = ref('Password1!')

// Card 3: from Helpdesk's Exotel settings, which masks the API Token with
// Password but shows the Webhook Verify Token in a plain text field, visible
// in screenshots and screen shares. CRM's Twilio settings mask the Auth Token.
const maskedToken = ref('whk_8f3a1c9e2b7d4a60e5')
const plainToken = ref('whk_8f3a1c9e2b7d4a60e5')
// Card 3's labels sit beside the fields, as in a settings row, so each mark
// lines up with its field. The text is repeated as aria-label.
const row = 'flex items-center gap-3'
const labelClass = 'w-28 text-sm leading-tighter text-ink-gray-6'

// Both passwords start revealed so the card shows them. Password has no prop
// for that, so the eye is clicked once; people can still hide them.
const root = ref<HTMLElement>()
onMounted(() => {
  root.value
    ?.querySelectorAll<HTMLButtonElement>('[data-reveal] button')
    .forEach((button) => button.click())
})
</script>

<template>
  <div ref="root" class="flex flex-col gap-8">
    <!-- 1. A placeholder disappears as soon as there's text, so a filled
         field with no label doesn't say what it is. -->
    <Guideline
      layout="stack"
      caption="Label each password field. A placeholder disappears once people type."
    >
      <template #do>
        <div class="flex w-72 flex-col gap-3">
          <Password
            v-model="labelledCurrent"
            label="Current password"
            autocomplete="current-password"
          />
          <Password
            v-model="labelledNew"
            label="New password"
            autocomplete="new-password"
          />
        </div>
      </template>
      <template #dont>
        <div class="flex w-72 flex-col gap-3">
          <Password
            v-model="placeholderCurrent"
            placeholder="Current password"
            aria-label="Current password"
            autocomplete="current-password"
          />
          <Password
            v-model="placeholderNew"
            placeholder="New password"
            aria-label="New password"
            autocomplete="new-password"
          />
        </div>
      </template>
    </Guideline>

    <!-- 2. Composition rules make passwords predictable. Both are shown so
         the reader sees that Password1! passes every rule. -->
    <Guideline
      layout="stack"
      caption="Ask for a longer password, not a mix of uppercase, numbers and symbols. Those rules lead to guessable ones like “Password1!”."
    >
      <template #do>
        <div data-reveal class="w-72">
          <Password
            v-model="passphrase"
            label="New password"
            description="Use at least 12 characters. A few random words work well."
            autocomplete="new-password"
          />
        </div>
      </template>
      <template #dont>
        <div data-reveal class="w-72">
          <Password
            v-model="composed"
            label="New password"
            autocomplete="new-password"
          >
            <template #description>
              <ul class="flex flex-col gap-0.5">
                <li>At least 8 characters</li>
                <li>An uppercase and a lowercase letter</li>
                <li>A number and a symbol</li>
              </ul>
            </template>
          </Password>
        </div>
      </template>
    </Guideline>

    <!-- 3. Password isn't only for passwords. Anything that grants access
         should stay hidden until someone asks to see it. -->
    <Guideline
      layout="stack"
      caption="Use Password for any secret, like an API token, not only for passwords."
    >
      <template #do>
        <div :class="row">
          <span :class="labelClass" aria-hidden="true">Webhook token</span>
          <Password
            v-model="maskedToken"
            class="w-56"
            aria-label="Webhook token"
            autocomplete="off"
          />
        </div>
      </template>
      <template #dont>
        <div :class="row">
          <span :class="labelClass" aria-hidden="true">Webhook token</span>
          <TextInput
            v-model="plainToken"
            class="w-56"
            aria-label="Webhook token"
            autocomplete="off"
          />
        </div>
      </template>
    </Guideline>
  </div>
</template>
