<template>
  <Dialog v-model="open" :options="{ size: 'lg' }" @close="dialogType = ''">
    <template #body-main>
      <div class="p-4 sm:px-6">
        <div class="flex w-full justify-between gap-x-15 mb-4">
          <div class="font-semibold text-2xl flex text-nowrap overflow-hidden">
            <template v-if="props.entities.length > 1">
              Moving {{ props.entities.length }} items
            </template>
            <template v-else>
              Moving "
              <div class="truncate max-w-[80%]">
                {{ props.entities[0].title }}
              </div>
              "
            </template>
          </div>
          <Button class="ml-auto" variant="ghost" @click="dialogType = ''">
            <template #icon>
              <LucideX class="size-4" />
            </template>
          </Button>
        </div>
        <Tabs v-model="tabIndex" as="div" :tabs="tabs">
          <template #tab-panel>
            <div class="py-1 h-64 overflow-auto flex flex-col">
              <TeamSelector
                v-if="tabIndex === 1"
                v-model="chosenTeam"
                class="py-2 px-1"
              />
              <Tree
                v-for="k in tree.children"
                :key="k.value"
                node-key="value"
                :node="k"
              >
                <template
                  #node="{ node, hasChildren, isCollapsed, toggleCollapsed }"
                >
                  <div
                    class="flex items-center cursor-pointer select-none gap-1 h-7 shrink-0"
                    @click="openEntity(node)"
                  >
                    <div
                      ref="iconRef"
                      @click="
                        (e) => {
                          if (isCollapsed)
                            node.children.forEach((k) =>
                              fetchFolderContents(
                                k,
                                { entity_name: k.value },
                                true,
                              ),
                            )
                          toggleCollapsed(e)
                        }
                      "
                    >
                      <LucideChevronDown
                        v-if="hasChildren && !isCollapsed"
                        class="size-3.5"
                      />
                      <LucideChevronRight
                        v-else-if="hasChildren"
                        class="size-3.5"
                      />
                      <div v-else class="ps-3.5" />
                    </div>
                    <div
                      class="flex-grow rounded-sm text-base truncate h-full flex items-center pl-1"
                      :class="[
                        selected === node.value
                          ? 'bg-surface-gray-3'
                          : 'hover:bg-surface-gray-2',
                        entities[0].parent_entity === node.value
                          ? 'cursor-not-allowed hover:bg-surface-white'
                          : 'group',
                      ]"
                    >
                      <LucideFolderClosed
                        v-if="isCollapsed"
                        class="mr-1 size-4"
                      />
                      <LucideFolder v-else class="mr-1 size-4" />
                      <div v-if="node.value === null" class="overflow-visible">
                        <Input
                          v-model="node.label"
                          v-focus
                          type="text"
                          input-class=" !h-6"
                          @click.stop
                          @keydown.enter="openEntity(node)"
                        />
                      </div>
                      <span v-else
                        >{{ node.label }}
                        <span
                          v-if="entities[0].parent_entity === node.value"
                          class="text-ink-gray-5"
                          >(current)</span
                        ></span
                      >
                      <Button
                        class="shrink hidden group-hover:block ml-auto"
                        :class="{
                          '!bg-surface-gray-3': selected === node.value,
                        }"
                        @click.stop="
                          (e) => {
                            let obj = {
                              parent: node.value,
                              value: null,
                              label: 'New folder',
                            }
                            node.children.push(obj)
                            if (isCollapsed) toggleCollapsed(e)
                          }
                        "
                      >
                        <LucideFolderPlus class="size-4" />
                      </Button>
                    </div>
                  </div>
                </template>
              </Tree>
              <div
                v-if="tree.loading"
                class="text-base flex justify-center flex-1"
              >
                <LoadingIndicator class="w-4.5" />
              </div>
              <div
                v-else-if="!tree.children.length"
                class="flex justify-center flex-1"
              >
                <div
                  class="self-center text-sm text-ink-gray-6 flex flex-col gap-2"
                >
                  <LucideFolderClosed class="size-5 self-center" />
                  No folders found
                </div>
              </div>
            </div>
          </template>
        </Tabs>
        <div class="flex items-center justify-between pt-4">
          <div class="flex items-center my-auto justify-start">
            <p class="text-sm pr-0.5 shrink-0">Moving to:</p>
            <Dropdown
              v-if="dropDownBreadcrumbs.length"
              class="h-7"
              :options="dropDownBreadcrumbs"
            >
              <Button variant="ghost">
                <LucideEllipsis class="size-3.5" />
              </Button>
            </Dropdown>
            <span
              v-if="dropDownBreadcrumbs.length"
              class="text-ink-gray-5 mx-0.5"
            >
              {{ '/' }}
            </span>
            <div class="flex w-24 overflow-hidden">
              <div
                v-for="(crumb, index) in slicedBreadcrumbs"
                :key="index"
                class="flex items-center"
              >
                <span
                  v-if="breadcrumbs.length > 1 && index > 0"
                  class="text-ink-gray-5 mx-0.5"
                >
                  {{ '/' }}
                </span>
                <button
                  class="text-base cursor-pointer truncate max-w-20"
                  :title="crumb.title"
                  :class="
                    index === slicedBreadcrumbs.length - 1
                      ? 'text-ink-gray-9 text-base font-medium p-1'
                      : 'text-ink-gray-5 text-base rounded-[6px] hover:bg-surface-gray-2 p-1'
                  "
                  @click="closeEntity(crumb.name)"
                >
                  {{ crumb.title }}
                </button>
              </div>
            </div>
          </div>
          <Button
            variant="solid"
            class="ml-auto"
            size="sm"
            :disabled="
              entities[0].parent_entity !== selected &&
              chosenTeam === entities[0].team
            "
            :loading="move.loading"
            @click="moveFile"
          >
            <template #prefix>
              <LucideArrowLeftRight class="size-4" />
            </template>
            Move
          </Button>
        </div>
      </div>
    </template>
  </Dialog>
