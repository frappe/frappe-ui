<script setup lang="ts">
// Figma: espresso-2.0 › References › modal (34953:130701) — "modal new",
// variant invite. Email field + Invite, a "People" list with role selects,
// and a split footer.
import { computed, ref, watch } from 'vue'
import { Avatar, Button, Select, TextInput } from '../../../src'
import EspressoModal from './EspressoModal.vue'

export interface Member {
  name: string
  email: string
  role: 'owner' | 'member' | 'viewer'
  theme?: 'amber' | 'red' | 'blue' | 'green' | 'violet' | 'gray'
  image?: string
}

const props = withDefaults(defineProps<{ members?: Member[] }>(), {
  members: () => [
    {
      name: 'Mathew Connor',
      email: 'mathewconnor@timeless.co',
      role: 'owner',
      theme: 'amber',
    },
    {
      name: 'Jayaprakash',
      email: 'jayaprakash@timeless.co',
      role: 'member',
      theme: 'red',
    },
    {
      name: 'Gowtham',
      email: 'gowtham@timeless.co',
      role: 'member',
      theme: 'red',
    },
  ],
})

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  invite: [email: string]
  changeRole: [email: string, role: Member['role']]
  copyLink: []
  learnMore: []
}>()

const roles = [
  { label: 'Member', value: 'member' },
  { label: 'Viewer', value: 'viewer' },
]

const people = ref<Member[]>([])
const email = ref('')

const validEmail = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()),
)

watch(
  open,
  (isOpen) => {
    if (isOpen) {
      people.value = props.members.map((m) => ({ ...m }))
      email.value = ''
    }
  },
  { immediate: true },
)

function invite() {
  if (!validEmail.value) return
  const address = email.value.trim()
  emit('invite', address)
  people.value.push({
    name: address.split('@')[0],
    email: address,
    role: 'member',
    theme: 'gray',
  })
  email.value = ''
}

function setRole(member: Member, role: Member['role']) {
  member.role = role
  emit('changeRole', member.email, role)
}
</script>

<template>
  <EspressoModal v-model:open="open" title="Invite members" variant="list">
    <div class="flex flex-col gap-4">
      <!-- md subtle field · 8px · solid Invite -->
      <form class="flex items-center gap-2" @submit.prevent="invite">
        <TextInput
          v-model="email"
          class="flex-1"
          type="email"
          size="md"
          placeholder="Enter email address"
        />
        <Button type="submit" variant="solid" size="md" :disabled="!validEmail">
          Invite
        </Button>
      </form>

      <div class="flex flex-col gap-4">
        <p class="text-base-medium text-ink-gray-5">People</p>

        <!-- member row: 32px avatar · 8px · name/email (2px) · role -->
        <div
          v-for="member in people"
          :key="member.email"
          class="flex items-center gap-2"
        >
          <Avatar
            size="xl"
            shape="circle"
            :image="member.image"
            :label="member.name"
            :theme="member.theme"
          />
          <div class="flex min-w-0 flex-1 flex-col gap-0.5">
            <p class="truncate text-base-medium text-ink-gray-7">
              {{ member.name }}
            </p>
            <p class="truncate text-sm text-ink-gray-6">{{ member.email }}</p>
          </div>
          <Select
            v-if="member.role === 'owner'"
            class="w-auto"
            variant="ghost"
            size="sm"
            model-value="owner"
            :options="[{ label: 'Owner', value: 'owner' }]"
            disabled
          />
          <Select
            v-else
            class="w-auto"
            variant="ghost"
            size="sm"
            :model-value="member.role"
            :options="roles"
            @update:model-value="setRole(member, $event as Member['role'])"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <Button class="mr-auto" variant="outline" size="md" @click="emit('copyLink')">
        <template #prefix>
          <span class="lucide-link size-[18px] text-ink-gray-7" />
        </template>
        Copy link
      </Button>
      <Button
        class="!font-normal !text-ink-gray-6"
        variant="ghost"
        size="md"
        @click="emit('learnMore')"
      >
        Learn about sharing
        <template #suffix>
          <span class="lucide-info size-[18px] text-ink-gray-6" />
        </template>
      </Button>
    </template>
  </EspressoModal>
</template>
