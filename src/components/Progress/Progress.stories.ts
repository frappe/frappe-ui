import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Progress from './Progress.vue'
import Examples from './stories/Examples.vue'
import Hint from './stories/Hint.vue'
import Intervals from './stories/Intervals.vue'
import Sizes from './stories/Sizes.vue'

const meta = {
  title: 'Components/Progress',
  component: Progress,
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const ExamplesStory: Story = { render: () => Examples, name: 'Examples' }
export const HintStory: Story = { render: () => Hint, name: 'Hint' }
export const IntervalsStory: Story = { render: () => Intervals, name: 'Intervals' }
export const SizesStory: Story = { render: () => Sizes, name: 'Sizes' }
