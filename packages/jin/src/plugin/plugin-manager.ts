/**
 * 表示可释放资源的对象接口
 * 实现此接口的对象可以通过 dispose 方法释放其占用的资源
 */
export interface Disposable {
    /**
     * 释放对象占用的资源
     */
    dispose(): void;
}

/**
 * 插件上下文接口，提供插件运行时所需的环境和工具
 * 插件可以通过此上下文注册需要在插件停用时释放的资源
 */
export interface PluginContext {
    /**
     * 插件订阅的资源列表，这些资源将在插件停用时自动释放
     */
    subscriptions: Disposable[];
    /**
     * 允许添加其他上下文属性
     */
    [key: string]: any; // Allow for other context properties
}

/**
 * Jin 插件接口，所有插件必须实现此接口
 */
export interface JinPlugin {
    /**
     * 插件激活方法，当插件被激活时调用
     * @param context 插件上下文，提供插件运行所需的环境和工具
     * @returns 可以返回 void 或 Promise<void>
     */
    activate(context: PluginContext): void | Promise<void>;

    /**
     * 插件停用方法，当插件被停用时调用
     * 此方法是可选的
     * @returns 可以返回 void 或 Promise<void>
     */
    deactivate?(): void | Promise<void>;
}

/**
 * 插件清单接口，描述插件的基本信息和依赖关系
 */
export interface PluginManifest {
    /**
     * 插件的唯一标识符
     */
    id: string;

    /**
     * 插件的显示名称
     */
    name: string;

    /**
     * 插件的版本号
     */
    version: string;

    /**
     * 插件的URL地址，用于加载插件
     */
    url: string;

    /**
     * 插件的依赖项，键为依赖的插件ID，值为版本要求
     */
    dependencies?: Record<string, string>;

    /**
     * 插件的激活事件列表，指定在哪些事件发生时激活插件
     */
    activationEvents?: string[];
}

/**
 * 插件管理器接口，负责插件的注册、激活、停用和加载
 */
export interface PluginManager {
    /**
     * 注册插件
     * @param manifest 插件清单，包含插件的基本信息
     */
    registerPlugin(manifest: PluginManifest): Promise<void>;
    /**
     * 注册插件
     * @param manifest 插件清单，包含插件的基本信息
     * @param factory 创建插件实例的工厂函数
     */
    registerPlugin(manifest: Omit<PluginManifest, 'url'>, factory: (manifest: PluginManifest) => Promise<JinPlugin>): Promise<void>;

    /**
     * 激活指定ID的插件
     * @param pluginId 要激活的插件ID
     */
    activatePlugin(pluginId: string): Promise<void>;

    /**
     * 停用指定ID的插件
     * @param pluginId 要停用的插件ID
     */
    deactivatePlugin(pluginId: string): Promise<void>;

    /**
     * 从指定URL加载插件
     * @param url 插件的URL地址
     * @returns 加载的插件实例
     */
    loadPlugin(url: string): Promise<JinPlugin>;

    /**
     * 设置插件上下文
     * @param context 要设置的插件上下文
     */
    setPluginContext(context: Partial<PluginContext>): void;
}


