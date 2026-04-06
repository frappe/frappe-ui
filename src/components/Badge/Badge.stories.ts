import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Badge from './Badge.vue'
import Themes from './stories/Themes.vue'
import Variants from './stories/Variants.vue'

const meta = {
  title: 'Components/Badge',
  component: Badge,
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const ThemesStory: Story = { render: () => Themes, name: 'Themes' }
export const VariantsStory: Story = { render: () => Variants, name: 'Variants' }
