import { RouterLinkProps } from 'vue-router'

export interface BreadcrumbItem {
  /** Text shown for the breadcrumb item */
  label: string

  /** Route location used when the item is a link */
  route?: RouterLinkProps['to']

  /** URL used when the item is a plain link, ignored if `route` is set */
  href?: string

  /**
   * Click handler for non-router breadcrumb items. Set it together with `href`
   * to keep a real URL on the crumb and still navigate in-app: a plain left
   * click runs the handler only, a modified click opens the URL as usual.
   */
  onClick?: (event?: MouseEvent) => void

  /** Allows passing additional custom fields */
  [key: string]: any
}

export interface BreadcrumbsProps {
  /** Ordered list of breadcrumb items */
  items: BreadcrumbItem[]
}
