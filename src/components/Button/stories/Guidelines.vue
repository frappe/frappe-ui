<script setup lang="ts">
import { ref } from 'vue'
import { Button, TextInput } from 'frappe-ui'

// The invite card: a heading, then the field and its button on one row.
const inviteRow = 'flex w-80 flex-col gap-2'
const inviteHeading = 'text-sm font-medium text-ink-gray-7'

// It opens on the same half-typed email on both sides, so the difference
// shows at a glance: "do" has already said what's wrong (as after a click),
// "don't" just has a grey button. It stays live: type to try it.
const isEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value)
const invalidEmail = 'Enter a valid email address, like jane@example.com.'
const startEmail = 'jane@exa'

const doEmail = ref(startEmail)
const doError = ref(invalidEmail)
const doSent = ref(false)
function inviteDo() {
  doSent.value = false
  if (!isEmail(doEmail.value)) {
    doError.value = doEmail.value ? invalidEmail : 'Email is required.'
    return
  }
  doError.value = ''
  doSent.value = true
}
function editDo(value: string) {
  doEmail.value = value
  doError.value = ''
  doSent.value = false
}

const dontEmail = ref(startEmail)

// Card 5: a small confirmation, the same width on both sides.
const confirm =
  'flex w-80 flex-col gap-3 rounded-6 border border-outline-gray-2 p-4'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Sentence case labels -->
    <Guideline caption="Use sentence case for button labels, not title case.">
      <template #do>
        <div class="flex flex-col items-start gap-2">
          <Button variant="solid">Buy now</Button>
          <Button variant="ghost" icon-left="lucide-pencil">Edit email</Button>
          <Button variant="ghost" icon-left="lucide-plus">
            Add billing address
          </Button>
        </div>
      </template>
      <template #dont>
        <div class="flex flex-col items-start gap-2">
          <Button variant="solid">Buy Now</Button>
          <Button variant="ghost" icon-left="lucide-pencil">Edit Email</Button>
          <Button variant="ghost" icon-left="lucide-plus">
            Add Billing Address
          </Button>
        </div>
      </template>
    </Guideline>

    <!-- 2. At most two variants in a group -->
    <Guideline
      layout="stack"
      caption="Don't mix more than two button variants in one group."
    >
      <template #do>
        <div class="flex items-center gap-1">
          <Button variant="ghost" icon-left="lucide-columns-2">Column</Button>
          <Button variant="ghost" icon-left="lucide-list-filter">Filter</Button>
          <Button variant="ghost" icon-left="lucide-arrow-up-down">Sort</Button>
          <Button variant="solid">Save</Button>
        </div>
      </template>
      <template #dont>
        <div class="flex items-center gap-1">
          <Button variant="outline" icon-left="lucide-columns-2">Column</Button>
          <Button variant="subtle" icon-left="lucide-list-filter">
            Filter
          </Button>
          <Button variant="ghost" icon-left="lucide-arrow-up-down">Sort</Button>
          <Button variant="solid">Save</Button>
        </div>
      </template>
    </Guideline>

    <!-- 3. One solid button marks the main action -->
    <Guideline
      layout="stack"
      caption="Use one solid button per group, for the main action."
    >
      <template #do>
        <div class="flex items-center gap-2">
          <Button>Cancel</Button>
          <Button>Save draft</Button>
          <Button variant="solid">Publish</Button>
        </div>
      </template>
      <template #dont>
        <div class="flex items-center gap-2">
          <Button>Cancel</Button>
          <Button variant="solid">Save draft</Button>
          <Button variant="solid">Publish</Button>
        </div>
      </template>
    </Guideline>

    <!-- 4. Say what the button does. Shown in a confirmation, where a vague
         "OK" makes people reread the question. -->
    <Guideline
      layout="stack"
      caption="Label a button with what it does, like “Delete project”, not “OK”."
    >
      <template #do>
        <div :class="confirm">
          <p class="text-p-base text-ink-gray-7">
            Delete “Website redesign”? This can't be undone.
          </p>
          <div class="flex justify-end gap-2">
            <Button>Cancel</Button>
            <Button variant="solid" theme="red">Delete project</Button>
          </div>
        </div>
      </template>
      <template #dont>
        <div :class="confirm">
          <p class="text-p-base text-ink-gray-7">
            Delete “Website redesign”? This can't be undone.
          </p>
          <div class="flex justify-end gap-2">
            <Button>Cancel</Button>
            <Button variant="solid" theme="red">OK</Button>
          </div>
        </div>
      </template>
    </Guideline>

    <!-- Disabling a submit button to mean "the input isn't valid yet" leaves
         people stuck: a grey button doesn't say what's missing. Keep it
         enabled and show the problem when they click. -->
    <Guideline
      layout="stack"
      caption="Don't disable a submit button to signal invalid input. Keep it enabled and show what's wrong on click."
    >
      <template #do>
        <div :class="inviteRow">
          <p :class="inviteHeading">Invite a teammate</p>
          <div class="flex items-start gap-2">
            <TextInput
              class="flex-1"
              aria-label="Email"
              placeholder="jane@example.com"
              :model-value="doEmail"
              :error="doError"
              @update:model-value="editDo"
            />
            <Button variant="solid" @click="inviteDo">Invite</Button>
          </div>
          <p v-if="doSent" class="text-sm text-ink-green-7">Invite sent</p>
        </div>
      </template>
      <template #dont>
        <div :class="inviteRow">
          <p :class="inviteHeading">Invite a teammate</p>
          <div class="flex items-start gap-2">
            <TextInput
              v-model="dontEmail"
              class="flex-1"
              aria-label="Email"
              placeholder="jane@example.com"
            />
            <Button variant="solid" :disabled="!isEmail(dontEmail)">
              Invite
            </Button>
          </div>
        </div>
      </template>
    </Guideline>
  </div>
</template>
