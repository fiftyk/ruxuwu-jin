import type { PluginManager, PluginManifest, JinPlugin, PluginContext, Disposable } from '../plugin-manager';

export class SimplePluginManager implements PluginManager {

    private plugins: Map<string, JinPlugin> = new Map();
    private basePluginContext: Partial<PluginContext> = {}; // Base context with shared properties
    private pluginContexts: Map<string, PluginContext> = new Map(); // Individual contexts for each plugin
    private modules: Map<string, any> = new Map(); // Custom modules registry

    // 设置基础 PluginContext
    setPluginContext(context: Partial<PluginContext>): void {
        this.basePluginContext = { ...this.basePluginContext, ...context };

        // Update all existing plugin contexts with the new base context
        for (const [pluginId, existingContext] of this.pluginContexts.entries()) {
            // 更新基础上下文属性
            Object.assign(existingContext, this.basePluginContext);
        }
    }

    // Helper method to create a plugin's context
    private createPluginContext(pluginId: string): PluginContext {
        const subscriptions: Disposable[] = [];
        const context: PluginContext = {
            ...this.basePluginContext,
            subscriptions
        } as PluginContext;
        this.pluginContexts.set(pluginId, context);
        return context;
    }

    async registerPlugin(manifest: PluginManifest, factory?: (manifest: PluginManifest) => Promise<JinPlugin>): Promise<void> {
        let plugin: JinPlugin;
        if (manifest.url) {
            plugin = await this.loadPlugin(manifest.url);
        } else if (factory) {
            plugin = await factory(manifest);
        } else {
            throw new Error(`Cannot register plugin ${manifest.id}: neither URL nor factory provided`);
        }
        this.plugins.set(manifest.id, plugin);
        // 不再在注册时创建上下文
    }

    async activatePlugin(pluginId: string): Promise<void> {
        const plugin = this.plugins.get(pluginId);
        if (plugin) {
            // 在激活时创建或获取插件的上下文
            let context = this.pluginContexts.get(pluginId);
            if (!context) {
                context = this.createPluginContext(pluginId);
            }

            await plugin.activate(context);
        } else {
            throw new Error(`Plugin with id ${pluginId} not found.`);
        }
    }

    async deactivatePlugin(pluginId: string): Promise<void> {
        const plugin = this.plugins.get(pluginId);
        if (plugin) {
            // First call the plugin's deactivate method if it exists
            if (plugin.deactivate) {
                await plugin.deactivate();
            }

            // Then dispose all subscriptions registered by this plugin
            const context = this.pluginContexts.get(pluginId);
            if (context && context.subscriptions) {
                for (const subscription of context.subscriptions) {
                    try {
                        subscription.dispose();
                    } catch (error) {
                        console.error(`Error disposing subscription for plugin ${pluginId}:`, error);
                    }
                }

                // Clear the subscriptions array but keep the context
                context.subscriptions = [];
            }
        } else {
            throw new Error(`Plugin with id ${pluginId} not found.`);
        }
    }

    /**
     * 注册自定义模块
     * @param moduleName 模块名称
     * @param module 模块对象
     */
    registerModule(moduleName: string, module: any): void {
        this.modules.set(moduleName, module);
    }

    /**
     * 加载 commonjs 模块
     * @param url 插件的 url
     */
    async loadPlugin(url: string): Promise<JinPlugin> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch plugin: ${response.status} ${response.statusText}`);
            }

            const code = await response.text();
            const factory = new Function('module', 'exports', 'require', code);
            const _exports = {};
            const _module = { exports: _exports };

            // 提供支持自定义模块的require实现
            const _require = (request: string) => {
                // 首先检查是否注册了该模块
                if (this.modules.has(request)) {
                    return this.modules.get(request);
                }
                
                // 如果没有找到注册的模块，记录警告并返回空对象
                console.warn(`Plugin attempted to load module '${request}', but it's not registered`);
                return {}; // 返回空对象而不是undefined，减少运行时错误
            };

            factory(_module, _exports, _require);

            const pluginExport = <JinPlugin>(_module.exports !== _exports ? _module.exports : _exports);

            // 验证插件实现了必要的接口
            if (!pluginExport || typeof pluginExport.activate !== 'function') {
                throw new Error('Invalid plugin: missing required activate method');
            }

            return pluginExport as JinPlugin;
        } catch (error) {
            console.error('Error loading plugin:', error);
            throw new Error(`Failed to load plugin from ${url}: ${error.message}`);
        }
    }
}