<!-- Presentational, theme-independent mock of an app window shown inside each
     ThemeSwitcher card. See themeOptions.ts for why colors here are literal. -->
<template>
  <div :class="{ flex: option.panes.length > 1 }">
    <div
      v-for="(pane, index) in option.panes"
      :key="index"
      :class="pane.containerClass"
    >
      <div :class="pane.screenClass">
        <div
          class="flex gap-[3px] border-b px-1 py-[3px]"
          :class="pane.tone === 'light' ? 'border-gray-100' : 'border-gray-800'"
        >
          <div class="size-1.5 rounded-full bg-[#FF5F57]" />
          <div class="size-1.5 rounded-full bg-[#FEBC2D]" />
          <div class="size-1.5 rounded-full bg-[#28C840]" />
        </div>
        <div
          class="flex min-h-[41px] items-start justify-between gap-2 p-2.5 pb-1 pr-0"
        >
          <div
            class="flex flex-1 items-center gap-1 text-xs font-semibold text-ink-gray-5"
          >
            <img
              v-if="logoIsImage"
              :src="logo as string"
              class="size-5 object-cover"
              alt=""
            />
            <component
              :is="logo"
              v-else-if="logo"
              class="size-5 shrink-0 rounded"
            />
            <div v-if="name">{{ name }}</div>
          </div>
          <div
            v-if="option.bars"
            class="flex flex-1 flex-col gap-[5px]"
          >
            <div
              v-for="bar in 3"
              :key="bar"
              class="h-1.5 w-full"
              :class="pane.tone === 'light' ? 'bg-gray-100' : 'bg-gray-800'"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import type { ThemeOption } from './themeOptions'

defineOptions({ name: 'ThemePreview' })

defineProps<{
  option: ThemeOption
  logo?: string | Component
  name?: string
  logoIsImage: boolean
}>()
</script>
