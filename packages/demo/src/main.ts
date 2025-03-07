import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { pluginManager } from '@ruxuwu/jin';

createApp(App).mount('#app')

console.log(pluginManager)
