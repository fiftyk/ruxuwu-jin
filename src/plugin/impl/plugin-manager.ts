import type { PluginManager,  PluginManifest, JinPlugin, PluginContext } from '../plugin-manager';

export class SimplePluginManager implements PluginManager {
    private plugins: Map<string, JinPlugin> = new Map();

    async registerPlugin(manifest: PluginManifest, factory: () => Promise<JinPlugin>): Promise<void> {
        const plugin = await factory();
        this.plugins.set(manifest.id, plugin);
    }

    async activatePlugin(pluginId: string): Promise<void> {
        const plugin = this.plugins.get(pluginId);
        if (plugin) {
            const context: PluginContext = {}; // 创建插件上下文
            await plugin.activate(context);
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
}
