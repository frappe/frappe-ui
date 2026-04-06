import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Calendar from './Calendar.vue'
import CustomHeader from './stories/CustomHeader.vue'
import Examples from './stories/Examples.vue'

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const CustomHeaderStory: Story = { render: () => CustomHeader, name: 'Custom Header' }
export const ExamplesStory: Story = { render: () => Examples, name: 'Examples' }
