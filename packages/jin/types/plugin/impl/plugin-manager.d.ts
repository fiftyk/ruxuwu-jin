import type { PluginManager, PluginManifest, JinPlugin } from '../plugin-manager';
export declare class SimplePluginManager implements PluginManager {
    private plugins;
    registerPlugin(manifest: PluginManifest, factory: () => Promise<JinPlugin>): Promise<void>;
    activatePlugin(pluginId: string): Promise<void>;
    deactivatePlugin(pluginId: string): Promise<void>;
    /**
     * 加载 commonjs 模块
     * @param url 插件的 url
     */
    loadPlugin(url: string): Promise<JinPlugin>;
}
