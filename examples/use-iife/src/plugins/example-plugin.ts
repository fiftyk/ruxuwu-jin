import type { JinPlugin, PluginContext } from '@ruxuwu/jin';
import type { RouterRegister } from '../services/router-register';

declare module '@ruxuwu/jin' {
    interface PluginContext {
        routerRegister: RouterRegister
    }
}

const examplePlugin: JinPlugin = {
    async activate(context: PluginContext) {
        const { routerRegister } = context;

        // 注册新的路由
        routerRegister.register({
            path: '/example',
            name: 'Example',
            renderer: {
                mount(el: HTMLElement) {
                    debugger
                    el.innerHTML = '<h1>Example Page</h1><p>This is an example page.</p>';
                },
                dispose() {
                    // 清理逻辑
                }
            }
        });
    }
};

export default examplePlugin; 