</template>
<script setup>
import { watch, computed, h, ref, reactive } from 'vue'

import {
  createResource,
  Dialog,
  Button,
  Tabs,
  Dropdown,
  Tree,
  Input,
  LoadingIndicator,
  toast,
} from '../../../src'
import { move, getTeams } from '../js/resources'

import { useRoute } from 'vue-router'

import LucideBuilding2 from '~icons/lucide/building-2'
import LucideChevronDown from '~icons/lucide/chevron-down'
import LucideFolder from '~icons/lucide/folder'
import LucideHome from '~icons/lucide/home'
import LucideArrowLeftRight from '~icons/lucide/arrow-left-right'
import TeamSelector from './TeamSelector.vue'

const props = defineProps({
  entities: {
    type: Object,
    required: false,
    default: null,
  },
})
const emit = defineEmits(['success', 'complete'])

const dialogType = defineModel()
const open = ref(true)

const route = useRoute()
const tabIndex = ref(route.name == 'Home' ? 0 : 1)
const chosenTeam = ref(route.params.team || '')
const tree = reactive({
  name: '',
  label: 'Home',
  children: [],
  options: {
    isCollapsed: true,
  },
})

// State variables
const selected = ref('')
const breadcrumbs = ref([
  { name: '', title: tabIndex.value === 0 ? 'Home' : 'Team' },
])

const tabs = [
  {
    label: 'Home',
    icon: h(LucideHome, { class: 'size-4' }),
  },
  {
    label: 'Teams',
    icon: h(LucideBuilding2, { class: 'size-4' }),
  },
  // {
  //   label: "Favourites",
  //   icon: h(Star, { class: "size-4" }),
  // },
]

const folderContents = createResource({
  url: 'drive.api.list.files',
  makeParams: (params) => ({
    ...params,
    team: chosenTeam.value,
    is_active: 1,
    folders: 1,
  }),
})

