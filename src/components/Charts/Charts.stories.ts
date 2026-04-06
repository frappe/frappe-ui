import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AxisChart from './AxisChart.vue'
import Examples from './stories/Examples.vue'

const meta = {
  title: 'Components/Charts',
  component: AxisChart,
} satisfies Meta<typeof AxisChart>

export default meta
type Story = StoryObj<typeof meta>

export const ExamplesStory: Story = { render: () => Examples, name: 'Examples' }
