<template>
  <div>
    <div
      v-if="items.length"
      class="min-w-40 rounded-lg border bg-surface-white p-1 text-base shadow-lg"
    >
      <button
        v-for="(item, index) in items"
        :key="index"
        :class="[
          index === selectedIndex ? 'bg-surface-gray-2' : '',
          'flex w-full items-center whitespace-nowrap rounded-md px-2 py-2 text-sm text-ink-gray-9',
        ]"
        @click="selectItem(index)"
        @mouseover="selectedIndex = index"
      >
        <span class="mr-2">{{ item.emoji }}</span>
        <span>{{ item.name }}</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    command: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      selectedIndex: 0,
    }
  },
  watch: {
    items() {
      this.selectedIndex = 0
    },
  },
  methods: {
    onKeyDown({ event }) {
      if (event.key === 'ArrowUp') {
        this.upHandler()
        return true
      }
      if (event.key === 'ArrowDown') {
        this.downHandler()
        return true
      }
      if (event.key === 'Enter') {
        this.enterHandler()
        return true
      }
      return false
    },
    upHandler() {
      this.selectedIndex =
        (this.selectedIndex + this.items.length - 1) % this.items.length
    },
    downHandler() {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length
    },
    enterHandler() {
      this.selectItem(this.selectedIndex)
    },
    selectItem(index) {
      const item = this.items[index]
      if (item) {
        this.command({ emoji: item.emoji })
      }
    },
  },
}
</script>

<style>
.emoji-suggestions {
  background: #fff;
  border-radius: 0.5rem;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.05),
    0px 10px 20px rgba(0, 0, 0, 0.1);
  padding: 0.2rem;
}

.emoji-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.3rem;
  cursor: pointer;
}

.emoji-item.is-selected {
  background: #eee;
}

.emoji {
  margin-right: 0.5rem;
}

.name {
  font-size: 0.9rem;
}
</style>
