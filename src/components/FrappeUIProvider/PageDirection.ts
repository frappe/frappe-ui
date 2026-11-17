import { defineComponent, h } from 'vue'
import { ConfigProvider } from 'reka-ui'
import { documentDir } from '../../charts/utils'

/**
 * Hands the page's direction (`<html dir>`) to the Reka parts in its slot.
 * Reka defaults to `ltr`, which forces Tabs, menus, selects and scroll areas
 * left to right on an RTL page.
 *
 * FrappeUIProvider wraps the app in it. Editor popups and dialogs mounted with
 * their own `createApp` sit outside that tree, so they wrap themselves.
 */
export const PageDirection = defineComponent({
  name: 'PageDirection',
  setup(_, { slots }) {
    return () => h(ConfigProvider, { dir: documentDir() }, slots)
  },
})
