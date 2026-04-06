import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Button from './Button.vue'
import Icons from './stories/Icons.vue'
import Sizes from './stories/Sizes.vue'
import Themes from './stories/Themes.vue'
import Variants from './stories/Variants.vue'

const meta = {
  title: 'Components/Button',
  component: Button,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const IconsStory: Story = { render: () => Icons, name: 'Icons' }
export const SizesStory: Story = { render: () => Sizes, name: 'Sizes' }
export const ThemesStory: Story = { render: () => Themes, name: 'Themes' }
export const VariantsStory: Story = { render: () => Variants, name: 'Variants' }
