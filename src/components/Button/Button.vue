<script lang="ts">
import {
  computed,
  defineComponent,
  h,
  ref,
  watchEffect,
  type Component,
  type SlotsType,
  type VNode,
} from 'vue'
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  injectTooltipProviderContext,
} from 'reka-ui'
import { RouterLink } from 'vue-router'
import FeatherIcon from '../FeatherIcon.vue'
import Spinner from '../Spinner/Spinner.vue'
import TooltipBubble from '../Tooltip/TooltipBubble.vue'
import { warnFeatherIconUsage } from '../../utils/iconString'
import { buttonProps, type ThemeVariant } from './types'

export default defineComponent({
  name: 'Button',
  inheritAttrs: false,
  props: buttonProps,
  slots: Object as SlotsType<{
    /** Content shown before the button label (left icon / custom content) */
    prefix: void
    /** Icon-only content for icon buttons */
    icon: void
    /** Main button content (overrides `label`) */
    default: void
    /** Content shown after the button label (right icon / custom content) */
    suffix: void
  }>,
  setup(props, { attrs, slots, expose }) {
    watchEffect(() => {
      warnFeatherIconUsage('Button', 'icon', props.icon)
      warnFeatherIconUsage('Button', 'iconLeft', props.iconLeft)
      warnFeatherIconUsage('Button', 'iconRight', props.iconRight)
    })

    const isDisabled = computed(() => props.disabled || props.loading)
    const hasTooltip = computed(() => Boolean(props.tooltip?.length))

    // Reuse a surrounding <TooltipProvider> (button group) when present so the
    // group's skip-delay applies to this button instead of a private provider.
    const parentTooltipProvider = injectTooltipProviderContext(null)

    // Render as an icon button when the default slot is exactly one lucide-* icon.
    const hasLucideIconInDefaultSlot = computed(() => {
      const content = slots.default?.()
      if (!Array.isArray(content)) return false
      const name = (content[0]?.type as { name?: string })?.name
      return typeof name === 'string' && name.startsWith('lucide-')
    })

    const isIconButton = computed(
      () =>
        Boolean(props.icon) ||
        Boolean(slots.icon) ||
        hasLucideIconInDefaultSlot.value,
    )

    const slotClasses = computed(
      () => ({ xs: 'h-3.5', sm: 'h-4', md: 'h-4.5', lg: 'h-5' })[props.size],
    )

    const lucideSlotClasses = computed(
      () =>
        ({
          xs: 'size-3.5',
          sm: 'size-4',
          md: 'size-4.5',
          lg: 'size-5',
        })[props.size],
    )

    const buttonClasses = computed(() => {
      const solidClasses = {
        gray: 'text-ink-base bg-surface-gray-10 hover:bg-surface-gray-9 active:bg-surface-gray-8',
        blue: 'text-ink-base bg-blue-500 hover:bg-surface-blue-3 active:bg-blue-700',
        green:
          'text-ink-base bg-surface-green-3 hover:bg-green-700 active:bg-green-800',
        red: 'text-ink-base bg-surface-red-7 hover:bg-surface-red-8 active:bg-surface-red-9',
      }[props.theme]

      const subtleClasses = {
        gray: 'text-ink-gray-8 bg-surface-gray-2 hover:bg-surface-gray-3 active:bg-surface-gray-4',
        blue: 'text-ink-blue-6 bg-surface-blue-2 hover:bg-blue-200 active:bg-blue-300',
        green:
          'text-green-800 bg-surface-green-2 hover:bg-green-200 active:bg-green-300',
        red: 'text-red-700 bg-surface-red-2 hover:bg-surface-red-3 active:bg-surface-red-4',
      }[props.theme]

      const outlineClasses = {
        gray: 'text-ink-gray-8 bg-surface-base bg-surface-base border border-outline-gray-2 hover:border-outline-gray-3 active:border-outline-gray-3 active:bg-surface-gray-4',
        blue: 'text-ink-blue-6 bg-surface-base border border-outline-blue-1 hover:border-blue-400 active:border-blue-400 active:bg-blue-300',
        green:
          'text-green-800 bg-surface-base border border-outline-green-3 hover:border-green-500 active:border-green-500 active:bg-green-300',
        red: 'text-red-700 bg-surface-base border border-outline-red-1 hover:border-outline-red-3 active:border-outline-red-3 active:bg-surface-red-3',
      }[props.theme]

      const ghostClasses = {
        gray: 'text-ink-gray-8 bg-transparent hover:bg-surface-gray-3 active:bg-surface-gray-4',
        blue: 'text-ink-blue-6 bg-transparent hover:bg-blue-200 active:bg-blue-300',
        green:
          'text-green-800 bg-transparent hover:bg-green-200 active:bg-green-300',
        red: 'text-red-700 bg-transparent hover:bg-surface-red-3 active:bg-surface-red-4',
      }[props.theme]

      const focusClasses = {
        gray: 'focus-visible:focus-ring',
        blue: 'focus-visible:focus-ring-blue',
        green: 'focus-visible:focus-ring-green',
        red: 'focus-visible:focus-ring-red',
      }[props.theme]

      const variantClasses = {
        subtle: subtleClasses,
        solid: solidClasses,
        outline: outlineClasses,
        ghost: ghostClasses,
      }[props.variant]

      const themeVariant: ThemeVariant = `${props.theme}-${props.variant}`

      const disabledClassesMap: Record<ThemeVariant, string> = {
        'gray-solid': 'bg-surface-gray-2 text-ink-gray-4',
        'gray-subtle': 'bg-surface-gray-2 text-ink-gray-4',
        'gray-outline':
          'bg-surface-gray-2 text-ink-gray-4 border border-outline-gray-2',
        'gray-ghost': 'text-ink-gray-4',

        'blue-solid': 'bg-blue-300 text-ink-base',
        'blue-subtle': 'bg-surface-blue-2 text-ink-blue-link',
        'blue-outline':
          'bg-surface-blue-2 text-ink-blue-link border border-outline-blue-1',
        'blue-ghost': 'text-ink-blue-link',

        'green-solid': 'bg-surface-green-2 text-ink-green-5',
        'green-subtle': 'bg-surface-green-2 text-ink-green-5',
        'green-outline':
          'bg-surface-green-2 text-ink-green-5 border border-outline-green-3',
        'green-ghost': 'text-ink-green-5',

        'red-solid': 'bg-surface-red-2 text-ink-red-5',
        'red-subtle': 'bg-surface-red-2 text-ink-red-5',
        'red-outline':
          'bg-surface-red-2 text-ink-red-5 border border-outline-red-1',
        'red-ghost': 'text-ink-red-5',
      }
      const disabledClasses = disabledClassesMap[themeVariant]

      const sizeClasses = isIconButton.value
        ? {
            xs: 'h-6 w-6 rounded-3',
            sm: 'h-7 w-7 rounded-4',
            md: 'h-8 w-8 rounded-4',
            lg: 'h-10 w-10 rounded-5',
          }[props.size]
        : {
            xs: 'h-6 text-xs px-1.5 rounded-3',
            sm: 'h-7 text-base px-2 rounded-4',
            md: 'h-8 text-base-medium px-2.5 rounded-4',
            lg: 'h-10 text-lg-medium px-3 rounded-5',
          }[props.size]

      return [
        'inline-flex items-center justify-center gap-2 transition-colors focus:outline-none shrink-0',
        // Only an explicit `disabled` dims the button. A `loading` button keeps
        // its normal look (it's still non-interactive via the native `disabled`
        // attr below); `pointer-events-none` suppresses hover/active visuals so
        // it doesn't appear clickable while busy.
        props.disabled ? disabledClasses : variantClasses,
        props.loading && !props.disabled ? 'pointer-events-none' : '',
        focusClasses,
        sizeClasses,
      ]
    })

    const rootRef = ref()
    expose({ rootRef })

    // The dynamic root: router link, external anchor, or native button. Using the
    // raw 'button' string (not <component :is>) sidesteps the historic recursion
    // with a globally-registered <Button> in consumer apps.
    const root = computed<{
      is: Component | string
      props: Record<string, unknown>
    }>(() => {
      if (!isDisabled.value && props.route) {
        return { is: RouterLink, props: { to: props.route } }
      }
      if (!isDisabled.value && props.link) {
        return {
          is: 'a',
          props: {
            href: props.link,
            target: '_blank',
            rel: 'noreferrer noopener',
          },
        }
      }
      return {
        is: 'button',
        props: { type: props.type, disabled: isDisabled.value },
      }
    })

    /** Resolve an icon prop to a vnode: lucide class-span, FeatherIcon, or component. */
    function renderIcon(
      icon: string | Component | undefined,
      featherHidden: boolean,
    ): VNode | null {
      if (!icon) return null
      if (typeof icon === 'string') {
        if (icon.startsWith('lucide-')) {
          return h('span', {
            class: [icon, lucideSlotClasses.value],
            'aria-hidden': 'true',
          })
        }
        return h(FeatherIcon, {
          name: icon,
          class: slotClasses.value,
          ...(featherHidden ? { 'aria-hidden': 'true' } : {}),
        })
      }
      return h(icon, { class: slotClasses.value })
    }

    function renderPrefix() {
      if (props.loading) {
        // No `size`/`theme` props: button spinner diameters are tuned per
        // button size and don't line up with Spinner's fixed sizes, and the
        // spinner inherits the button's text color.
        return h(Spinner, {
          class: {
            'size-3.5': props.size === 'xs',
            'size-4': props.size === 'sm',
            'size-4.5': props.size === 'md',
            'size-5': props.size === 'lg',
          },
        })
      }
      if (slots.prefix) return slots.prefix()
      return renderIcon(props.iconLeft, true)
    }

    function renderMain() {
      if (props.loading && props.loadingText) return props.loadingText
      if (isIconButton.value && !props.loading) {
        if (props.icon) return renderIcon(props.icon, false)
        if (slots.icon) return slots.icon()
        if (hasLucideIconInDefaultSlot.value) {
          return h(
            'div',
            { class: slotClasses.value },
            slots.default?.() ?? props.label,
          )
        }
        return null
      }
      return h(
        'span',
        { class: ['truncate', { 'sr-only': isIconButton.value }] },
        slots.default?.() ?? props.label,
      )
    }

    function renderSuffix() {
      if (slots.suffix) return slots.suffix()
      return renderIcon(props.iconRight, true)
    }

    return () => {
      const { class: attrClass, ...restAttrs } = attrs
      const { is, props: rootProps } = root.value
      const children = [renderPrefix(), renderMain(), renderSuffix()]
      const mergedProps = {
        ...rootProps,
        ...restAttrs,
        class: [attrClass, buttonClasses.value],
        'aria-label': props.label,
        'aria-busy': props.loading || undefined,
        ref: rootRef,
      }
      const button =
        typeof is === 'string'
          ? h(is, mergedProps, children)
          : h(is, mergedProps, { default: () => children })

      if (!hasTooltip.value) return button

      // Tooltip scaffolding renders only when a tooltip is set, so a bare button
      // ships without any tooltip context, listeners, or pointerdown-to-close.
      const tooltipRoot = h(TooltipRoot, null, {
        default: () => [
          h(TooltipTrigger, { asChild: true }, { default: () => button }),
          h(TooltipBubble, { text: props.tooltip }),
        ],
      })

      // Inside a button group, the provider already exists upstream — mounting
      // our own here would isolate this button from the shared skip-delay.
      return parentTooltipProvider
        ? tooltipRoot
        : h(TooltipProvider, null, { default: () => tooltipRoot })
    }
  },
})
</script>
