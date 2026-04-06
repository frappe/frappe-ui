import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Combobox from './Combobox.vue'
import CustomRender from './stories/CustomRender.vue'
import Grouped from './stories/Grouped.vue'
import OptionSlots from './stories/OptionSlots.vue'
import Simple from './stories/Simple.vue'
import WithIcons from './stories/WithIcons.vue'

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

export const CustomRenderStory: Story = { render: () => CustomRender, name: 'Custom Render' }
export const GroupedStory: Story = { render: () => Grouped, name: 'Grouped' }
export const OptionSlotsStory: Story = { render: () => OptionSlots, name: 'Option Slots' }
export const SimpleStory: Story = { render: () => Simple, name: 'Simple' }
export const WithIconsStory: Story = { render: () => WithIcons, name: 'With Icons' }
