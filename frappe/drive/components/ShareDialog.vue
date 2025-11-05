<template>
  <Dialog v-model="open" :options="{ size: 'lg' }" @close="dialogType = ''">
    <template #body-main>
      <div class="p-4 sm:px-6">
        <!-- Header -->
        <div class="flex w-full justify-between gap-x-2 mb-4">
          <div class="font-semibold text-2xl flex text-nowrap overflow-hidden">
            Sharing "
            <div class="truncate max-w-[80%]">
              {{ entity?.title }}
            </div>
            "
          </div>
          <div class="ml-auto flex gap-2">
            <Button
              v-if="!advanced"
              class="text-sm"
              variant="ghost"
              :icon="h(LucideSettings, { class: 'size-4' })"
              @click="advanced = true"
            />
            <Button
              v-else
              variant="ghost"
              class="flex text-sm gap-1 items-center mb-3 cursor-pointer"
              label="Back"
              :icon-left="h(LucideArrowLeft, { class: 'size-4' })"
              @click="advanced = false"
            />
            <Button
              class="shrink-0"
              variant="ghost"
              @click="$emit('update:modelValue', false)"
            >
              <template #icon>
                <LucideX class="size-4" />
              </template>
            </Button>
          </div>
        </div>
        <div v-if="advanced">
          <Switch v-model="allowDownload" label="Allow download" />
        </div>
        <div v-else>
          <!-- General section -->
          <div class="mb-4 border-b pb-4">
            <div class="mb-2 text-ink-gray-5 font-medium text-base">
              General Access
            </div>
            <div class="flex justify-between mt-3">
              <div class="flex flex-col gap-2">
                <Select
                  v-model="generalAccessLevel"
                  :options="levelOptions"
                  @update:model-value="
                    (val) => updateGeneralAccess(val, generalPerms)
                  "
                >
                  <template #prefix>
                    <component
                      :is="generalAccessLevel.icon"
                      class="mr-2 size-4 text-ink-gray-6"
                    />
                  </template>
                  <template #item-prefix="{ option }">
                    <component
                      :is="option.icon"
                      class="size-4 text-ink-gray-6"
                    />
                  </template>
                </Select>
                <TeamSelector
                  v-if="generalAccessLevel == 'team'"
                  v-model="chosenTeam"
                />
              </div>
              <Select
                v-if="generalAccessLevel !== 'restricted'"
                v-model="generalPerms"
                :options="accessOptions"
                @update:model-value="
                  (val) => updateGeneralAccess(generalAccessLevel, val)
                "
              />
            </div>
          </div>
          <!-- Members section -->
          <div class="text-ink-gray-5 font-medium text-base mb-2">Members</div>
          <div class="flex gap-3">
            <TagInput
              v-model="usersToAdd"
              v-model:options="filteredUsers"
              :new-option-icon="
                (k) =>
                  h(Avatar, {
                    image: k.user_image,
                    label: k.value,
                    size: 'xs',
                  })
              "
              placeholder="Add people..."
            />
            <Select
              v-if="usersToAdd.length"
              v-model="accessToAdd"
              :options="accessOptions"
            />
          </div>

          <div
            v-if="usersWithAccess.data"
            class="flex flex-col gap-4 overflow-y-auto text-base max-h-80 py-4 mb-3"
          >
            <div
              v-for="(user, idx) in usersWithAccess.data"
              :key="user.name"
              class="flex items-center gap-x-3 pr-1"
            >
              <Avatar
                size="xl"
                :label="user.user || user.email"
                :image="user.user_image"
              />

              <div class="flex items-start flex-col gap-1">
                <span class="font-medium text-base text-ink-gray-9">{{
                  user.full_name || user.user || user.email
                }}</span>
                <span class="text-ink-gray-7 text-sm">{{
                  user.full_name ? user.user || user.email : ''
                }}</span>
              </div>
              <div class="ml-auto">
                <span
                  v-if="user.user == $store.state.user.id"
                  class="mr-1 text-ink-gray-7"
                >
                  <div v-if="user.user === entity.owner" class="flex gap-1">
                    Owner (you)
                  </div>
                  <template v-else>You</template>
                </span>
                <Select
                  v-else-if="user.user !== entity.owner"
                  :modelValue="
                    user.write ? 'editor' : user.upload ? 'uploader' : 'reader'
                  "
                  :options="[
                    ...accessOptions,
                    {
                      group: true,
                      options: [
                        { value: 'remove', label: 'Remove', theme: 'red' },
                      ],
                    },
                  ]"
                  @update:model-value="
                    (val) => updatePermissions(user, val, entity.name, idx)
                  "
                />
                <span v-else class="flex items-center gap-1 text-ink-gray-5">
                  Owner
                  <LucideDiamond class="size-3" />
                </span>
              </div>
            </div>
          </div>
          <div v-else class="flex min-h-[19.2vh] w-full">
            <LoadingIndicator class="w-7 h-auto text-ink-gray-7 mx-auto" />
          </div>
          <div class="w-full flex items-center justify-end">
            <div class="flex gap-2">
              <Button
                class="text-base"
                variant="outline"
                @click="getLink(entity)"
              >
                <template #prefix>
                  <LucideLink2 class="w-4 text-ink-gray-6" />
                </template>
                Copy Link
              </Button>
              <Button
                v-if="usersToAdd.length"
                label="Invite"
                variant="solid"
                @click="addPermissions"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>
