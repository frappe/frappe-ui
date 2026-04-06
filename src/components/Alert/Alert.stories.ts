import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Alert from './Alert.vue'
import Controlled from './stories/Controlled.vue'
import Slots from './stories/Slots.vue'
import Themes from './stories/Themes.vue'

const meta = {
  title: 'Components/Alert',
  component: Alert,
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const ControlledStory: Story = { render: () => Controlled, name: 'Controlled' }
export const SlotsStory: Story = { render: () => Slots, name: 'Slots' }
export const ThemesStory: Story = { render: () => Themes, name: 'Themes' }
