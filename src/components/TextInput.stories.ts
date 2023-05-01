import { h } from 'vue'
import { FeatherIcon, TextInput } from '../index'
import AvatarVue from './Avatar.vue'

let ActivityIcon = {
  render() {
    return h(FeatherIcon, {
      name: 'activity',
      class: 'h-4',
    })
  },
}

let Avatar = {
  render() {
    return h(AvatarVue, {
      src: 'https://randomuser.me/api/portraits/women/2.jpg',
      size: 'xs',
    })
  },
}

let prefixSuffixOptions = {
  options: ['None', '1', '100', 'Icon', 'Avatar'],
  mapping: {
    None: null,
    Icon: ActivityIcon,
    Avatar: Avatar,
  },
}

export default {
  component: TextInput,
  tags: ['autodocs'],
  argTypes: {
    type: {
      options: [
        'date',
        'datetime-local',
        'email',
        'file',
        'month',
        'number',
        'password',
        'search',
        'tel',
        'text',
        'time',
        'url',
        'week',
      ],
      control: { type: 'select' },
    },
    size: {
      options: ['sm', 'md', 'lg', 'xl'],
      control: { type: 'inline-radio' },
    },
    variant: {
      options: ['subtle', 'outline'],
      control: { type: 'inline-radio' },
    },
    disabled: 'boolean',
    prefix: prefixSuffixOptions,
    suffix: prefixSuffixOptions,
  },
  args: {
    size: 'sm',
    variant: 'subtle',
    placeholder: 'Type something...',
  },
}

export const Normal = {
  args: {
    type: 'text',
  },
}

export const WithPrefixIcon = {
  args: {
    prefix: 'Icon',
  },
  render: function (args, { argTypes }) {
    return {
      props: Object.keys(argTypes),
      components: { TextInput },
      template: `<TextInput v-bind="$props">
            <template #prefix>
                <template v-if="typeof $props.prefix == 'string'">{{ $props.prefix }}</template>
                <component v-else-if="$props.prefix" :is="$props.prefix" />
            </template>
        </TextInput>`,
    }
  },
}

export const WithSuffixIcon = {
  args: {
    suffix: 'Icon',
  },
  render: function (args, { argTypes }) {
    return {
      props: Object.keys(argTypes),
      components: { TextInput },
      template: `<TextInput v-bind="$props">
            <template #suffix>
                <template v-if="typeof $props.suffix == 'string'">{{ $props.suffix }}</template>
                <component v-else-if="$props.suffix" :is="$props.suffix" />
            </template>
        </TextInput>`,
    }
  },
}

export const WithPrefixAvatar = {
  args: {
    prefix: 'Avatar',
  },
  render: WithPrefixIcon.render,
}

export const WithPrefixAndSuffixIcon = {
  args: {
    prefix: 'Icon',
    suffix: 'Icon',
  },
  render: function (args, { argTypes }) {
    return {
      props: Object.keys(argTypes),
      components: { TextInput },
      template: `<TextInput v-bind="$props">
            <template #prefix>
                <template v-if="typeof $props.prefix == 'string'">{{ $props.prefix }}</template>
                <component v-else-if="$props.prefix" :is="$props.prefix" />
            </template>
            <template #suffix>
                <template v-if="typeof $props.suffix == 'string'">{{ $props.suffix }}</template>
                <component v-else-if="$props.suffix" :is="$props.suffix" />
            </template>
        </TextInput>`,
    }
  },
}
