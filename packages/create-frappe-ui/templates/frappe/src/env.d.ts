interface Window {
  /**
   * The logged-in user, from the boot data in `www/__ROUTE_NAME__.py`. Only a
   * production build has boot data. The dev server serves the page without
   * Frappe.
   */
  user?: string
}