const fetchFolderContents = (tree, params = {}, nested = false) => {
  folderContents.fetch(params, {
    onSuccess: (data) => {
      tree.children = []
      data.forEach((item) => {
        const node = reactive({
          ...item,
          label: item.title,
          value: item.name,
          children: [],
        })
        node.isCollapsed = true
        tree.children.push(node)
        if (!nested)
          fetchFolderContents(
            node,
            { ...params, entity_name: node.value },
            true,
          )
      })
      tree.loading = false
    },
  })
}

const selectedPerms = createResource({
  url: 'drive.api.permissions.get_entity_with_permissions',
  makeParams: () => ({
    entity_name: selected.value,
  }),
  onSuccess: (data) => {
    const team = getTeams.data[data.team]
    const first = [
      {
        name: '',
        title: team ? team.title : 'Home',
      },
    ]
    breadcrumbs.value = first.concat(data.breadcrumbs.slice(1))
  },
})

watch(
  [tabIndex, chosenTeam],
  ([newValue, team], [prev, _]) => {
    selected.value = ''
    tree.loading = true
    if ((newValue === 1 && !team) || (newValue === 0 && prev == newValue))
      return
    tree.children = []
    switch (newValue) {
      case 0:
        chosenTeam.value = ''
        breadcrumbs.value = [{ name: '', title: 'Home' }]
        fetchFolderContents(tree)
        break
      case 1:
        breadcrumbs.value = [{ name: '', title: getTeams.data[team].title }]
        fetchFolderContents(tree)
        break
      case 2:
        folderContents.fetch({
          entity_name: '',
          favourites_only: true,
        })
        break
    }
  },
  { immediate: true },
)

// Breadcrumb logic
const slicedBreadcrumbs = computed(() => {
  if (breadcrumbs.value.length > 3) {
    return breadcrumbs.value.slice(-3)
  }
  return breadcrumbs.value
})

const dropDownBreadcrumbs = computed(() => {
  const allExceptLastTwo = breadcrumbs.value.slice(0, -3)
  return allExceptLastTwo.map((item) => {
    return {
      ...item,
      icon: null,
      label: item.title,
      onClick: () => closeEntity(item.name),
    }
  })
})

// New folder logic
const createdNode = ref(null)
const createFolder = createResource({
  url: 'drive.api.files.create_folder',
  makeParams(params) {
    return {
      ...params,
      team: chosenTeam.value,
    }
  },
  validate(params) {
    if (!params?.title) return false
  },
  onSuccess(data) {
    createdNode.value.value = data.name
    createdNode.value.children = []
    selected.value = data.name
    selectedPerms.fetch()
    createdNode.value = null
  },
  onError() {
    toast.error('There is already a folder with this name here.')
  },
})

// Selection logic
function openEntity(node) {
  if (props.entities[0].parent_entity === node.value) return
  if (!node.value) {
    createdNode.value = node
    createFolder.fetch({
      title: node.label,
      personal: tabIndex.value === 0,
      parent: node.parent,
    })
  } else {
    selected.value = node.value
    selectedPerms.fetch({
      entity_name: selected.value,
    })
  }
}

function closeEntity(name) {
  const index = breadcrumbs.value.findIndex((obj) => obj.name === name)
  if (breadcrumbs.value.length > 1 && index !== breadcrumbs.value.length - 1) {
    breadcrumbs.value = breadcrumbs.value.slice(0, index + 1)
    selected.value = breadcrumbs.value[breadcrumbs.value.length - 1].name
    folderContents.fetch({
      entity_name: selected.value,
      personal: selected.value === '' ? 1 : -1,
    })
  }
}

const moveFile = async () => {
  open.value = false
  emit('success')
  await move.submit({
    entity_names: props.entities.map((obj) => obj.name),
    new_parent: selected.value,
    team: chosenTeam.value,
  })
  emit('complete')
}
</script>
