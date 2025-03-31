# Jin 插件系统

一个轻量级、灵活的 JavaScript/TypeScript 插件系统，基于 Vue 3 构建，支持动态加载和管理插件。

## 特性

- 🔌 插件生命周期管理
- 🚀 异步插件加载
- 🛠 TypeScript 支持
- 📦 支持 ESM 和 IIFE 格式
- 🔄 插件依赖管理
- 🎯 事件驱动的激活机制

## 安装

```bash
npm install @ruxuwu/jin

# 或使用 yarn
yarn add @ruxuwu/jin

# 或使用 pnpm
pnpm add @ruxuwu/jin
```

## 使用方法

### 基础使用

```typescript
import { SimplePluginManager, PluginManifest } from "@ruxuwu/jin";
// 创建插件管理器
const pluginManager = new SimplePluginManager();
// 创建插件清单
const manifest: PluginManifest = {
    id: "my-plugin",
    name: "My Plugin",
    version: "1.0.0",
    url: "https://example.com/my-plugin.js",
};

// 注册插件
await pluginManager.registerPlugin(manifest);

// 或者使用工厂函数注册插件
await pluginManager.registerPlugin({
    id: "local-plugin",
    name: "Local Plugin",
    version: "1.0.0"
}, async () => {
  // 返回插件实例
  return {
    activate(context) {
        // 插件激活时的逻辑
        console.log("Plugin activated!");
        // 注册需要在插件停用时释放的资源
        context.subscriptions.push({
            dispose: () => console.log("Resource disposed!")
        });
    },
    deactivate() {
        // 插件停用时的逻辑
        console.log("Plugin deactivated!");
    },
  };
});
// 设置共享的插件上下文
pluginManager.setPluginContext({
    api: {
        doSomething: () => console.log("Doing something...")
    }
});

// 激活插件
await pluginManager.activatePlugin("my-plugin");
await pluginManager.activatePlugin("local-plugin");
// 停用插件
await pluginManager.deactivatePlugin("my-plugin");
```

```html
<script src="https://example.com/my-plugin.js"></script>
<script>
    // Jin 会在全局创建 ruxuwu 对象
    const { pluginManager } = window.ruxuwu;
    // 注册插件
    window.ruxuwu.plugins.push({
        id: "my-browser-plugin",
        name: "My Browser Plugin",
        version: "1.0.0",
        url: "https://example.com/my-plugin.js"
    });
    // 激活插件
    pluginManager.activatePlugin("my-browser-plugin");
</script>
```

## 插件开发指南

### 插件结构

一个标准的 Jin 插件需要实现 `JinPlugin` 接口：

```typescript
interface JinPlugin {
  activate(context: PluginContext): void | Promise<void>;
  deactivate?(): void | Promise<void>;
}
```

### 插件上下文

插件上下文提供了与系统交互的能力：

```typescript
interface PluginContext {
    // 插件订阅的资源列表，这些资源将在插件停用时自动释放
    subscriptions: Disposable[];
    // 允许添加其他上下文属性
    [key: string]: any;
}

// 可释放资源接口
interface Disposable {
    dispose(): void;
}
```

### 插件清单

每个插件都需要一个清单文件来描述其基本信息：

```typescript
interface PluginManifest {
    // 插件唯一标识
    id: string;
    // 插件名称
    name: string;
    // 插件版本
    version: string;
    // 插件加载地址
    url: string;
    // 插件依赖项
    dependencies?: Record<string, string>;
    // 激活事件
    activationEvents?: string[];
}
```

## 构建和测试

```bash
# 安装依赖
pnpm install

# 构建
pnpm build

# 运行测试
pnpm test
```

## 许可证

MIT
