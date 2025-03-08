import type { PluginManager, PluginManifest, JinPlugin, PluginContext, Disposable } from '../plugin-manager';

export class SimplePluginManager implements PluginManager {
    
    private plugins: Map<string, JinPlugin> = new Map();
    private basePluginContext: Partial<PluginContext> = {}; // Base context with shared properties
    private pluginContexts: Map<string, PluginContext> = new Map(); // Individual contexts for each plugin

    // 新增方法：设置基础 PluginContext
    setPluginContext(context: Partial<PluginContext>): void {
        this.basePluginContext = { ...this.basePluginContext, ...context };
        
        // Update all existing plugin contexts with the new base context
        for (const pluginId of this.plugins.keys()) {
            this.createOrUpdatePluginContext(pluginId);
        }
    }

    // Helper method to create or update a plugin's context
    private createOrUpdatePluginContext(pluginId: string): PluginContext {
        const existingContext = this.pluginContexts.get(pluginId);
        
        // 直接更新现有上下文的属性，而不是创建新的上下文
        if (existingContext) {
            existingContext.subscriptions = existingContext.subscriptions || [];
            // 更新基础上下文属性
            Object.assign(existingContext, this.basePluginContext);
            return existingContext;
        }
        // 如果不存在，则创建新的上下文
        const subscriptions = [];
        const context: PluginContext = {
            ...this.basePluginContext,
            subscriptions
        } as PluginContext;
        this.pluginContexts.set(pluginId, context);
        return context;
    }

    async registerPlugin(manifest: PluginManifest, factory: (manifest: PluginManifest) => Promise<JinPlugin>): Promise<void> {
        const plugin = await factory(manifest);
        this.plugins.set(manifest.id, plugin);
        
        // Create a dedicated context for this plugin
        this.createOrUpdatePluginContext(manifest.id);
    }

    async activatePlugin(pluginId: string): Promise<void> {
        const plugin = this.plugins.get(pluginId);
        if (plugin) {
            // Get the plugin's dedicated context
            const context = this.pluginContexts.get(pluginId);
            if (!context) {
                throw new Error(`Context for plugin ${pluginId} not found.`);
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
     * 加载 commonjs 模块
     * @param url 插件的 url
     */
    async loadPlugin(url: string): Promise<JinPlugin> {
        const response = await fetch(url);
        const code = await response.text();
        const factory = new Function('module', code);
        const module = { exports: {} };
        factory(module); // 调用工厂函数以执行插件代码
        const data = module.exports as JinPlugin; // 返回导出的插件
        return data;
    }
}