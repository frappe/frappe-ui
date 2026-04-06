import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DatePicker from './DatePicker.vue'
import DateTime from './stories/DateTime.vue'
import Examples from './stories/Examples.vue'
import Range from './stories/Range.vue'

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const DateTimeStory: Story = { render: () => DateTime, name: 'Date Time' }
export const ExamplesStory: Story = { render: () => Examples, name: 'Examples' }
export const RangeStory: Story = { render: () => Range, name: 'Range' }
