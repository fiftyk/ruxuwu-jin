export interface Disposable {
    dispose(): void;
}
export interface PluginContext {
    subscriptions: Disposable[];
    [key: string]: any;
}
export interface JinPlugin {
    activate(context: PluginContext): void | Promise<void>;
    deactivate?(): void | Promise<void>;
}
export interface PluginManifest {
    id: string;
    name: string;
    version: string;
    url: string;
    dependencies?: Record<string, string>;
    activationEvents?: string[];
}
export interface PluginManager {
    registerPlugin(manifest: PluginManifest, factory: () => Promise<JinPlugin>): Promise<void>;
    activatePlugin(pluginId: string): Promise<void>;
    deactivatePlugin(pluginId: string): Promise<void>;
    loadPlugin(url: string): Promise<JinPlugin>;
    setPluginContext(context: Partial<PluginContext>): void;
}
