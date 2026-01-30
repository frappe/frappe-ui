<template>
  <ContextMenuRoot>
    <ContextMenuTrigger as-child :disabled="disabled">
      <slot />
    </ContextMenuTrigger>

    <ContextMenuPortal>
      <ContextMenuContent 
        :class="cssClasses.contextMenuContent"
        collision-boundary="viewport"
        :collision-padding="16"
        :avoid-collisions="true"
      >
        <template v-for="group in groups" :key="group.key">
          <div v-if="group.items.length" :class="cssClasses.groupContainer">
            <ContextMenuLabel
              v-if="group.group && !group.hideLabel"
              :class="[cssClasses.groupLabel, getTextColor(group)]"
            >
              {{ group.group }}
            </ContextMenuLabel>

            <template v-for="(item, index) in group.items" :key="item.label">
              <!-- Separator -->
              <ContextMenuSeparator
                v-if="item.separator"
                :class="cssClasses.separator"
              />

              <!-- Submenu Item -->
              <ContextMenuSub v-else-if="item.submenu">
                <ContextMenuSubTrigger as-child>
                  <button
                    :class="[
                      cssClasses.submenuTrigger,
                      getSubmenuBackgroundColor(item),
                    ]"
                  >
                    <FeatherIcon
                      v-if="item.icon && typeof item.icon === 'string'"
                      :name="item.icon"
                      :class="[cssClasses.itemIcon, getIconColor(item)]"
                      aria-hidden="true"
                    />
                    <component
                      :class="[cssClasses.itemIcon, getIconColor(item)]"
                      v-else-if="item.icon"
                      :is="item.icon"
                    />
                    <div
                      v-else-if="groupHasIcons(group)"
                      :class="cssClasses.itemIconPlaceholder"
                    />
                    <Tooltip v-if="shouldShowTooltip(item)" :text="item.label" placement="right">
                      <span :class="[cssClasses.itemLabel, getTextColor(item)]">
                        {{ item.label }}
                      </span>
                    </Tooltip>
                    <span v-else :class="[cssClasses.itemLabel, getTextColor(item)]">
                      {{ item.label }}
                    </span>
                    <FeatherIcon
                      name="chevron-right"
                      :class="[cssClasses.chevronIcon, getIconColor(item)]"
                      aria-hidden="true"
                    />
                  </button>
                </ContextMenuSubTrigger>
                <ContextMenuPortal>
                  <ContextMenuSubContent
                    :class="cssClasses.contextMenuContent"
                    :side-offset="4"
                  >
                    <div
                      v-for="submenuGroup in getSubmenuGroups(item.submenu)"
                      :key="submenuGroup.key"
                      :class="cssClasses.groupContainer"
                    >
                      <ContextMenuLabel
                        v-if="submenuGroup.group && !submenuGroup.hideLabel"
                        :class="cssClasses.groupLabel"
                      >
                        {{ submenuGroup.group }}
                      </ContextMenuLabel>
                      <template
                        v-for="subItem in submenuGroup.items"
                        :key="subItem.label"
                      >
                        <ContextMenuSeparator
                          v-if="subItem.separator"
                          :class="cssClasses.separator"
                        />
                        <ContextMenuItem
                          v-else
                          as-child
                          @select="
                            (event: PointerEvent) =>
                              handleItemClick(subItem, event)
                          "
                          :disabled="subItem.disabled"
                          class="data-[disabled]:cursor-not-allowed"
                        >
                          <component
                            v-if="subItem.component"
                            :is="subItem.component"
                            :active="false"
                          />
                          <button
                            v-else
                            :class="[
                              cssClasses.itemButton,
                              getBackgroundColor(subItem),
                            ]"
                          >
                            <FeatherIcon
                              v-if="
                                subItem.icon &&
                                typeof subItem.icon === 'string'
                              "
                              :name="subItem.icon"
                              :class="[
                                cssClasses.itemIcon,
                                getIconColor(subItem),
                              ]"
                              aria-hidden="true"
                            />
                            <component
                              :class="[
                                cssClasses.itemIcon,
                                getIconColor(subItem),
                              ]"
                              v-else-if="subItem.icon"
                              :is="subItem.icon"
                            />
                            <div
                              v-else-if="groupHasIcons(submenuGroup)"
                              :class="cssClasses.itemIconPlaceholder"
                            />
                            <Tooltip v-if="shouldShowTooltip(subItem)" :text="subItem.label" placement="right">
                              <span
                                :class="[
                                  cssClasses.itemLabel,
                                  getTextColor(subItem),
                                ]"
                              >
                                {{ subItem.label }}
                              </span>
                            </Tooltip>
                            <span
                              v-else
                              :class="[
                                cssClasses.itemLabel,
                                getTextColor(subItem),
                              ]"
                            >
                              {{ subItem.label }}
                            </span>
                            <span
                              v-if="subItem.shortcut"
                              :class="cssClasses.shortcut"
                            >
                              {{ subItem.shortcut }}
                            </span>
                          </button>
                        </ContextMenuItem>
                      </template>
                    </div>
                  </ContextMenuSubContent>
                </ContextMenuPortal>
              </ContextMenuSub>

              <!-- Regular Item -->
              <ContextMenuItem
                v-else
                as-child
                @select="item.onClick"
                :disabled="item.disabled"
                class="data-[disabled]:cursor-not-allowed"
              >
                <slot v-if="$slots.item" name="item" v-bind="{ item }" />
                <component
                  v-else-if="item.component"
                  :is="item.component"
                  :active="false"
                />
                <button
                  v-else
                  :class="[cssClasses.itemButton, getBackgroundColor(item)]"
                >
                  <FeatherIcon
                    v-if="item.icon && typeof item.icon === 'string'"
                    :name="item.icon"
                    :class="[cssClasses.itemIcon, getIconColor(item)]"
                    aria-hidden="true"
                  />
                  <component
                    :class="[cssClasses.itemIcon, getIconColor(item)]"
                    v-else-if="item.icon"
                    :is="item.icon"
                  />
                  <div
                    v-else-if="groupHasIcons(group)"
                    :class="cssClasses.itemIconPlaceholder"
                  />
                  <Tooltip v-if="shouldShowTooltip(item)" :text="item.label" placement="right">
                    <span :class="[cssClasses.itemLabel, getTextColor(item)]">
                      {{ item.label }}
                    </span>
                  </Tooltip>
                  <span v-else :class="[cssClasses.itemLabel, getTextColor(item)]">
                    {{ item.label }}
                  </span>
                  <span v-if="item.shortcut" :class="cssClasses.shortcut">
                    {{ item.shortcut }}
                  </span>
                </button>
              </ContextMenuItem>
            </template>
          </div>
        </template>
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>

