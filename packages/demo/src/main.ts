import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { pluginManager } from '@ruxuwu/jin';

const app = createApp(App)
app.use(router)
app.mount('#app')

console.log(pluginManager)
