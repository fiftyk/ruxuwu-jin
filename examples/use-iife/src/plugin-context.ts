import type { PluginManager } from '@ruxuwu/jin';
import { type RouterRegister, routerRegister } from './services/router-register';

declare global {
    interface Window {
        __ruxuwu__: {
            pluginManager: PluginManager;
        };
    }
}

declare module '@ruxuwu/jin' {
    interface PluginContext {
        routerRegister: RouterRegister
    }
}

export function initializePluginManager() {
    const pluginManager: PluginManager = window.__ruxuwu__.pluginManager;

    pluginManager.setPluginContext({
        routerRegister,
    });

    return pluginManager;
}