<script setup lang="ts">
import {
  ContextMenuRoot,
  ContextMenuTrigger,
  ContextMenuPortal,
  ContextMenuContent,
  ContextMenuLabel,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from 'reka-ui'
import FeatherIcon from '../FeatherIcon.vue'
import { Tooltip } from '../Tooltip'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type {
  ContextMenuProps,
  ContextMenuItem as ContextMenuItemType,
  ContextMenuGroupItem,
  ContextMenuItems,
  ContextMenuItemType as ContextMenuItemUnion,
} from './types'

const router = useRouter()

const props = withDefaults(defineProps<ContextMenuProps>(), {
  items: () => [],
  disabled: false,
  showTooltip: (label: string) => label.length > 15, // Default: show tooltip if label > 15 chars
})

// Helper function to determine if tooltip should be shown
const shouldShowTooltip = (item: ContextMenuItemType): boolean => {
  // Check item-level showTooltip first
  if (item.showTooltip !== undefined) {
    return item.showTooltip
  }
  
  // Fall back to component-level prop
  if (typeof props.showTooltip === 'function') {
    return props.showTooltip(item.label)
  }
  return props.showTooltip === true
}

// Unified click handling for all context menu items
const handleItemClick = (item: ContextMenuItemType, event: PointerEvent) => {
  if (item.route) {
    router.push(item.route)
  } else if (item.onClick) {
    item.onClick(event)
  }
}

const normalizeContextMenuItem = (option: ContextMenuItemType) => {
  return {
    ...option,
    label: option.label,
    theme: option.theme || 'gray',
    icon: option.icon,
    component: option.component,
    onClick: (event: PointerEvent) => handleItemClick(option, event),
    submenu: option.submenu,
    separator: option.separator,
    shortcut: option.shortcut,
  }
}

const getIconColor = (item: ContextMenuItemUnion) => {
  if (item.disabled) return 'text-ink-gray-4'
  
  return {
    gray: 'text-ink-gray-6',
    red: 'text-ink-red-3',
    green: 'text-green-800',
    blue: 'text-ink-blue-3',
  }[item.theme || 'gray'] || 'text-ink-gray-6'
}

const getTextColor = (item: ContextMenuItemUnion) => {
  if (item.disabled) return 'text-ink-gray-4'
  
  return {
    gray: 'text-ink-gray-7',
    red: 'text-ink-red-3',
    green: 'text-green-800',
    blue: 'text-ink-blue-3',
  }[item.theme || 'gray'] || 'text-ink-gray-7'
}

const getBackgroundColor = (item: ContextMenuItemUnion) => {
  return {
    gray: 'focus:bg-surface-gray-3 data-[highlighted]:bg-surface-gray-3 data-[state=open]:bg-surface-gray-3',
    red: 'focus:bg-surface-red-3 data-[highlighted]:bg-surface-red-3 data-[state=open]:bg-surface-red-3',
    green: 'focus:bg-green-200 data-[highlighted]:bg-green-200 data-[state=open]:bg-green-200',
    blue: 'focus:bg-blue-200 data-[highlighted]:bg-blue-200 data-[state=open]:bg-blue-200',
  }[item.theme || 'gray'] || 'focus:bg-surface-gray-3 data-[highlighted]:bg-surface-gray-3 data-[state=open]:bg-surface-gray-3'
}

const getSubmenuBackgroundColor = (item: ContextMenuItemUnion) => {
  return getBackgroundColor(item)
}

// Unified group processing for both main items and submenu items
const processItemsIntoGroups = (
  items: ContextMenuItems,
): ContextMenuGroupItem[] => {
  let groups: ContextMenuGroupItem[] = []
  let currentGroup: ContextMenuGroupItem | null = null
  let i = 0

  for (let item of items) {
    if (item == null) {
      continue
    }

    if ('group' in item) {
      if (currentGroup) {
        groups.push(currentGroup)
        currentGroup = null
      }
      let groupItem = {
        key: i,
        ...item,
        items: filterItems(item.items),
      } as ContextMenuGroupItem
      groups.push(groupItem)
    } else {
      if (!currentGroup) {
        currentGroup = {
          key: i,
          group: '',
          hideLabel: true,
          items: [],
        } as ContextMenuGroupItem
      }
      currentGroup.items.push(...filterItems([item]))
    }
    i++
  }

  if (currentGroup) {
    groups.push(currentGroup)
  }

  return groups
}

const getSubmenuGroups = (submenuItems: ContextMenuItems) => {
  return processItemsIntoGroups(submenuItems)
}

const filterItems = (items: ContextMenuItemType[]) => {
  return (items || [])
    .filter(Boolean)
    .filter((item) => !item.hidden) // Filter out hidden items
    .filter((item) => (item.condition ? item.condition() : true)) // Filter by condition
    .map((item) => normalizeContextMenuItem(item))
}

// Check if any item in a group has an icon
const groupHasIcons = (group: ContextMenuGroupItem) => {
  return group.items.some((item) => item.icon)
}


const cssClasses = {
  // Container classes
  contextMenuContent:
    'w-48 max-w-[calc(100vw-40px)] sm:w-56 md:w-60 max-h-[80vh] sm:max-h-[85vh] md:max-h-[calc(100vh-40px)] overflow-y-auto divide-y divide-outline-gray-modals rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none context-menu-content',
  groupContainer: 'p-2 sm:p-1.5 md:p-1.5',

  // Label classes
  groupLabel: 'flex h-7 sm:h-7 items-center px-2 text-sm font-medium truncate text-left',
  itemLabel: 'truncate text-left text-sm sm:text-base',

  // Icon classes
  itemIcon: 'mr-2 h-4 w-4 flex-shrink-0',
  itemIconPlaceholder: 'mr-2 h-4 w-4 flex-shrink-0',
  chevronIcon: 'ml-auto h-4 w-4 flex-shrink-0',

  // Button classes 
  itemButton:
    'group flex h-8 sm:h-7 w-full items-center rounded px-2 text-base focus:outline-none text-left touch-manipulation',
  submenuTrigger:
    'group flex h-8 sm:h-7 w-full items-center rounded px-2 text-base text-ink-gray-6 focus:outline-none text-left touch-manipulation',

  // Separator
  separator: 'my-1 h-px bg-outline-gray-modals',

  // Shortcut
  shortcut: 'ml-auto text-xs text-ink-gray-5 flex-shrink-0 pl-2 hidden sm:inline',
}

const groups = computed(() => {
  return processItemsIntoGroups(props.items)
})
</script>

<style scoped>
@keyframes context-menu-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes context-menu-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

:global(.context-menu-content[data-state='open']) {
  animation: context-menu-in 100ms ease-out;
}

:global(.context-menu-content[data-state='closed']) {
  animation: context-menu-out 75ms ease-in;
}

/* Custom scrollbar styling */
:global(.context-menu-content) {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

:global(.context-menu-content::-webkit-scrollbar) {
  width: 4px;
}

:global(.context-menu-content::-webkit-scrollbar-track) {
  background: transparent;
}

:global(.context-menu-content::-webkit-scrollbar-thumb) {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

:global(.context-menu-content::-webkit-scrollbar-thumb:hover) {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
