<template>
  <div
    class="progressbar"
    role="progressbar"
    :class="{
      completed: isCompleted,
      fillOuter: variant === 'outline',
    }"
  >
    <div v-if="!isCompleted">
      <p v-if="!showPercentage">{{ step }}</p>
      <p v-else>{{ progress.toFixed(0) }}%</p>
    </div>
    <div v-else class="check-icon" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  step: number
  totalSteps: number
  showPercentage?: boolean
  variant?: Variant
  theme?: string | ThemeProps
  size?: Size
  themeComplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  step: 1,
  totalSteps: 4,
  showPercentage: false,
  theme: 'black',
  size: 'md',
  themeComplete: 'lightgreen',
  variant: 'solid',
})

type Variant = 'solid' | 'outline'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
interface SizeProps {
  ringSize: string
  ringBarWidth: string
  innerTextFontSize: string
}

// predefined sizes for the circular progress bar
const sizeMap: Record<Size, SizeProps> = {
  xs: {
    ringSize: '30px',
    ringBarWidth: '6px',
    innerTextFontSize: props.showPercentage ? '8px' : '12px',
  },
  sm: {
    ringSize: '42px',
    ringBarWidth: '10px',
    innerTextFontSize: props.showPercentage ? '12px' : '16px',
  },
  md: {
    ringSize: '60px',
    ringBarWidth: '14px',
    innerTextFontSize: props.showPercentage ? '16px' : '20px',
  },
  lg: {
    ringSize: '84px',
    ringBarWidth: '18px',
    innerTextFontSize: props.showPercentage ? '20px' : '24px',
  },
  xl: {
    ringSize: '108px',
    ringBarWidth: '22px',
    innerTextFontSize: props.showPercentage ? '24px' : '28px',
  },
}

const size = computed(() => sizeMap[props.size] || sizeMap['md'])

type Theme = 'black' | 'red' | 'green' | 'blue' | 'orange'
interface ThemeProps {
  primary: string
  secondary: string
}
// predefined themes for the circular progress bar
const themeMap: Record<Theme, ThemeProps> = {
  black: {
    primary: '#333',
    secondary: '#888',
  },
  red: {
    primary: '#FF0000',
    secondary: '#FFD7D7',
  },
  green: {
    primary: '#22C55E',
    secondary: '#b1ffda',
  },
  blue: {
    primary: '#2376f5',
    secondary: '#D7D7FF',
  },
  orange: {
    primary: '#FFA500',
    secondary: '#FFE5CC',
  },
}

const theme = computed(() => {
  if (typeof props.theme === 'string') {
    return themeMap[props.theme as Theme] || themeMap['black']
  }
  return props.theme
})

const progress = computed(() => (props.step / props.totalSteps) * 100)
const isCompleted = computed(() => props.step === props.totalSteps)
</script>

<style scoped>
.progressbar {
  --size: v-bind(size.ringSize);
  --bar-width: v-bind(size.ringBarWidth);
  --font-size: v-bind(size.innerTextFontSize);
  --color-progress: v-bind(theme.primary);
  --color-remaining-circle: v-bind(theme.secondary);
  --color-complete: v-bind($props.themeComplete);
  --progress: v-bind(progress + '%');

  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  display: grid;
  place-items: center;

  position: relative;
  font-size: var(--font-size);
}
@property --progress {
  syntax: '<length-percentage>';
  inherits: true;
  initial-value: 0%;
}

.progressbar::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: conic-gradient(
    var(--color-progress) var(--progress),
    var(--color-remaining-circle) 0%
  );
  transition: --progress 500ms linear;
  aspect-ratio: 1 / 1;
  align-self: center;
}

.progressbar::after {
  content: '';
  position: absolute;
  background: white;
  border-radius: inherit;
  z-index: 1;
  width: calc(100% - var(--bar-width));
  aspect-ratio: 1 / 1;
}

.progressbar > div {
  z-index: 2;
  position: relative;
}

.progressbar.completed:not(.fillOuter)::after {
  background: var(--color-complete);
}
.progressbar.completed.fillOuter::before {
  background: var(--color-complete);
}

.check-icon {
  width: 15px;
  height: 15px;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODUiIGhlaWdodD0iODUiIHZpZXdCb3g9IjUgMzAgNzUgMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0zNS40MjM3IDUzLjczMjdMNjcuOTc4NyAyMS4xNzc3TDcyLjk4OTUgMjYuMTg0MkwzNS40MTk1IDYzLjc1TDEyLjg4NiA0MS4yMTIyTDE3Ljg5MjUgMzYuMjAxNUwzNS40MjM3IDUzLjczMjdaIiBmaWxsPSIjMWYxYTM4Ii8+Cjwvc3ZnPgo=');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
