<script setup lang="ts">
// The file's "Funnel chart" row (Figma 1GDS12ys41lxeG3wQpNq41,
// 1356:68308 … 1356:68357): three shapes of the same five stages.
import { computed } from 'vue'
import Card from '../components/Card.vue'
import FunnelCard from '../components/FunnelCard.vue'
import { funnel } from '../chartData'
import {
  FUNNEL_COLUMN_OPACITY,
  FUNNEL_OPACITY,
  type ChartTheme,
} from '../chartThemes'
import type { ThemeColors } from '../useChartTheme'

const props = defineProps<{ theme: ThemeColors; themeId: ChartTheme }>()
const colors = computed(() => props.theme.colors('funnel', 5))
const steps = computed(() => props.theme.colors('funnelSteps', 5))
const opacity = computed(() => FUNNEL_OPACITY[props.themeId])
const columnOpacity = computed(() => FUNNEL_COLUMN_OPACITY[props.themeId])

/**
 * The columns card's steps, read off 1356:68357: five shapes 221, 193, 158,
 * 116 and 82 tall, standing on the same line, which is the taper the file
 * draws. It is not the one the counts give — 563 to 39 would close the last
 * step to a fifteenth of the first and leave it a line on the card's edge —
 * so the shares are carried here the way the heat table carries its steps,
 * and the counts stay printed over them where a reader can see them.
 */
const COLUMN_HEIGHTS = [1, 0.8733, 0.7149, 0.5249, 0.371]
</script>

<template>
  <Card>
    <FunnelCard
      title="Funnel chart"
      :stages="funnel"
      :colors="colors"
      :opacity="opacity"
      variant="centred"
    />
  </Card>
  <!-- The middle card is one colour fading in, not one flat wash: every band
       of 1356:68335 is Ocean 800 and they run 0.2, 0.4, 0.6, 0.8, 1 down the
       funnel, the same ladder the first card climbs with five colours. Given
       a flat 0.2 the five bands came out indistinguishable. -->
  <Card>
    <FunnelCard
      title="Funnel chart"
      :stages="funnel"
      :colors="[colors[3]]"
      :opacity="opacity"
      variant="flush"
    />
  </Card>
  <Card>
    <FunnelCard
      title="Funnel chart"
      :stages="funnel"
      :colors="steps"
      :opacity="columnOpacity"
      :heights="COLUMN_HEIGHTS"
      variant="columns"
    />
  </Card>
</template>
