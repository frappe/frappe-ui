import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MonthPicker from './MonthPicker.vue'
import Example from './stories/Example.vue'

const meta = {
  title: 'Components/MonthPicker',
  component: MonthPicker,
} satisfies Meta<typeof MonthPicker>

export default meta
type Story = StoryObj<typeof meta>

export const ExampleStory: Story = { render: () => Example, name: 'Example' }
