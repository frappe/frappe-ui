<script setup lang="ts">
// The file's funnel (Figma 1GDS12ys41lxeG3wQpNq41, 1356:68308,
// 1356:68335, 1356:68357), which the library's FunnelChart — columns
// with their numbers over them — does not draw. Three shapes of one
// list: five bars narrowing down the middle, each 45 tall and 8 apart,
// the stage at the left in 13px ink-gray-5, its share at the right, its
// count in a white pill on the bar; the same bars flush left as
// trapezoids with no gap, every one in one colour; and the stages as
// five columns under their names and counts, each a trapezoid standing
// on the bottom edge, ruled apart by hairlines. The colours are the
// theme's funnel role, faded as the file fades them.
import { ChartContainer } from '../../../src/charts'

const props = defineProps<{
  title: string
  stages: Array<{ stage: string; count: number }>
  colors: string[]
  opacity: number[]
  variant: 'centred' | 'flush' | 'columns'
}>()

const first = () => props.stages[0]?.count ?? 1
const share = (count: number) => Math.round((count / first()) * 100)
/** a bar's width as the file's: 342 → 68 of a 516 plot over five stages */
const width = (count: number) => 20 + (count / first()) * 80
const fill = (i: number) => props.colors[i % props.colors.length]
const alpha = (i: number) => props.opacity[i % props.opacity.length]
</script>

<template>
  <ChartContainer :title="title">
    <!-- centred: the stage, the bar, the share -->
    <div
      v-if="variant === 'centred'"
      class="flex h-full flex-col justify-center gap-2 pt-1"
    >
      <div
        v-for="(row, i) in stages"
        :key="row.stage"
        class="grid h-[45px] items-center"
        :style="{ gridTemplateColumns: '92px 1fr 44px' }"
      >
        <span
          class="text-[13px] leading-[1.15] tracking-[0.02em] text-ink-gray-5"
        >
          {{ row.stage }}
        </span>
        <div class="relative flex h-full items-center justify-center">
          <div
            class="h-full"
            :style="{
              width: `${width(row.count)}%`,
              background: fill(i),
              opacity: alpha(i),
            }"
          />
          <span
            class="absolute rounded-full bg-surface-elevation-2 px-1.5 py-1 text-[13px] leading-[1.15] tracking-[0.02em] text-ink-gray-8"
          >
            {{ row.count }}
          </span>
        </div>
        <span
          class="text-end text-[13px] leading-[1.15] tracking-[0.02em] text-ink-gray-5"
        >
          {{ share(row.count) }}%
        </span>
      </div>
    </div>

    <!-- flush: the stage, then a trapezoid, every one in one colour -->
    <div
      v-else-if="variant === 'flush'"
      class="flex h-full flex-col justify-center pt-1"
    >
      <div
        v-for="(row, i) in stages"
        :key="row.stage"
        class="grid h-[45px] items-center"
        :style="{ gridTemplateColumns: '124px 1fr' }"
      >
        <span
          class="text-[13px] leading-[1.15] tracking-[0.02em] text-ink-gray-5"
        >
          {{ row.stage }}
        </span>
        <div class="relative h-full">
          <div
            class="h-full"
            :style="{
              width: `${width(row.count)}%`,
              background: fill(i),
              opacity: alpha(i),
              clipPath: 'polygon(0 0, 100% 0, calc(100% - 15px) 100%, 0 100%)',
            }"
          />
          <span
            class="absolute left-3 top-[11px] rounded-full bg-surface-elevation-2 px-2 py-1 text-[13px] leading-[1.15] tracking-[0.02em] text-ink-gray-8"
          >
            {{ row.count }}
          </span>
        </div>
      </div>
    </div>

    <!-- columns: name and count over a step standing on the bottom edge -->
    <div
      v-else
      class="grid h-full"
      :style="{ gridTemplateColumns: `repeat(${stages.length}, 1fr)` }"
    >
      <div
        v-for="(row, i) in stages"
        :key="row.stage"
        class="relative flex flex-col"
        :class="i > 0 && 'border-s border-outline-gray-1 ps-2.5'"
      >
        <span
          class="text-[13px] leading-[1.15] tracking-[0.02em] text-ink-gray-5"
        >
          {{ row.stage }}
        </span>
        <span
          class="mt-2 text-[13px] leading-[1.15] tracking-[0.02em] text-ink-gray-8"
        >
          {{ row.count }}
        </span>
        <div class="relative mt-auto h-[72%]">
          <div
            class="absolute inset-x-0 bottom-0"
            :style="{
              height: `${share(row.count)}%`,
              background: fill(i),
              opacity: alpha(i),
              clipPath: 'polygon(0 0, 100% 10px, 100% 100%, 0 100%)',
            }"
          />
        </div>
      </div>
    </div>
  </ChartContainer>
</template>
