import { Divider, Badge } from '../index'

export default {
  component: Divider,
  tags: ['autodocs'],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { Divider },
    template:
      args.orientation == 'horizontal'
        ? `<Divider class="min-w-[300px]" v-bind="$props"/>`
        : `<Divider class="min-h-[100px]" v-bind="$props"/>`,
  }),
  argTypes: {
    orientation: {
      options: ['horizontal', 'vertical'],
      control: { type: 'select' },
    },
    position: {
      options: ['start', 'center', 'end'],
      control: 'select',
    },
  },
  args: {
    orientation: 'horizontal',
    position: 'center',
    flexItem: false,
  },
}

export const Horizontal = {
  args: {
    orientation: 'horizontal',
  },
}

export const Vertical = {
  args: {
    orientation: 'vertical',
  },
}

export const InFlexContainer = {
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { Divider, Badge },
    template: `
      <div class="flex flex-row space-x-1">
        <Badge variant="ghost" label="One" />
        <Divider v-bind="$props" />
        <Badge variant="ghost" label="Two" />
        <Divider v-bind="$props" />
        <Badge variant="ghost" label="Three" />
      </div>
    `,
  }),
  args: {
    orientation: 'vertical',
    flexItem: true,
  },
}

export const HorizontalWithAction = {
  args: {
    action: {
      label: 'Load More',
      handler: () => {},
    },
  },
}

export const WithActionLoading = {
  args: {
    action: {
      label: 'Loading More',
      handler: () => {},
      loading: true,
    },
  },
}

export const WithActionAtStart = {
  args: {
    position: 'start',
    action: {
      label: 'Load More',
      handler: () => {},
    },
  },
}

export const WithActionAtEnd = {
  args: {
    position: 'end',
    action: {
      label: 'Load More',
      handler: () => {},
    },
  },
}

export const VerticalWithAction = {
  args: {
    orientation: 'vertical',
    action: {
      label: 'Load More',
      handler: () => {},
    },
  },
}
