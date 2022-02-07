<template>
  <Popover
    :show-popup="isShown"
    :hide-arrow="true"
    :placement="right ? 'bottom-end' : 'bottom-start'"
    @init="updateTargetWidth"
  >
    <template v-slot:target>
      <div
        class="h-full"
        ref="target"
        v-on-outside-click="() => (isShown = false)"
      >
        <slot
          :toggleDropdown="toggleDropdown"
          :highlightItemUp="highlightItemUp"
          :highlightItemDown="highlightItemDown"
          :selectHighlightedItem="selectHighlightedItem"
        ></slot>
      </div>
    </template>
    <template v-slot:content>
      <div
        class="z-10 rounded-md w-fullbg-white min-w-40"
        :style="{ width: widthFull ? targetWidth + 'px' : undefined }"
      >
        <div class="p-1 overflow-auto text-sm max-h-64">
          <div v-if="isLoading" class="p-2 text-gray-600">
            {{ _('Loading...') }}
          </div>
          <template v-else>
            <div v-for="d in dropdownItems" :key="d.label">
              <div
                v-if="d.isGroup"
                class="px-2 pt-2 pb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase"
              >
                {{ d.label }}
              </div>
              <a
                v-else
                :ref="setItemRef"
                class="block p-2 truncate rounded-md cursor-pointer first:mt-0"
                :class="d.index === highlightedIndex ? 'bg-gray-100' : ''"
                @mouseenter="highlightedIndex = d.index"
                @mouseleave="highlightedIndex = -1"
                @click="selectItem(d)"
              >
                <component :is="d.component" v-if="d.component" />
                <template v-else>{{ d.label }}</template>
              </a>
            </div>
          </template>
        </div>
      </div>
    </template>
  </Popover>
</template>

<script>
import Popover from './Popover.vue'
import onOutsideClick from '../directives/onOutsideClick'

export default {
  name: 'Dropdown',
  directives: {
    onOutsideClick,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    groups: {
      type: Array,
      default: null,
    },
    right: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    widthFull: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Popover,
  },
  data() {
    return {
      targetWidth: undefined,
      isShown: false,
      itemRefs: [],
      highlightedIndex: -1,
    }
  },
  computed: {
    sortedGroups() {
      if (Array.isArray(this.groups)) {
        return this.groups
      }
      let groupNames = [
        ...new Set(
          this.items
            .map((d) => d.group)
            .filter(Boolean)
            .sort()
        ),
      ]
      if (groupNames.length > 0) {
        return groupNames
      }
      return null
    },
    dropdownItems() {
      let items = this.items
        .filter(Boolean)
        .filter((d) => (d.condition ? d.condition() : true))

      if (this.sortedGroups) {
        let itemsByGroup = {}

        for (let item of items) {
          let group = item.group || ''
          itemsByGroup[group] = itemsByGroup[group] || []
          itemsByGroup[group].push(item)
        }

        let items = []
        let i = 0
        for (let group of this.sortedGroups) {
          let groupItems = itemsByGroup[group]
          groupItems = groupItems.map((d) => {
            d.index = i
            i++
            return d
          })
          items = items.concat(
            {
              label: group,
              isGroup: true,
            },
            groupItems
          )
        }

        return items
      }

      return items.filter(Boolean).map((d, i) => {
        d.index = i
        return d
      })
    },
  },
  methods: {
    selectItem(d) {
      if (d.action) {
        d.action()
      }
    },
    toggleDropdown(flag) {
      if (flag == null) {
        this.isShown = !this.isShown
      } else {
        this.isShown = Boolean(flag)
      }
    },
    selectHighlightedItem() {
      if (![-1, this.items.length].includes(this.highlightedIndex)) {
        // valid selection
        let item = this.items[this.highlightedIndex]
        this.selectItem(item)
      }
    },
    highlightItemUp() {
      this.highlightedIndex -= 1
      if (this.highlightedIndex < 0) {
        this.highlightedIndex = 0
      }
      this.$nextTick(() => {
        let index = this.highlightedIndex
        if (index !== 0) {
          index -= 1
        }
        this.scrollToHighlighted()
      })
    },
    highlightItemDown() {
      this.highlightedIndex += 1
      if (this.highlightedIndex > this.items.length) {
        this.highlightedIndex = this.items.length
      }

      this.$nextTick(() => {
        this.scrollToHighlighted()
      })
    },
    scrollToHighlighted() {
      let highlightedElement = this.$refs.items[this.highlightedIndex]
      highlightedElement &&
        highlightedElement.scrollIntoView({ block: 'nearest' })
    },
    updateTargetWidth() {
      this.$nextTick(() => {
        this.targetWidth = this.$refs.target.clientWidth
      })
    },
    setItemRef(el) {
      if (el) {
        this.itemRefs.push(el)
      }
    },
  },
}
</script>
