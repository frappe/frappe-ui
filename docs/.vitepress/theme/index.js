import DefaultTheme from 'vitepress/theme'
import Story from '../Story.vue'
import '../../../src/style.css'
import './style.css'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)
    ctx.app.component('Story', Story)
    ctx.app.config.unwrapInjectedRef = true
  },
}
