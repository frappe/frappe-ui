import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Dropdown from './Dropdown.vue'
import CustomTrigger from './stories/CustomTrigger.vue'
import Examples from './stories/Examples.vue'
import Grouped from './stories/Grouped.vue'
import Submenus from './stories/Submenus.vue'
import Switches from './stories/Switches.vue'

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

export const CustomTriggerStory: Story = { render: () => CustomTrigger, name: 'Custom Trigger' }
export const ExamplesStory: Story = { render: () => Examples, name: 'Examples' }
export const GroupedStory: Story = { render: () => Grouped, name: 'Grouped' }
export const SubmenusStory: Story = { render: () => Submenus, name: 'Submenus' }
export const SwitchesStory: Story = { render: () => Switches, name: 'Switches' }
