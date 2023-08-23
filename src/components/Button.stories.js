import { h } from 'vue'
import { Button, FeatherIcon } from '../index'

let ActivityIcon = {
  render() {
    return h(FeatherIcon, {
      name: 'activity',
      class: 'h-3',
    })
  },
}

let prefixSuffixOptions = {
  options: ['None', '1', '100', 'Icon'],
  mapping: {
    None: null,
    Icon: ActivityIcon,
  },
}

export default {
  component: Button,
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { Button },
    template: `<Button v-bind="$props">
        <template #prefix>
            <template v-if="typeof $props.prefix == 'string'">{{ $props.prefix }}</template>
            <component v-else :is="$props.prefix" />
        </template>
        <template #default>
            <template v-if="typeof $props.default == 'string'">{{ $props.default }}</template>
            <component v-else :is="$props.default" />
        </template>
        <template #suffix>
            <template v-if="typeof $props.suffix == 'string'">{{ $props.suffix }}</template>
            <component v-else :is="$props.suffix" />
        </template>
    </Button>`,
  }),
  tags: ['autodocs'],
  argTypes: {
    prefix: prefixSuffixOptions,
    suffix: prefixSuffixOptions,
    icon: {
      options: ['None', 'edit', 'plus'],
      mapping: {
        None: null,
      },
    },
    default: {
      control: 'text',
    },
    theme: {
      options: ['gray', 'blue', 'green'],
      control: 'inline-radio',
    },
    size: {
      options: ['sm', 'md', 'lg', 'xl', '2xl'],
      control: 'inline-radio',
    },
    variant: {
      options: ['solid', 'subtle', 'outline', 'ghost'],
      control: 'inline-radio',
    },
  },
  args: {
    label: 'Discover',
    theme: 'gray',
    size: 'md',
    variant: 'solid',
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

export const ExtraExtraLarge = {
  args: {
    size: '2xl',
  },
}

export const Gray = {
  args: {
    theme: 'gray',
  },
}

export const Blue = {
  args: {
    theme: 'blue',
  },
}

export const Green = {
  args: {
    theme: 'green',
  },
}

export const Red = {
  args: {
    theme: 'red',
  },
}

export const Solid = {
  args: {
    variant: 'solid',
  },
}

export const Subtle = {
  args: {
    variant: 'subtle',
  },
}

export const Outline = {
  args: {
    variant: 'outline',
  },
}

export const Ghost = {
  args: {
    variant: 'ghost',
  },
}

export const Loading = {
  args: {
    loading: true,
  },
}

export const Prefix = {
  args: {
    prefix: 'Icon',
  },
}

export const Suffix = {
  args: {
    suffix: 'Icon',
  },
}

export const Icon = {
  args: {
    icon: 'edit-2',
  },
}
