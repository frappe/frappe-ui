<script lang="ts">
import {
  computed,
  defineComponent,
  h,
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
import Spinner from '../Spinner/Spinner.vue'
import TooltipBubble from '../Tooltip/TooltipBubble.vue'
import { warnUnsupportedIconString } from '../../utils/iconString'
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
  setup(props, { attrs, slots }) {
    watchEffect(() => {
      warnUnsupportedIconString('Button', 'icon', props.icon)
      warnUnsupportedIconString('Button', 'iconLeft', props.iconLeft)
      warnUnsupportedIconString('Button', 'iconRight', props.iconRight)
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

    /**
     * The pressed look is driven by `data-state`, not a prop. A menu primitive
     * using this Button as its `as-child` trigger already stamps
     * `data-state="open"` on it, so a Dropdown/Popover/Select trigger holds the
     * pressed look for free; a standalone toggle sets `data-state="active"`
     * itself.
     */
    const isActive = computed(() => {
      const state = attrs['data-state']
      return state === 'open' || state === 'active'
    })

    const buttonClasses = computed(() => {
      const solidClasses = {
        gray: 'text-ink-base bg-surface-gray-10 hover:bg-surface-gray-9 active:bg-surface-gray-8',
        blue: 'text-ink-base bg-surface-blue-6 hover:bg-surface-blue-7 active:bg-surface-blue-8',
        green:
          'text-ink-base bg-surface-green-7 hover:bg-surface-green-8 active:bg-surface-green-9',
        red: 'text-ink-base dark:text-ink-red-9 bg-surface-red-7 hover:bg-surface-red-8 active:bg-surface-red-9',
      }[props.theme]

      const subtleClasses = {
        gray: 'text-ink-gray-8 bg-surface-gray-2 hover:bg-surface-gray-3 active:bg-surface-gray-4',
        blue: 'text-ink-blue-5 bg-surface-blue-2 hover:bg-surface-blue-3 active:bg-surface-blue-4',
        green:
          'text-ink-green-8 bg-surface-green-2 hover:bg-surface-green-3 active:bg-surface-green-4',
        red: 'text-ink-red-7 bg-surface-red-2 hover:bg-surface-red-3 active:bg-surface-red-4',
      }[props.theme]

      const outlineClasses = {
        gray: 'text-ink-gray-8 bg-surface-base border border-outline-gray-2 hover:border-outline-gray-3 active:border-outline-gray-3 active:bg-surface-gray-4',
        blue: 'text-ink-blue-5 bg-surface-base border border-outline-blue-1 hover:border-outline-blue-4 active:border-outline-blue-4 active:bg-surface-blue-4',
        green:
          'text-ink-green-8 bg-surface-base border border-outline-green-3 hover:border-outline-green-5 active:border-outline-green-5 active:bg-surface-green-4',
        red: 'text-ink-red-7 bg-surface-base border border-outline-red-1 hover:border-outline-red-3 active:border-outline-red-3 active:bg-surface-red-3',
      }[props.theme]

      const ghostClasses = {
        gray: 'text-ink-gray-8 bg-transparent hover:bg-surface-gray-3 active:bg-surface-gray-4',
        blue: 'text-ink-blue-5 bg-transparent hover:bg-surface-blue-3 active:bg-surface-blue-4',
        green:
          'text-ink-green-8 bg-transparent hover:bg-surface-green-3 active:bg-surface-green-4',
        red: 'text-ink-red-7 bg-transparent hover:bg-surface-red-3 active:bg-surface-red-4',
      }[props.theme]

      const focusClasses = {
        gray: '', // global :focus-visible ring
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

        'blue-solid': 'bg-surface-blue-4 text-ink-base',
        'blue-subtle': 'bg-surface-blue-2 text-ink-blue-link',
        'blue-outline':
          'bg-surface-blue-2 text-ink-blue-link border border-outline-blue-1',
        'blue-ghost': 'text-ink-blue-link',

        'green-solid': 'bg-surface-green-2 text-ink-green-4',
        'green-subtle': 'bg-surface-green-2 text-ink-green-4',
        'green-outline':
          'bg-surface-green-2 text-ink-green-4 border border-outline-green-3',
        'green-ghost': 'text-ink-green-4',

        'red-solid': 'bg-surface-red-2 text-ink-red-4',
        'red-subtle': 'bg-surface-red-2 text-ink-red-4',
        'red-outline':
          'bg-surface-red-2 text-ink-red-4 border border-outline-red-1',
        'red-ghost': 'text-ink-red-4',
      }
      const disabledClasses = disabledClassesMap[themeVariant]

      // The pressed look, held. Same tokens the `active:` pseudo-class uses,
      // minus a hover state — an open menu shouldn't lighten under the cursor.
      const activeClassesMap: Record<ThemeVariant, string> = {
        'gray-solid': 'text-ink-base bg-surface-gray-8',
        'gray-subtle': 'text-ink-gray-8 bg-surface-gray-4',
        'gray-outline':
          'text-ink-gray-8 bg-surface-gray-4 border border-outline-gray-3',
        'gray-ghost': 'text-ink-gray-8 bg-surface-gray-4',

        'blue-solid': 'text-ink-base bg-surface-blue-8',
        'blue-subtle': 'text-ink-blue-5 bg-surface-blue-4',
        'blue-outline':
          'text-ink-blue-5 bg-surface-blue-4 border border-outline-blue-4',
        'blue-ghost': 'text-ink-blue-5 bg-surface-blue-4',

        'green-solid': 'text-ink-base bg-surface-green-9',
        'green-subtle': 'text-ink-green-8 bg-surface-green-4',
        'green-outline':
          'text-ink-green-8 bg-surface-green-4 border border-outline-green-5',
        'green-ghost': 'text-ink-green-8 bg-surface-green-4',

        'red-solid': 'text-ink-base bg-surface-red-9',
        'red-subtle': 'text-ink-red-7 bg-surface-red-4',
        'red-outline':
          'text-ink-red-7 bg-surface-red-3 border border-outline-red-3',
        'red-ghost': 'text-ink-red-7 bg-surface-red-4',
      }
      const activeClasses = activeClassesMap[themeVariant]

      // One of the three replaces the others outright rather than layering, so
      // conflicting `bg-*` utilities never race on stylesheet order.
      const stateClasses = props.disabled
        ? disabledClasses
        : isActive.value
          ? activeClasses
          : variantClasses

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
        'inline-flex items-center justify-center gap-2 transition-colors shrink-0',
        // Only an explicit `disabled` dims the button. A `loading` button keeps
        // its normal look (it's still non-interactive via the native `disabled`
        // attr below); `pointer-events-none` suppresses hover/active visuals so
        // it doesn't appear clickable while busy.
        stateClasses,
        props.loading && !props.disabled ? 'pointer-events-none' : '',
        focusClasses,
        sizeClasses,
      ]
    })

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

    /** Resolve an icon prop to a vnode: lucide class-span or component. */
    function renderIcon(
      icon: string | Component | undefined,
      propName: string,
    ): VNode | null {
      if (!icon) return null
      if (typeof icon === 'string') {
        if (icon.startsWith('lucide-')) {
          return h('span', {
            class: [icon, lucideSlotClasses.value],
            'aria-hidden': 'true',
          })
        }
        // Unsupported string (e.g. a bare feather-style name) — warned
        // above via warnUnsupportedIconString. Nothing to render.
        return null
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
      return renderIcon(props.iconLeft, 'iconLeft')
    }

    function renderMain() {
      if (props.loading && props.loadingText) return props.loadingText
      if (isIconButton.value && !props.loading) {
        if (props.icon) return renderIcon(props.icon, 'icon')
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
      return renderIcon(props.iconRight, 'iconRight')
    }

    return () => {
      const { class: attrClass, ...restAttrs } = attrs
      const { is, props: rootProps } = root.value
      const children = [renderPrefix(), renderMain(), renderSuffix()]
      const mergedProps = {
        ...rootProps,
        ...restAttrs,
        class: [attrClass, buttonClasses.value],
        'aria-label': props.label ?? restAttrs['aria-label'],
        'aria-busy': props.loading || undefined,
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
