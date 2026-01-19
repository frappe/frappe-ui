import { RouterLinkProps } from 'vue-router'
import { type Component } from 'vue'

export interface BreadcrumbItem {
  /** Text shown for the breadcrumb item */
  label: string

  /** Route location used when the item is a link */
  route?: RouterLinkProps['to']

  /** Click handler for non-router breadcrumb items */
  onClick?: () => void

  /** Allows passing additional custom fields */
  [key: string]: any

}

export interface BreadcrumbsProps {
  separator?: string | Component
  /** Ordered list of breadcrumb items */
  items: BreadcrumbItem[]
}
