import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { pluginManager } from '@ruxuwu/jin';
import { routerRegister } from './services/router-register';

pluginManager.setPluginContext({ routerRegister })

await pluginManager.registerPlugin({
    id: 'hello-world-plugin',
    name: 'Hello World Plugin',
    version: '0.1.0',
    url: 'http://localhost:3000/index.js', // 指向 HTTP 服务器提供的插件 JS 文件
}, (manifest) => {
    return pluginManager.loadPlugin(manifest.url);
});

await pluginManager.activatePlugin('hello-world-plugin');

const app = createApp(App)
app.use(router)
app.mount('#app')