<script setup>
import { ref, computed, watch, markRaw, h } from 'vue'
import {
  Avatar,
  Dialog,
  LoadingIndicator,
  createResource,
  Switch,
  TagInput,
  Select,
} from 'frappe-ui'
import TeamSelector from './TeamSelector.vue'
import { getLink, dynamicList } from '@/utils/files'

import {
  usersWithAccess,
  updateAccess,
  allUsers,
} from '@/resources/permissions'

import LucideBuilding2 from '~icons/lucide/building-2'
import LucideDiamond from '~icons/lucide/diamond'
import LucideLock from '~icons/lucide/lock'
import LucideSettings from '~icons/lucide/settings'
import LucideArrowLeft from '~icons/lucide/arrow-left'
import LucideGlobe2 from '~icons/lucide/globe-2'

import store from '@/store'

const props = defineProps({ modelValue: String, entity: Object })
const emit = defineEmits(['update:modelValue', 'success'])
const dialogType = defineModel()
const open = ref(true)

// Advanced section
const advanced = ref(false)
const allowDownload = ref(props.entity.allow_download)
watch(allowDownload, (v) => {
  props.entity.allow_download = v
  createResource({
    url: 'drive.api.permissions.toggle_allow_download',
    params: { entity: props.entity.name, val: v },
    auto: true,
  })
})
usersWithAccess.fetch({ entity: props.entity.name })
allUsers.fetch({ team: 'all' })

const levelOptions = [
  {
    label: 'Accessible to invited members',
    value: 'restricted',
    icon: markRaw(LucideLock),
  },
  {
    label: 'Accessible to a team',
    value: 'team',
    icon: markRaw(LucideBuilding2),
  },
  { label: 'Accessible to all', value: 'public', icon: markRaw(LucideGlobe2) },
]
const accessOptions = computed(() =>
  dynamicList([
    { value: 'reader', label: 'Can view', icon: LucideEye },
    {
      value: 'upload',
      label: 'Can upload',
      cond: props.entity.is_group && props.entity.upload,
      icon: LucideUpload,
    },
    {
      value: 'editor',
      label: 'Can edit',
      cond: props.entity.write,
      icon: LucidePencil,
    },
  ]),
)

// General access
const generalAccessLevel = ref(levelOptions[0].value)
const generalPerms = ref('reader')
const chosenTeam = ref()

const getGeneralAccess = createResource({
  url: 'drive.api.permissions.get_user_access',
  makeParams: (params) => ({
    ...params,
    entity: props.entity.name,
  }),
  onSuccess: (data) => {
    if (!data || !data.read) {
      if (getGeneralAccess.params.user === 'Guest')
        getGeneralAccess.fetch({ team: 1 })
      return
    }
    generalAccessLevel.value = getGeneralAccess.params.team ? 'team' : 'public'
    chosenTeam.value = data.team
    generalPerms.value = data.write
      ? 'editor'
      : data.upload
        ? 'upload'
        : 'reader'
  },
})
getGeneralAccess.fetch({ user: 'Guest' })
let selectingTeam = false
const updateGeneralAccess = (level, perms) => {
  if (level === 'team' && !chosenTeam.value) {
    selectingTeam = true
    return
  }
  if (level !== 'restricted') {
    updateAccess.submit({
      entity_name: props.entity.name,
      user: level === 'public' ? '' : chosenTeam.value,
      team: level === 'team',
      read: 1,
      comment: 1,
      share: 1,
      write: perms === 'editor',
      upload: perms === 'editor' || perms === 'upload',
    })
    selectingTeam = false
  } else {
    updateAccess.submit({
      entity_name: props.entity.name,
      user: '$GENERAL',
      method: 'unshare',
    })
  }
  emit('success')
}

watch(
  chosenTeam,
  (now, prev) =>
    (prev || selectingTeam) &&
    updateGeneralAccess(generalAccessLevel.value, generalPerms.value),
)

// Invite specific users
const usersToAdd = ref([])
const accessToAdd = ref('reader')
const filteredUsers = ref([])
watch(
  [() => allUsers.data, () => usersWithAccess.data],
  ([users, existingUsers]) => {
    if (!existingUsers || !users) return []
    filteredUsers.value = users.filter(
      (k) => !existingUsers.find(({ user }) => user === k.name),
    )
  },
  { immediate: true },
)

const addPermissions = () => {
  const access = getAccess(accessToAdd.value)
  for (const user of usersToAdd.value) {
    const r = {
      entity_name: props.entity.name,
      user,
      ...access,
    }
    updateAccess.submit(r)
    usersWithAccess.data.push({
      ...filteredUsers.value.find((k) => k.value === user),
      ...access,
    })
  }
  usersToAdd.value = []
  emit('success')
}

const updatePermissions = (user, val, entity_name, idx) => {
  if (val === 'remove') {
    usersWithAccess.data.splice(idx, 1)
    return updateAccess.submit({
      method: 'unshare',
      entity_name,
      user: user.user,
    })
  }
  const access = getAccess(val)
  Object.assign(user, access)
  updateAccess.submit({
    entity_name,
    user: user.user,
    ...access,
  })
}

// Util functions
const getAccess = (val) => ({
  read: 1,
  comment: 1,
  upload: val === 'upload' || val === 'editor' ? 1 : 0,
  share: val === 'editor' ? 1 : 0,
  write: val === 'editor' ? 1 : 0,
})
</script>
