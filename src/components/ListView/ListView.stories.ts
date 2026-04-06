import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ListView from './ListView.vue'
import CellSlot from './stories/CellSlot.vue'
import CustomList from './stories/CustomList.vue'
import Empty from './stories/Empty.vue'
import Examples from './stories/Examples.vue'
import GroupedRows from './stories/GroupedRows.vue'

const meta = {
  title: 'Components/ListView',
  component: ListView,
} satisfies Meta<typeof ListView>

export default meta
type Story = StoryObj<typeof meta>

export const CellSlotStory: Story = { render: () => CellSlot, name: 'Cell Slot' }
export const CustomListStory: Story = { render: () => CustomList, name: 'Custom List' }
export const EmptyStory: Story = { render: () => Empty, name: 'Empty' }
export const ExamplesStory: Story = { render: () => Examples, name: 'Examples' }
export const GroupedRowsStory: Story = { render: () => GroupedRows, name: 'Grouped Rows' }
