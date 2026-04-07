<script setup lang="ts">
import { Avatar, Button, Password, Progress, Tree } from 'frappe-ui'
import { computed, reactive, ref } from 'vue'
import LucideUpDown from '~icons/lucide/arrow-down-up'
import LucideBell from '~icons/lucide/bell'
import LucideChevronRight from '~icons/lucide/chevron-right'
import LucideFile from '~icons/lucide/file'
import LucideFolder from '~icons/lucide/folder'
import LucideShield from '~icons/lucide/shield-plus'
import LucideX from '~icons/lucide/X'

const treeState = reactive({
  showIndentationGuides: true,
  rowHeight: '25px',
  indentWidth: '15px',
  node: {
    name: 'guest',
    label: 'Guest',
    isCollapsed: true,
    children: [
      {
        name: 'downloads',
        label: 'Downloads',
        children: [
          {
            name: 'Images',
            label: 'download.zip',
            children: [
              {
                name: 'image.png',
                label: 'image.png',
                children: [],
              },
            ],
          },
        ],
      },
      {
        name: 'documents',
        label: 'Documents',
        children: [
          {
            name: 'somefile.txt',
            label: 'somefile.txt',
            children: [],
          },
          {
            name: 'somefile.pdf',
            label: 'somefile.pdf',
            children: [],
          },
        ],
      },
    ],
  },
})

const password = ref('000000000')
const hasValidLength = computed(() => password.value.length >= 9)

const hasLettersAndNumbers = computed(
  () => /[a-zA-Z]/.test(password.value) && /\d/.test(password.value),
)
const hasSpecialChar = computed(() => /[#@$%^&*_?@~]/.test(password.value))

const strengthScore = computed(
  () =>
    [hasValidLength.value, hasLettersAndNumbers.value, hasSpecialChar.value].filter(Boolean).length,
)

const strengthLabel = computed(() =>
  strengthScore.value <= 1
    ? { text: 'Weak', class: 'text-ink-red-3' }
    : strengthScore.value === 2
      ? { text: 'Moderate', class: 'text-ink-yellow-3' }
      : { text: 'Strong', class: 'text-ink-green-3' },
)

const notifs = [
  {
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'Matthew Connor',
    txt: 'The deadline for you is tomorrow.',
    type: 'invitation',
    time: 'Just now',
    unread: false,
  },
  {
    img: 'https://randomuser.me/api/portraits/men/45.jpg',
    name: 'Eeren McKenzie',
    txt: 'Review the latest design updates',
    type: null,
    time: '5 min ago',
    unread: true,
  },
  {
    img: 'https://randomuser.me/api/portraits/men/68.jpg',
    name: 'John Doe',
    txt: 'Review the design changes',
    type: null,
    time: '10 min ago',
    unread: true,
  },
]
</script>

<template>
  <section
    class="grid h-fit gap-5 *:rounded *:border [&_label]:mb-2 [&_label]:text-base [&_label]:text-ink-gray-9"
  >
    <div class="bg-urface-cards h-fit p-5">
      <Tree
        :options="{
          showIndentationGuides: treeState.showIndentationGuides,
          rowHeight: treeState.rowHeight,
          indentWidth: treeState.indentWidth,
          defaultCollapsed: false,
        }"
        nodeKey="name"
        :node="treeState.node"
      >
        <template #node="{ node, hasChildren, isCollapsed, toggleCollapsed }">
          <button class="mb-3 flex cursor-pointer items-center gap-2" @click="toggleCollapsed">
            <LucideChevronRight
              v-if="hasChildren"
              class="size-4 transition-transform"
              :class="{ 'rotate-90': isCollapsed }"
            />

            <LucideFolder v-if="hasChildren" class="size-4" />
            <LucideFile v-else class="ml-2 size-4" />

            {{ node.name }}
          </button>
        </template>
      </Tree>
    </div>

    <div class="prose prose-sm grid gap-3 p-5 pt-3">
      <h3 class="flex items-center gap-2 border-b pb-3">
        <LucideShield class="size-5" />
        Create Password
      </h3>

      <p>
        To ensure the safety and security of your account, its essential to create a strong password
      </p>

      <div class="grid">
        <label class="!text-ink-gray-5">Password</label>
        <Password v-model="password" placeholder="Enter password" variant="outline" />
      </div>

      <Progress
        label="Password Strength"
        class="mt-3 [&_label]:text-ink-gray-5"
        :value="strengthScore < 3 ? strengthScore * 30 : 100"
        :hint="true"
        size="md"
      >
        <template #hint>
          <span class="text-sm" :class="strengthLabel.class">
            {{ strengthLabel.text }}
          </span>
        </template>
      </Progress>

      <div class="rounded bg-surface-gray-1 !py-3 px-8 text-sm text-ink-gray-5">
        <li :class="{ 'line-through opacity-60': hasValidLength }">Includes 9-16 characters</li>
        <li :class="{ 'line-through opacity-60': hasLettersAndNumbers }">
          Combines letters and numbers
        </li>
        <li :class="{ 'line-through opacity-60': hasSpecialChar }">
          A special character #@$%^&*_?@~
        </li>
      </div>

      <Button variant="solid" class="w-full py-4"> Create password </Button>
    </div>

    <div>
      <div class="flex gap-3 border-b p-4">
        <LucideBell class="size-4" />

        Notifications

        <LucideUpDown class="ml-auto size-4" />
        <LucideX class="size-4" />
      </div>
      <div
        v-for="(x, i) in notifs"
        class="flex gap-4 p-4"
        :class="{ 'border-b': i < notifs.length - 1 }"
      >
        <Avatar size="xl" :image="x.img" />

        <div class="flex flex-wrap gap-x-2 gap-y-2">
          <span class="w-full">{{ x.name }}</span>
          <p class="w-full text-ink-gray-6">
            {{ x.txt }}
          </p>
          <span class="w-full text-ink-gray-4"> {{ x.time }}</span>

          <template v-if="x.type">
            <Button>Accept</Button>
            <Button variant="outline">Reject</Button>
          </template>
        </div>

        <span
          v-if="x.unread"
          class="my-auto h-1 w-1 shrink-0 rounded-full bg-surface-blue-3"
        ></span>
      </div>
    </div>
  </section>
</template>
