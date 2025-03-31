import type { PluginManager, PluginManifest, JinPlugin, PluginContext } from '../plugin-manager';
export declare class SimplePluginManager implements PluginManager {
    private plugins;
    private basePluginContext;
    private pluginContexts;
    setPluginContext(context: Partial<PluginContext>): void;
    private createPluginContext;
    registerPlugin(manifest: PluginManifest, factory?: (manifest: PluginManifest) => Promise<JinPlugin>): Promise<void>;
    activatePlugin(pluginId: string): Promise<void>;
    deactivatePlugin(pluginId: string): Promise<void>;
    /**
     * 加载 commonjs 模块
     * @param url 插件的 url
     */
    loadPlugin(url: string): Promise<JinPlugin>;
}
