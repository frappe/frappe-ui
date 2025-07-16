<template>
  <DropdownMenuRoot v-slot="{ open }">
    <DropdownMenuTrigger as-child>
      <slot v-if="$slots.default" v-bind="{ open }" />
      <Button v-else :active="false" v-bind="button">
        {{ button ? button?.label || null : 'Options' }}
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        :class="[
          cssClasses.dropdownContent,
          {
            'origin-top-left': placement == 'left',
            'origin-top-right': placement == 'right',
            'origin-top': placement == 'center',
          },
        ]"
        :side="contentSide"
        :align="contentAlign"
        :side-offset="4"
      >
        <div
          v-for="group in groups"
          :key="group.key"
          :class="cssClasses.groupContainer"
        >
          <DropdownMenuLabel
            v-if="group.group && !group.hideLabel"
            :class="cssClasses.groupLabel"
          >
            {{ group.group }}
          </DropdownMenuLabel>

          <DropdownMenuItem
            v-for="item in group.items"
            :key="item.label"
            as-child
            @select="item.onClick"
          >
            <component
              v-if="item.component"
              :is="item.component"
              :active="false"
            />
            <DropdownMenuSub v-else-if="item.submenu">
              <DropdownMenuSubTrigger as-child>
                <button :class="cssClasses.submenuTrigger">
                  <FeatherIcon
                    v-if="item.icon && typeof item.icon === 'string'"
                    :name="item.icon"
                    :class="cssClasses.itemIcon"
                    aria-hidden="true"
                  />
                  <component
                    :class="cssClasses.itemIcon"
                    v-else-if="item.icon"
                    :is="item.icon"
                  />
                  <span :class="cssClasses.itemLabel">
                    {{ item.label }}
                  </span>
                  <FeatherIcon
                    name="chevron-right"
                    :class="cssClasses.chevronIcon"
                    aria-hidden="true"
                  />
                </button>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent
                  :class="cssClasses.dropdownContent"
                  :side-offset="4"
                >
                  <div
                    v-for="submenuGroup in getSubmenuGroups(item.submenu)"
                    :key="submenuGroup.key"
                    :class="cssClasses.groupContainer"
                  >
                    <DropdownMenuLabel
                      v-if="submenuGroup.group && !submenuGroup.hideLabel"
                      :class="cssClasses.groupLabel"
                    >
                      {{ submenuGroup.group }}
                    </DropdownMenuLabel>

                    <DropdownMenuItem
                      v-for="subItem in submenuGroup.items"
                      :key="subItem.label"
                      as-child
                      @select="() => handleItemClick(subItem)"
                    >
                      <component
                        v-if="subItem.component"
                        :is="subItem.component"
                        :active="false"
                      />
                      <button v-else :class="cssClasses.itemButton">
                        <FeatherIcon
                          v-if="
                            subItem.icon && typeof subItem.icon === 'string'
                          "
                          :name="subItem.icon"
                          :class="cssClasses.itemIcon"
                          aria-hidden="true"
                        />
                        <component
                          :class="cssClasses.itemIcon"
                          v-else-if="subItem.icon"
                          :is="subItem.icon"
                        />
                        <span :class="cssClasses.itemLabel">
                          {{ subItem.label }}
                        </span>
                      </button>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <button v-else :class="cssClasses.itemButton">
              <FeatherIcon
                v-if="item.icon && typeof item.icon === 'string'"
                :name="item.icon"
                :class="cssClasses.itemIcon"
                aria-hidden="true"
              />
              <component
                :class="cssClasses.itemIcon"
                v-else-if="item.icon"
                :is="item.icon"
              />
              <span :class="cssClasses.itemLabel">
                {{ item.label }}
              </span>
            </button>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<script setup lang="ts">
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from 'reka-ui'
import { Button } from '../Button'
import FeatherIcon from '../FeatherIcon.vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type {
  DropdownProps,
  DropdownOption,
  DropdownGroupOption,
  DropdownOptions,
} from './types'

const router = useRouter()

const props = withDefaults(defineProps<DropdownProps>(), {
  options: () => [],
  placement: 'left',
})

// Unified click handling for all dropdown items
const handleItemClick = (item: DropdownOption) => {
  if (item.route) {
    router.push(item.route)
  } else if (item.onClick) {
    item.onClick()
  }
}

const normalizeDropdownItem = (option: DropdownOption) => {
  return {
    label: option.label,
    icon: option.icon,
    component: option.component,
    onClick: () => handleItemClick(option),
    submenu: option.submenu,
  }
}

// Unified group processing for both main options and submenu options
const processOptionsIntoGroups = (
  options: DropdownOptions,
): DropdownGroupOption[] => {
  let groups: DropdownGroupOption[] = []
  let currentGroup: DropdownGroupOption | null = null
  let i = 0

  for (let option of options) {
    if (option == null) {
      continue
    }

    if ('group' in option) {
      if (currentGroup) {
        groups.push(currentGroup)
        currentGroup = null
      }
      let groupOption = {
        key: i,
        ...option,
        items: filterOptions(option.items),
      } as DropdownGroupOption
      groups.push(groupOption)
    } else {
      if (!currentGroup) {
        currentGroup = {
          key: i,
          group: '',
          hideLabel: true,
          items: [],
        } as DropdownGroupOption
      }
      currentGroup.items.push(...filterOptions([option]))
    }
    i++
  }

  if (currentGroup) {
    groups.push(currentGroup)
  }

  return groups
}

const getSubmenuGroups = (submenuOptions: DropdownOptions) => {
  return processOptionsIntoGroups(submenuOptions)
}

const filterOptions = (options: DropdownOption[]) => {
  return (options || [])
    .filter(Boolean)
    .filter((option) => (option.condition ? option.condition() : true))
    .map((option) => normalizeDropdownItem(option))
}

// Semantic CSS classes for consistent styling
const cssClasses = {
  // Container classes
  dropdownContent:
    'min-w-40 divide-y divide-outline-gray-modals rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none dropdown-content',
  groupContainer: 'p-1.5',

  // Label classes
  groupLabel: 'flex h-7 items-center px-2 text-sm font-medium text-ink-gray-6',
  itemLabel: 'whitespace-nowrap text-ink-gray-7',

  // Icon classes
  itemIcon: 'mr-2 h-4 w-4 flex-shrink-0 text-ink-gray-6',
  chevronIcon: 'ml-auto h-4 w-4 flex-shrink-0 text-ink-gray-6',

  // Button classes
  itemButton:
    'group flex h-7 w-full items-center rounded px-2 text-base text-ink-gray-6 focus:bg-surface-gray-3 focus:outline-none data-[highlighted]:bg-surface-gray-3',
  submenuTrigger:
    'group flex h-7 w-full items-center rounded px-2 text-base text-ink-gray-6 focus:bg-surface-gray-3 focus:outline-none data-[highlighted]:bg-surface-gray-3 data-[state=open]:bg-surface-gray-3',
}

const groups = computed(() => {
  return processOptionsIntoGroups(props.options)
})

const contentSide = computed(() => {
  return 'bottom' as const
})

const contentAlign = computed(() => {
  if (props.placement === 'left') return 'start' as const
  if (props.placement === 'right') return 'end' as const
  if (props.placement === 'center') return 'center' as const
  return 'start' as const
})
</script>

<style scoped>
@keyframes dropdown-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes dropdown-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

:global(.dropdown-content[data-state='open']) {
  animation: dropdown-in 100ms ease-out;
}

:global(.dropdown-content[data-state='closed']) {
  animation: dropdown-out 75ms ease-in;
}
</style>
