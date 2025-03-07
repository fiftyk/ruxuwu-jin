import type { PluginManager,  PluginManifest, JinPlugin, PluginContext } from '../plugin-manager';

export class SimplePluginManager implements PluginManager {
    
    private plugins: Map<string, JinPlugin> = new Map();
    private pluginContext: PluginContext = {}; // 存储 PluginContext

    // 新增方法：设置 PluginContext
    setPluginContext(context: Partial<PluginContext>): void {
        this.pluginContext = { ...this.pluginContext, ...context };
    }

    async registerPlugin(manifest: PluginManifest, factory: () => Promise<JinPlugin>): Promise<void> {
        const plugin = await factory();
        this.plugins.set(manifest.id, plugin);
    }

    async activatePlugin(pluginId: string): Promise<void> {
        const plugin = this.plugins.get(pluginId);
        if (plugin) {
            await plugin.activate(this.pluginContext); // 使用存储的 PluginContext
        } else {
            throw new Error(`Plugin with id ${pluginId} not found.`);
        }
    }

    async deactivatePlugin(pluginId: string): Promise<void> {
        const plugin = this.plugins.get(pluginId);
        if (plugin && plugin.deactivate) {
            await plugin.deactivate();
        } else {
            throw new Error(`Plugin with id ${pluginId} not found or does not have a deactivate method.`);
        }
    }

    /**
     * 加载 commonjs 模块
     * @param url 插件的 url
     */
    async loadPlugin(url: string): Promise<JinPlugin> {
        const response = await fetch(url);
        const code = await response.text();
        const factory = new Function('module', code);
        const module = { exports: {} };
        return factory(module);
    }
}