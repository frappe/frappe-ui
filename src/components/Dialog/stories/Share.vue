<script setup lang="ts">
// Share dialog — invite teammates by email and adjust per-row access.
// Rich `#default` body + a simple `#actions` slot CTA.
import { ref } from 'vue'
import { Avatar, Button, Dialog, FormControl, TextInput } from 'frappe-ui'

const open = ref(false)

type Role = 'view' | 'comment' | 'edit'
type Member = {
  name: string
  email: string
  initials: string
  image: string
  role: Role | 'owner'
  you?: boolean
}

const inviteEmail = ref('')

const avatarFor = (seed: string) => `https://i.pravatar.cc/80?u=${seed}`

const members = ref<Member[]>([
  {
    name: 'Faris Ansari',
    email: 'faris@example.com',
    initials: 'FA',
    image: avatarFor('faris@example.com'),
    role: 'owner',
    you: true,
  },
  {
    name: 'Ankush Menat',
    email: 'ankush@example.com',
    initials: 'AM',
    image: avatarFor('ankush@example.com'),
    role: 'edit',
  },
  {
    name: 'Shariq Ansari',
    email: 'shariq@example.com',
    initials: 'SA',
    image: avatarFor('shariq@example.com'),
    role: 'comment',
  },
])

const roleOptions = [
  { label: 'Can view', value: 'view' },
  { label: 'Can comment', value: 'comment' },
  { label: 'Can edit', value: 'edit' },
]

function invite() {
  const email = inviteEmail.value.trim()
  if (!email) return
  const local = email.split('@')[0]
  members.value.push({
    name: local.replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    email,
    initials: local.slice(0, 2).toUpperCase(),
    image: avatarFor(email),
    role: 'edit',
  })
  inviteEmail.value = ''
}
</script>

<template>
  <Button icon-left="lucide-share-2" @click="open = true">Share…</Button>

  <Dialog v-model:open="open" size="lg" title="Share &quot;Q4 Roadmap&quot;">
    <div class="flex flex-col gap-5">
      <div class="flex gap-2">
        <TextInput
          v-model="inviteEmail"
          type="email"
          placeholder="Add people by email…"
          class="flex-1"
          @keydown.enter="invite"
        />
        <Button variant="solid" :disabled="!inviteEmail" @click="invite">
          Invite
        </Button>
      </div>

      <div class="flex flex-col gap-1">
        <p class="text-p-sm text-ink-gray-5">People with access</p>
        <div class="flex flex-col">
          <div
            v-for="member in members"
            :key="member.email"
            class="flex items-center gap-3 py-1.5"
          >
            <Avatar :image="member.image" :label="member.initials" size="md" />
            <div class="min-w-0 flex-1 leading-tight">
              <div class="text-base text-ink-gray-9">
                {{ member.name }}
                <span
                  v-if="member.you"
                  class="ml-0.5 text-p-xs text-ink-gray-5"
                >
                  (you)
                </span>
              </div>
              <div class="truncate text-p-sm text-ink-gray-5">
                {{ member.email }}
              </div>
            </div>

            <span
              v-if="member.role === 'owner'"
              class="text-p-sm text-ink-gray-5"
            >
              Owner
            </span>
            <FormControl
              v-else
              type="select"
              v-model="member.role"
              :options="roleOptions"
              class="w-36 shrink-0"
            />
          </div>
        </div>
      </div>
    </div>

    <template #actions="{ close }">
      <div class="flex justify-end">
        <Button variant="solid" @click="close">Done</Button>
      </div>
    </template>
  </Dialog>
</template>
