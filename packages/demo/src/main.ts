import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { pluginManager } from '@ruxuwu/jin';
import { routerRegister } from './services/router-register';
import examplePlugin from './plugins/example-plugin';
import helloWorldPlugin from '@ruxuwu-plugins/hello-world-plugin';

pluginManager.setPluginContext({ routerRegister })

await pluginManager.registerPlugin({
    id: 'example-plugin',
    name: 'Example Plugin',
    version: '0.1.0',
    url: '', // 插件的 URL，如果是本地插件可以留空
}, async () => examplePlugin);

await pluginManager.activatePlugin('example-plugin');

await pluginManager.registerPlugin({
    id: 'hello-world-plugin',
    name: 'Hello World Plugin',
    version: '0.1.0',
    url: '', // 插件的 URL，如果是本地插件可以留空
}, async () => helloWorldPlugin);

await pluginManager.activatePlugin('hello-world-plugin');

const app = createApp(App)
app.use(router)
app.mount('#app')
