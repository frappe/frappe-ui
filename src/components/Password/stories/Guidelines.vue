<script setup lang="ts">
import { ref } from 'vue'
import { Password } from 'frappe-ui'

// One model per field so revealing or editing one doesn't affect the others.
const tooShort = ref('secret1')
const noMessage = ref('secret1')
const withRules = ref('Password123!')
const vague = ref('Password123!')
const single = ref('Summer*2026')
const typed = ref('Summer*2026')
const retyped = ref('Summer*2026')
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Pair the error state with a message -->
    <Guideline
      layout="stack"
      caption="Always pair the error state with a message telling the user what's wrong and how to fix it."
    >
      <template #do>
        <Password
          v-model="tooShort"
          class="w-72"
          error="Password must be at least 8 characters."
          autocomplete="new-password"
        />
      </template>
      <template #dont>
        <Password
          v-model="noMessage"
          class="w-72"
          autocomplete="new-password"
        />
      </template>
    </Guideline>

    <!-- 2. Show concrete requirements, not vague guidance -->
    <Guideline
      layout="stack"
      caption="Show password requirements so users know exactly what makes a valid password."
    >
      <template #do>
        <Password v-model="withRules" class="w-72" autocomplete="new-password">
          <template #description>
            <ul class="flex flex-col gap-0.5 text-sm text-ink-gray-5">
              <li>At least 8 characters</li>
              <li>At least 1 uppercase letter (A-Z)</li>
              <li>At least 1 lowercase letter (a-z)</li>
              <li>At least 1 number (0-9)</li>
              <li>At least 1 special character (!@#$%^*)</li>
            </ul>
          </template>
        </Password>
      </template>
      <template #dont>
        <Password
          v-model="vague"
          class="w-72"
          description="Create a strong password"
          autocomplete="new-password"
        />
      </template>
    </Guideline>

    <!-- 3. A confirm field exists to catch typos, which people can now check
         with the show toggle. Typing it twice is extra work, and it breaks
         password managers that fill one field. -->
    <Guideline
      layout="stack"
      caption="Don't add a “Confirm password” field. The show toggle already lets people check for typos."
    >
      <template #do>
        <Password
          v-model="single"
          class="w-72"
          label="New password"
          autocomplete="new-password"
        />
      </template>
      <template #dont>
        <div class="flex w-72 flex-col gap-3">
          <Password
            v-model="typed"
            label="New password"
            autocomplete="new-password"
          />
          <Password
            v-model="retyped"
            label="Confirm password"
            autocomplete="new-password"
          />
        </div>
      </template>
    </Guideline>
  </div>
</template>
