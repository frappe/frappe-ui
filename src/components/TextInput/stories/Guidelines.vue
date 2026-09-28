<script setup lang="ts">
import { TextInput, Select } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Always give a placeholder -->
    <Guideline caption="Always include a placeholder to give context.">
      <template #do>
        <div class="flex w-56 flex-col gap-2">
          <TextInput placeholder="jane@example.com" />
          <TextInput placeholder="Enter your name" />
        </div>
      </template>
      <template #dont>
        <TextInput class="w-56" />
      </template>
    </Guideline>

    <!-- 2. Match the input type and placeholder (do-only) -->
    <Guideline
      layout="stack"
      caption="Match the input type and placeholder to the information."
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
            placeholder="+91-1111-111-111"
          />
          <TextInput label="Website" type="url" placeholder="example.com" />
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
            <TextInput
              label="Course price"
              placeholder="999.00"
              class="flex-1"
            />
          </div>
        </div>
      </template>
    </Guideline>
  </div>
</template>
