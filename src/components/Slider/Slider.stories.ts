import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Slider from './Slider.vue'
import Example from './stories/Example.vue'
import Range from './stories/Range.vue'

const meta = {
  title: 'Components/Slider',
  component: Slider,
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const ExampleStory: Story = { render: () => Example, name: 'Example' }
export const RangeStory: Story = { render: () => Range, name: 'Range' }
