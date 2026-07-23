import { createApp } from 'vue'
import { FrappeUI } from 'frappe-ui'

import App from './App.vue'
import router from './router'
import './index.css'

createApp(App).use(router).use(FrappeUI).mount('#app')
