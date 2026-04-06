import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Tabs from './Tabs.vue'
import Icons from './stories/Icons.vue'
import Orientation from './stories/Orientation.vue'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const IconsStory: Story = { render: () => Icons, name: 'Icons' }
export const OrientationStory: Story = { render: () => Orientation, name: 'Orientation' }
