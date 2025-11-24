<template>
  <Dialog v-model="open" @close="dialogType = ''">
    <template #body-title>
      <h3
        class="text-2xl font-semibold leading-6 text-ink-gray-9 cursor-pointer pr-2"
        @click="emitter.emit('rename')"
      >
        {{ entity.title }}
      </h3>
    </template>
    <template #body-content>
      <ul class="space-y-3 text-sm mb-4 text-ink-gray-8">
        <span class="text-base font-semibold">Information</span>
        <li>
          <span class="inline-block w-24 text-ink-gray-5"
            >{{ __('Owner') }}:</span
          >
          <span class="col-span-1">
            <a :href="`mailto:${entity.owner}`">{{ entity.owner }}</a>
          </span>
        </li>
        <li>
          <span class="inline-block w-24 text-ink-gray-5"
            >{{ __('Type') }}:</span
          >
          <span class="col-span-1">{{ entity.file_type }}</span>
        </li>
        <li v-if="entity.file_size">
          <span class="inline-block w-24 text-ink-gray-5"
            >{{ __('Size') }}:</span
          >
          <span class="col-span-1">
            {{ entity.file_size_pretty }}{{ ` (${entity.file_size})` }}
          </span>
        </li>
        <li>
          <span class="inline-block w-24 text-ink-gray-5"
            >{{ __('Modified') }}:</span
          >
          <span class="col-span-1">{{ formatDate(entity.modified) }}</span>
        </li>
        <li>
          <span class="inline-block w-24 text-ink-gray-5"
            >{{ __('Added') }}:</span
          >
          <span class="col-span-1">{{ formatDate(entity.creation) }}</span>
        </li>
        <li class="flex items-center">
          <span class="inline-block w-24 text-ink-gray-5"
            >{{ __('Tags') }}:</span
          >
          <TagInput class="flex-grow bg-transparent" :entity />
        </li>
      </ul>

      <ul
        v-if="editor?.storage?.characterCount"
        class="space-y-3 text-sm mb-4 text-ink-gray-8"
      >
        <span class="text-base font-semibold">{{ __('Stats') }}</span>
        <li>
          <span class="inline-block w-24 text-ink-gray-5"
            >{{ __('Words') }}:</span
          >
          <span class="col-span-1">{{
            editor.storage.characterCount.words()
          }}</span>
        </li>
        <li>
          <span class="inline-block w-24 text-ink-gray-5"
            >{{ __('Characters') }}:</span
          >
          <span class="col-span-1">{{
            editor.storage.characterCount.characters()
          }}</span>
        </li>
        <li>
          <span class="inline-block w-24 text-ink-gray-5"
            >{{ __('Reading time') }}:</span
          >
          <span class="col-span-1">
            {{ Math.ceil(editor.storage.characterCount.words() / 200) }}
            {{
              Math.ceil(editor.storage.characterCount.words() / 200) > 1
                ? 'minutes'
                : 'minute'
            }}
          </span>
        </li>
      </ul>
      <div class="flex justify-between items-center">
        <span class="text-base font-semibold text-ink-gray-8">Access</span>
        <Button
          v-if="entity.share"
          :variant="'subtle'"
          size="sm"
          class="rounded flex justify-center items-center scale-[90%]"
          @click="emitter.emit('share')"
        >
          {{ __('Manage') }}
        </Button>
      </div>
      <LoadingIndicator
        v-if="!getGeneralAccess.data?.type"
        class="size-4 mx-auto my-1"
      />
      <ul v-else class="space-y-3 text-sm py-2">
        <li class="flex">
          <span class="inline-block w-24 text-ink-gray-5"
            >{{ __('General') }}:</span
          >
          <div class="col-span-1 flex gap-2">
            <div class="col-span-1 flex gap-2 items-center text-ink-gray-8">
              <div
                class="rounded-full flex items-center justify-center p-0.5 size-4.5"
                :class="accessConfig[getGeneralAccess.data.type].color"
              >
                <component
                  :is="accessConfig[getGeneralAccess.data.type].icon"
                  class="h-[90%] w-[90%]"
                />
              </div>
              <span>{{ accessConfig[getGeneralAccess.data.type].label }}</span>
            </div>
          </div>
        </li>
        <li>
          <span class="inline-block w-24 text-ink-gray-5"
            >{{ __('Shared') }}:</span
          >
          <span
            v-if="userAccess.data?.length"
            class="col-span-1 text-ink-gray-8"
          >
            {{
              userAccess.data.length +
              ' ' +
              (userAccess.data.length === 1 ? __('person') : __('people'))
            }}
            {{
              userAccess.data.length < 3
                ? '(' + userAccess.data.map((k) => k.user).join(', ') + ')'
                : ''
            }}
          </span>
          <span v-else>-</span>
        </li>
      </ul>
      <ul v-if="developer" class="space-y-3 text-sm text-ink-gray-8 mb-4 mt-4">
        <div>
          <span class="text-base font-semibold">{{ __('Developer') }}</span>
          <Button variant="subtle" size="sm" class="scale-[90%] float-right">
            <a :href="'/app/drive-file/' + entity.name" target="_blank"
              >Open in Desk</a
            >
          </Button>
        </div>
        <li>
          <span class="inline-block w-24">ID:</span>
          <span class="col-span-1">{{ entity.name }}</span>
        </li>
        <li>
          <span class="inline-block w-24">Disk path:</span>
          <span class="col-span-1">{{ entity.path }}</span>
        </li>
        <li>
          <span class="inline-block w-24">Team:</span>
          <span class="col-span-1">{{ entity.team }}</span>
        </li>
        <li>
          <span class="inline-block w-24">MIME type:</span>
          <span class="col-span-1">{{ entity.mime_type }}</span>
        </li>
      </ul>
    </template>
  </Dialog>
</template>

<script setup>
import {
  Dialog,
  Button,
  LoadingIndicator,
  createResource,
  TagInput,
} from '../../../src'
import { ref, inject } from 'vue'
import { onKeyDown } from '@vueuse/core'
import { formatDate } from '../js/utils'

const dialogType = defineModel()
const open = ref(true)

const editor = inject('editor')
const props = defineProps({
  entity: Object,
  emitter: Object,
})

// Refactor to share with ShareDialog
const getGeneralAccess = createResource({
  url: 'drive.api.permissions.get_user_access',
  makeParams: (params) => ({
    ...params,
    entity: props.entity.name,
  }),
  transform: (data) => {
    if (!data || !data.read) {
      if (getGeneralAccess.params.user === 'Guest')
        getGeneralAccess.fetch({ team: 1 })
      else
        return {
          type: 'restricted',
        }
    }
    return { ...data, type: getGeneralAccess.params.team ? 'team' : 'public' }
  },
})
getGeneralAccess.fetch({ user: 'Guest' })

const userAccess = createResource({
  url: 'drive.api.permissions.get_shared_with_list',
  params: { entity: props.entity.name },
  auto: true,
})

const developer = ref(false)
onKeyDown('D', () => {
  developer.value = !developer.value
})

const accessConfig = {
  team: {
    icon: LucideBuilding,
    color: 'bg-surface-blue-2 text-ink-blue-2',
    label: 'Team',
  },
  public: {
    icon: LucideGlobe2,
    color: 'bg-surface-red-2 text-ink-red-3',
    label: 'Public',
  },
  restricted: {
    icon: LucideLock,
    color: 'text-ink-gray-7 bg-surface-gray-4',
    label: 'Restricted',
  },
}
</script>
