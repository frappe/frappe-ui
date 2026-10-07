<script setup lang="ts">
// The file's funnel (Figma 1GDS12ys41lxeG3wQpNq41, 1356:68308,
// 1356:68335, 1356:68357), which the library's FunnelChart — columns
// with their numbers over them — does not draw. Three shapes of one
// list: five bars narrowing down the middle, each 45 tall and 8 apart,
// the stage at the left in 13px ink-gray-5, its share at the right, its
// count in a white pill on the bar — the file holds both to 24 off the
// card's edge and puts the bars on the card's own centre (1356:68308's
// widest runs 119 to 461 of 580, and its "100%" closes at 556), so the
// two gutters are the same width and the middle falls where it should;
// the same bars flush left as trapezoids with no gap, every one in one
// colour at a rising opacity; and the stages as
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
/**
 * A bar's width, as a share of the funnel's own column. The widest bar fills
 * it, which is where the file puts its widest, and the rest are read off their
 * counts over a floor of 20 so a stage that collapsed to almost nothing is
 * still a bar you can see. The file's own taper is drawn rather than measured
 * — its centred card steps 100, 80, 60, 40, 20 whatever the counts beside it
 * say, and its other two step a third way again — so what is kept here is the
 * silhouette's reach, and the counts are left to say where each stage lands.
 */
const width = (count: number) => 20 + (count / first()) * 80
const fill = (i: number) => props.colors[i % props.colors.length]
const alpha = (i: number) => props.opacity[i % props.opacity.length]
</script>

<template>
  <ChartContainer
    :title="title"
    :class="variant === 'columns' && 'funnel-columns'"
  >
    <!-- centred: the stage, the bar, the share -->
    <div
      v-if="variant === 'centred'"
      class="flex h-full flex-col justify-center gap-2 pt-1"
    >
      <div
        v-for="(row, i) in stages"
        :key="row.stage"
        class="grid h-[45px] items-center"
        :style="{ gridTemplateColumns: '103px 1fr 103px' }"
      >
        <span
          class="ps-2 text-[13px] leading-[1.15] tracking-[0.02em] text-ink-gray-5"
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
          class="pe-2 text-end text-[13px] leading-[1.15] tracking-[0.02em] text-ink-gray-5"
        >
          {{ share(row.count) }}%
        </span>
      </div>
    </div>

    <!-- flush: the stage, then a trapezoid, every one in one colour. The
         bands do not run to the card's edge the way they did: the file opens
         them at 148 of 580 and closes the widest at 492, which is a quarter
         of the card for the names, three fifths for the funnel and the rest
         left clear (1356:68335). -->
    <div
      v-else-if="variant === 'flush'"
      class="flex h-full flex-col justify-center pt-1"
    >
      <div
        v-for="(row, i) in stages"
        :key="row.stage"
        class="grid h-[45px] items-center"
        :style="{ gridTemplateColumns: '23.9% 62.7% 1fr' }"
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
        :class="i > 0 && 'border-s border-outline-gray-1'"
      >
        <!-- the rule insets the names, not the steps: the file's columns
             touch along their whole edge (1356:68357 has them at 16, 125,
             235, 345 and 455, each 110 wide, so each one opens where the
             last one closed), and only the text stands off the hairline -->
        <span
          class="text-[13px] leading-[1.15] tracking-[0.02em] text-ink-gray-5"
          :class="i > 0 && 'ps-2.5'"
        >
          {{ row.stage }}
        </span>
        <span
          class="mt-2 text-[13px] leading-[1.15] tracking-[0.02em] text-ink-gray-8"
          :class="i > 0 && 'ps-2.5'"
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

<style scoped>
/* The columns stand 19 off the card's foot in the file (1356:68357 closes
   them at 341 of 360), where `ChartContainer` holds back 12 under a plot with
   no legend and left them ten pixels shy of it. Only this variant reaches the
   edge; the other two centre themselves in whatever they are given. */
.funnel-columns :deep([data-slot='chart-plot']) {
  padding-bottom: 2px;
}
</style>
