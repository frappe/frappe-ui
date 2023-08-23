<template>
  <Menu as="div" class="relative inline-block text-left" v-slot="{ open }">
    <Popover
      :transition="dropdownTransition"
      :show="open"
      :placement="popoverPlacement"
    >
      <template #target>
        <MenuButton as="div">
          <slot v-if="$slots.default" v-bind="{ open }" />
          <Button v-else :active="open" v-bind="button">
            {{ button ? button?.label || null : 'Options' }}
          </Button>
        </MenuButton>
      </template>

      <template #body>
        <MenuItems
          class="mt-2 min-w-40 divide-y divide-gray-100 rounded-lg bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
          :class="{
            'left-0 origin-top-left': placement == 'left',
            'right-0 origin-top-right': placement == 'right',
            'inset-x-0 origin-top': placement == 'center',
          }"
        >
          <div v-for="group in groups" :key="group.key" class="p-1.5">
            <div
              v-if="group.group && !group.hideLabel"
              class="flex h-7 items-center px-2 text-sm font-medium text-gray-500"
            >
              {{ group.group }}
            </div>
            <MenuItem
              v-for="item in group.items"
              :key="item.label"
              v-slot="{ active }"
            >
              <component
                v-if="item.component"
                :is="item.component"
                :active="active"
              />
              <button
                v-else
                :class="[
                  active ? 'bg-gray-100' : 'text-gray-800',
                  'group flex h-7 w-full items-center rounded px-2 text-base',
                ]"
                @click="item.onClick"
              >
                <FeatherIcon
                  v-if="item.icon && typeof item.icon === 'string'"
                  :name="item.icon"
                  class="mr-2 h-4 w-4 flex-shrink-0 text-gray-700"
                  aria-hidden="true"
                />
                <component
                  class="mr-2 h-4 w-4 flex-shrink-0 text-gray-700"
                  v-else-if="item.icon"
                  :is="item.icon"
                />
                <span class="whitespace-nowrap">
                  {{ item.label }}
                </span>
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </template>
    </Popover>
  </Menu>
</template>

<script>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import Popover from './Popover.vue'
import Button from './Button.vue'
import FeatherIcon from './FeatherIcon.vue'

export default {
  name: 'Dropdown',
  props: {
    button: {
      type: Object,
      default: null,
    },
    options: {
      type: Array,
      default: () => [],
    },
    placement: {
      type: String,
      default: 'left',
    },
  },
  components: {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    Button,
    FeatherIcon,
    Popover,
  },
  methods: {
    normalizeDropdownItem(option) {
      let onClick = option.onClick || null
      if (!onClick && option.route && this.$router) {
        onClick = () => this.$router.push(option.route)
      }

      return {
        label: option.label,
        icon: option.icon,
        group: option.group,
        component: option.component,
        onClick,
      }
    },
    filterOptions(options) {
      return (options || [])
        .filter(Boolean)
        .filter((option) => (option.condition ? option.condition() : true))
        .map((option) => this.normalizeDropdownItem(option))
    },
  },
  computed: {
    groups() {
      let groups = this.options[0]?.group
        ? this.options
        : [{ group: '', items: this.options }]

      return groups.map((group, i) => {
        return {
          key: i,
          group: group.group,
          hideLabel: group.hideLabel || false,
          items: this.filterOptions(group.items),
        }
      })
    },
    dropdownTransition() {
      return {
        enterActiveClass: 'transition duration-100 ease-out',
        enterFromClass: 'transform scale-95 opacity-0',
        enterToClass: 'transform scale-100 opacity-100',
        leaveActiveClass: 'transition duration-75 ease-in',
        leaveFromClass: 'transform scale-100 opacity-100',
        leaveToClass: 'transform scale-95 opacity-0',
      }
    },
    popoverPlacement() {
      if (this.placement === 'left') return 'bottom-start'
      if (this.placement === 'right') return 'bottom-end'
      if (this.placement === 'center') return 'bottom-center'
      return 'bottom'
    },
  },
}
</script>
