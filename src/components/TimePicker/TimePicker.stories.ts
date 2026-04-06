import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TimePicker from './TimePicker.vue'
import Basic from './stories/Basic.vue'
import CustomOptions from './stories/CustomOptions.vue'
import Range from './stories/Range.vue'
import TwentyFour from './stories/TwentyFour.vue'

const meta = {
  title: 'Components/TimePicker',
  component: TimePicker,
} satisfies Meta<typeof TimePicker>

export default meta
type Story = StoryObj<typeof meta>

export const BasicStory: Story = { render: () => Basic, name: 'Basic' }
export const CustomOptionsStory: Story = { render: () => CustomOptions, name: 'Custom Options' }
export const RangeStory: Story = { render: () => Range, name: 'Range' }
export const TwentyFourStory: Story = { render: () => TwentyFour, name: '24-Hour' }
