import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { initializePluginManager } from './plugin-context';

const pluginManager = initializePluginManager();

await pluginManager.registerPlugin({
    id: 'hello-world-plugin',
    name: 'Hello World Plugin',
    version: '0.1.0',
    url: 'http://localhost:3000/index.js', // 指向 HTTP 服务器提供的插件 JS 文件
});

await pluginManager.activatePlugin('hello-world-plugin');

const app = createApp(App)
app.use(router)
app.mount('#app')
