import 'cross-fetch/dist/node-polyfill.js'
import DefaultTheme from 'vitepress/theme'
import Story from '../Story.vue'
import { resourcesPlugin } from '../../../src'
import '../../../src/style.css'
import './style.css'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)
    ctx.app.use(resourcesPlugin)
    ctx.app.component('Story', Story)
    ctx.app.config.unwrapInjectedRef = true
  },
}
