import { createApp } from 'vue'
import './src/style.css'
import App from './App.vue'
import { router } from './demo/router'
import { spritePlugin } from './experimental/SpriteIcons'

const app = createApp(App)
app.use(router)
app.use(spritePlugin)
app.mount('#app')
