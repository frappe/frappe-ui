import type { Component } from 'vue'

export interface AccordionItem {
  /**
   * Unique value identifying the item. Used as the open/closed key for
   * `modelValue` / `defaultValue`. Falls back to the item's index when
   * omitted.
   */
  value?: string

  /** Text shown in the trigger header. */
  title: string

  /** Content shown when the item is expanded. */
  content?: string

  /**
   * Optional icon shown before the title. Pass a `lucide-*` class string for
   * the recommended class-based form, or a Vue component for custom icons.
   */
  icon?: string | Component

  /** Disables this item, preventing it from being toggled. */
  disabled?: boolean
}

export interface AccordionProps {
  /** Element/component used to render the accordion container. */
  as?: string

  /**
   * Heading tag each trigger is wrapped in. The WAI-ARIA accordion pattern
   * requires triggers to sit inside a heading so assistive tech can navigate
   * by heading; pick the level that fits the surrounding outline.
   */
  headingTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  /** List of items to render. */
  items: AccordionItem[]

  /**
   * Whether one (`single`) or several (`multiple`) items can be open at the
   * same time. Determines the shape of `modelValue` / `defaultValue`:
   * a `string` for `single`, a `string[]` for `multiple`.
   */
  type?: 'single' | 'multiple'

  /**
   * When `type` is `single`, allows the open item to be collapsed again by
   * clicking its trigger. Ignored for `multiple`.
   */
  collapsible?: boolean

  /** Currently open item value(s). Use with `v-model`. */
  modelValue?: string | string[]

  /** Open item value(s) for uncontrolled usage. */
  defaultValue?: string | string[]

  /** Disables the whole accordion. */
  disabled?: boolean
}
