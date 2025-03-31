import { SimplePluginManager } from '../impl/plugin-manager';
import type { PluginManifest } from '../plugin-manager';

declare global {
    interface Window {
        __ruxuwu__: {
            plugins: PluginManifest[];
            pluginManager: SimplePluginManager;
        };
    }
}

const pluginManager = new SimplePluginManager();

// 如果没有定义__ruxuwu__对象，则创建一个
if (!window.__ruxuwu__) {
    console.info('Creating __ruxuwu__ object');
    window.__ruxuwu__ = {
        plugins: [],
        pluginManager,
    };
}

// 如果已经定义了__ruxuwu__对象，则直接注册插件
else {
    console.info('Registering plugins');
    window.__ruxuwu__.pluginManager = pluginManager;
    window.__ruxuwu__.plugins.forEach((plugin) => {
        console.info(`Registering plugin ${plugin.id}`);
        // 动态加载插件
        pluginManager.registerPlugin(plugin);
    });
}