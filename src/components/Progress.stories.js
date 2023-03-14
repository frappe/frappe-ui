import { Progress } from '../index'

export default {
  component: Progress,
  tags: ['autodocs'],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { Progress },
    template: `<Progress v-bind="$props"/>`,
  }),
  argTypes: {
    value: {
      control: { type: 'number' },
    },
    size: {
      options: ['sm', 'md', 'lg', 'xl'],
      control: { type: 'select' },
    },
  },
  args: {
    value: 32,
    size: 'md',
    label: 'Progress',
    hint: true,
  },
}

export const Small = {
  args: {
    size: 'sm',
  },
}

export const Medium = {
  args: {
    size: 'md',
  },
}

export const Large = {
  args: {
    size: 'lg',
  },
}

export const ExtraLarge = {
  args: {
    size: 'xl',
  },
}

export const WithOnlyLabel = {
  args: {
    label: 'Progress',
    hint: false,
  },
}

export const WithOnlyHint = {
  args: {
    hint: true,
    label: null,
  },
}

export const WithHintAndLabel = {
  args: {
    hint: true,
    label: 'Progress',
  },
}

export const WithIntervals = {
  args: {
    value: 50,
    hint: true,
    label: 'Progress',
    intervals: true,
  },
}
